
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Gestion des requêtes OPTIONS pour CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { pdfUrl, userId, description } = await req.json();

    if (!pdfUrl) {
      return new Response(
        JSON.stringify({ error: 'URL du PDF manquante' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'Utilisateur non identifié' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      )
    }

    console.log(`Téléchargement du fichier depuis: ${pdfUrl}`);

    // Télécharger le fichier
    const response = await fetch(pdfUrl);
    
    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: `Erreur lors du téléchargement: ${response.status} ${response.statusText}` }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    const fileBlob = await response.blob();
    
    // Extraire le nom du fichier de l'URL
    const urlParts = pdfUrl.split('/');
    const fileName = urlParts[urlParts.length - 1];
    const sanitizedFileName = fileName.replace(/[^\x00-\x7F]/g, '');

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Générer un nom de fichier unique
    const filePath = `${crypto.randomUUID()}.pdf`;

    console.log(`Téléchargement vers Supabase Storage: ${filePath}`);

    // Télécharger le fichier dans Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('pdf_documents')
      .upload(filePath, fileBlob, {
        contentType: 'application/pdf',
        upsert: false
      })

    if (uploadError) {
      console.error("Erreur d'upload:", uploadError);
      return new Response(
        JSON.stringify({ error: 'Échec du téléchargement du fichier', details: uploadError }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // Créer une entrée dans la table pdf_documents
    const { error: dbError } = await supabase
      .from('pdf_documents')
      .insert({
        user_id: userId,
        file_name: sanitizedFileName || 'document-has-sante.pdf',
        file_path: filePath,
        file_size: fileBlob.size,
        content_type: 'application/pdf',
        description: description || "Directives anticipées concernant les situations de fin de vie - HAS"
      })

    if (dbError) {
      console.error("Erreur de base de données:", dbError);
      // Supprimer le fichier si l'insertion dans la base de données échoue
      await supabase.storage.from('pdf_documents').remove([filePath]);
      
      return new Response(
        JSON.stringify({ error: 'Échec de l\'enregistrement des métadonnées', details: dbError }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // Obtenir l'URL publique du fichier
    const { data: publicUrlData } = supabase.storage
      .from('pdf_documents')
      .getPublicUrl(filePath);

    return new Response(
      JSON.stringify({ 
        message: 'Document PDF téléchargé avec succès', 
        filePath,
        publicUrl: publicUrlData.publicUrl 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    console.error("Erreur inattendue:", error);
    return new Response(
      JSON.stringify({ error: 'Une erreur inattendue est survenue', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
