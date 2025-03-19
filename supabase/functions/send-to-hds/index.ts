
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
      throw new Error("La configuration de l'API HDS est incomplète. Vérifiez les variables d'environnement.");
    }
    
    // Extraire les données de la requête
    const { pdfData, userId, metadata }: HDSSaveRequest = await req.json();
    
    if (!pdfData || !userId) {
      throw new Error("Les données PDF ou l'ID utilisateur sont manquants");
    }

    console.log(`[HDS] Tentative d'enregistrement du document pour l'utilisateur ${userId}`);
    console.log(`[HDS] Métadonnées: ${JSON.stringify(metadata)}`);

    // Préparer les données pour l'appel à l'API HDS
    // Note: La structure exacte dépendra de l'API HDS spécifique que vous utilisez
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
      const errorData = await response.json().catch(() => null);
      console.error("[HDS] Échec de l'appel API:", response.status, errorData);
      throw new Error(`Échec de l'appel à l'API HDS: ${response.status}`);
    }

    const responseData = await response.json();
    console.log("[HDS] Réponse de l'API:", responseData);
    */

    // Pour le moment, simulons une réponse réussie
    const mockResponseData = {
      success: true,
      documentId: `hds-doc-${Date.now()}`,
      storageLocation: "HDS_SECURE_STORAGE",
      timestamp: new Date().toISOString()
    };

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
