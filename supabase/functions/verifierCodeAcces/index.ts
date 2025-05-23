
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.24.0";
import { corsHeaders } from "./corsHelpers.ts";

// Create a Supabase client with the Auth context of the logged in user.
const supabaseClient = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_ANON_KEY") ?? ""
);

serve(async (req: Request) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    console.log("verifierCodeAcces function called");
    
    const { accessCode, patientName, patientBirthDate, bruteForceIdentifier, userId, accessType } = await req.json();
    console.log("Request params:", { 
      hasAccessCode: !!accessCode, 
      hasPatientName: !!patientName, 
      hasPatientBirthDate: !!patientBirthDate,
      identifier: bruteForceIdentifier,
      hasUserId: !!userId,
      accessType
    });

    // Authentificated user access flow
    if (userId) {
      console.log("Handling authenticated user access for userId:", userId);
      
      // Get user profile
      const { data: profileData, error: profileError } = await supabaseClient
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (profileError) {
        console.error("Error fetching profile:", profileError);
        return new Response(
          JSON.stringify({
            success: false,
            error: "Profil utilisateur non trouvé"
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400,
          }
        );
      }
      
      // Get user's documents
      const { data: documents, error: docsError } = await supabaseClient
        .from('pdf_documents')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (docsError) {
        console.error("Error fetching documents:", docsError);
      }
      
      // Create dossier
      const dossier = {
        id: `auth-${Date.now()}`,
        userId: userId,
        isFullAccess: true,
        isDirectivesOnly: accessType === "directive",
        isMedicalOnly: accessType === "medical",
        profileData: profileData || {
          first_name: "Utilisateur",
          last_name: "Non identifié",
          birth_date: null
        },
        contenu: {
          documents: documents || [],
          patient: {
            nom: profileData?.last_name || "Inconnu",
            prenom: profileData?.first_name || "Inconnu",
            date_naissance: profileData?.birth_date || null,
          }
        }
      };
      
      console.log("Created dossier for authenticated user:", JSON.stringify(dossier, null, 2));
      
      return new Response(
        JSON.stringify({
          success: true,
          dossier: dossier
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    } 
    
    // Code access flow
    if (accessCode) {
      console.log("Handling code access with code:", accessCode);

      // First try with shared profiles
      const { data: sharedProfiles, error: sharedProfileError } = await supabaseClient
        .from('shared_profiles')
        .select('*')
        .eq('access_code', accessCode);

      if (sharedProfileError) {
        console.error("Error fetching shared profile:", sharedProfileError);
      }

      if (sharedProfiles && sharedProfiles.length > 0) {
        const profile = sharedProfiles[0];
        console.log("Found shared profile:", profile);
        
        // Get associated documents if any
        const { data: documents, error: docsError } = await supabaseClient
          .from('pdf_documents')
          .select('*')
          .eq('user_id', profile.user_id)
          .order('created_at', { ascending: false });
        
        if (docsError) {
          console.error("Error fetching documents:", docsError);
        }
        
        // Build dossier object
        const dossier = {
          id: profile.id,
          userId: profile.user_id,
          isFullAccess: true,
          isDirectivesOnly: true, // Shared profiles are for directives
          isMedicalOnly: false,
          profileData: {
            first_name: profile.first_name,
            last_name: profile.last_name,
            birth_date: profile.birthdate
          },
          contenu: {
            documents: documents || [],
            patient: {
              nom: profile.last_name,
              prenom: profile.first_name,
              date_naissance: profile.birthdate
            }
          }
        };
        
        console.log("Created dossier from shared profile:", JSON.stringify(dossier, null, 2));
        
        return new Response(
          JSON.stringify({
            success: true,
            dossier
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
          }
        );
      }

      // If no shared profile found, try with medical dossiers
      const { data: dossierMedical, error: dossierError } = await supabaseClient
        .from('dossiers_medicaux')
        .select('*')
        .eq('code_acces', accessCode);
        
      if (dossierError) {
        console.error("Error fetching dossier:", dossierError);
      }

      if (dossierMedical && dossierMedical.length > 0) {
        const dossier = dossierMedical[0];
        console.log("Found medical dossier with code:", accessCode);
        
        // Log access
        try {
          // Since logs_acces might have RLS policies, we'll catch errors but not fail
          await supabaseClient
            .from('logs_acces')
            .insert({
              dossier_id: dossier.id,
              succes: true,
              details: `Accès via code: ${accessCode}, Identifiant: ${bruteForceIdentifier || 'direct'}`
            });
        } catch (logError) {
          console.error("Error logging access (continuing anyway):", logError);
        }
        
        return new Response(
          JSON.stringify({
            success: true,
            dossier: {
              id: dossier.id,
              isFullAccess: true,
              isDirectivesOnly: true,
              isMedicalOnly: false,
              contenu: dossier.contenu_dossier
            }
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
          }
        );
      }

      // No valid dossier found with the provided code
      console.log("No valid dossier found with code:", accessCode);
      
      // Log failed attempt but don't fail if it doesn't work
      try {
        await supabaseClient
          .from('logs_acces')
          .insert({
            succes: false,
            details: `Tentative échouée avec code: ${accessCode}, Identifiant: ${bruteForceIdentifier || 'direct'}`
          });
      } catch (logError) {
        console.error("Error logging failed access (continuing anyway):", logError);
      }
      
      return new Response(
        JSON.stringify({
          success: false,
          error: "Code d'accès invalide ou expiré"
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // If no valid access parameters provided
    return new Response(
      JSON.stringify({
        success: false,
        error: "Paramètres d'accès manquants ou invalides"
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );

  } catch (error) {
    console.error("Function error:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Une erreur est survenue lors de la vérification"
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
