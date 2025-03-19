
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

// Obtenez les informations d'authentification de l'API HDS depuis les variables d'environnement
const HDS_API_URL = Deno.env.get("HDS_API_URL");
const HDS_API_KEY = Deno.env.get("HDS_API_KEY");
const HDS_CLIENT_ID = Deno.env.get("HDS_CLIENT_ID");

// Définir les en-têtes CORS pour permettre les requêtes depuis le frontend
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface HDSSaveRequest {
  pdfData: string;
  userId: string;
  metadata: {
    createdAt: string;
    documentType: string;
    patientId?: string;
    documentName: string;
  };
}

const handler = async (req: Request): Promise<Response> => {
  console.log("HDS storage function called");
  
  // Gérer les requêtes préliminaires CORS
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Vérifier que les informations d'authentification HDS sont configurées
    if (!HDS_API_URL || !HDS_API_KEY || !HDS_CLIENT_ID) {
      console.error("[HDS] Configuration manquante: HDS_API_URL, HDS_API_KEY ou HDS_CLIENT_ID non définis");
      throw new Error("La configuration de l'API HDS est incomplète. Vérifiez les variables d'environnement.");
    }
    
    // Extraire les données de la requête
    const { pdfData, userId, metadata }: HDSSaveRequest = await req.json();
    
    if (!pdfData || !userId) {
      console.error("[HDS] Requête invalide: données PDF ou userId manquants");
      throw new Error("Les données PDF ou l'ID utilisateur sont manquants");
    }

    // Vérifier la taille approximative du PDF en Base64
    const pdfSizeKB = Math.round(pdfData.length * 0.75 / 1024);
    console.log(`[HDS] Taille approximative du PDF: ${pdfSizeKB} KB`);
    
    if (pdfSizeKB > 10000) { // Limite à 10MB
      console.error(`[HDS] PDF trop volumineux: ${pdfSizeKB} KB`);
      throw new Error(`Le PDF est trop volumineux (${pdfSizeKB} KB). La taille maximale acceptée est de 10MB.`);
    }

    console.log(`[HDS] Tentative d'enregistrement du document pour l'utilisateur ${userId}`);
    console.log(`[HDS] Métadonnées: ${JSON.stringify(metadata)}`);

    // Préparer les données pour l'appel à l'API HDS
    const requestBody = {
      document: pdfData,
      patientId: metadata.patientId || userId,
      documentType: metadata.documentType || "DIRECTIVES_ANTICIPEES",
      documentName: metadata.documentName || `directives_anticipees_${new Date().toISOString()}`,
      createdAt: metadata.createdAt || new Date().toISOString(),
      format: "application/pdf"
    };

    // Simuler l'appel à l'API HDS (à remplacer par le véritable appel API)
    console.log("[HDS] Envoi des données à l'API HDS...");
    
    /* 
    // Voici le code à décommenter et adapter pour l'intégration réelle:
    try {
      const response = await fetch(HDS_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${HDS_API_KEY}`,
          "X-Client-Id": HDS_CLIENT_ID
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[HDS] Échec de l'appel API: ${response.status}`, errorText);
        throw new Error(`Échec de l'appel à l'API HDS: ${response.status} - ${errorText}`);
      }

      const responseData = await response.json();
      console.log("[HDS] Réponse de l'API:", responseData);
      
      return new Response(JSON.stringify({ 
        success: true,
        message: "Document envoyé avec succès à l'hébergeur HDS",
        data: responseData
      }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      });
    } catch (fetchError) {
      console.error("[HDS] Erreur lors de la requête:", fetchError);
      throw new Error(`Erreur de communication avec l'API HDS: ${fetchError.message}`);
    }
    */

    // Pour le moment, simulons une réponse réussie
    const mockResponseData = {
      success: true,
      documentId: `hds-doc-${Date.now()}`,
      storageLocation: "HDS_SECURE_STORAGE",
      timestamp: new Date().toISOString()
    };

    // Ajouter un délai simulé pour tester l'expérience utilisateur
    await new Promise(resolve => setTimeout(resolve, 1500));

    return new Response(JSON.stringify({ 
      success: true,
      message: "Document envoyé avec succès à l'hébergeur HDS",
      data: mockResponseData
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Erreur lors de l'envoi du document à l'API HDS:", error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || "Une erreur inconnue s'est produite",
        stack: error.stack
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
