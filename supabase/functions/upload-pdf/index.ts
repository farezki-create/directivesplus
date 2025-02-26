
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
    const formData = await req.formData()
    const file = formData.get('file')
    const description = formData.get('description')
    const userId = formData.get('userId')

    if (!file) {
      return new Response(
        JSON.stringify({ error: 'Aucun fichier téléchargé' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'Utilisateur non identifié' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      )
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Nettoyer le nom du fichier en supprimant les caractères non-ASCII
    const originalFileName = (file as File).name;
    const sanitizedFileName = originalFileName.replace(/[^\x00-\x7F]/g, '');
    
    // Extraire l'extension du fichier
    const fileExt = sanitizedFileName.split('.').pop();
    const fileName = sanitizedFileName.split('.').slice(0, -1).join('.');
    
    // Créer un nom de fichier unique avec UUID
    const uniqueFileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `${uniqueFileName}`;

    // Télécharger le fichier
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('pdf_documents')
      .upload(filePath, file, {
        contentType: (file as File).type,
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
        file_name: sanitizedFileName,
        file_path: filePath,
        file_size: (file as File).size,
        content_type: (file as File).type,
        description: description || null
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
        message: 'Fichier téléchargé avec succès', 
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
