
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface LogAccessOptions {
  userId: string; 
  accessCodeId: string;
  consultantName?: string; 
  consultantFirstName?: string;
  resourceType: "medical" | "directive";
  resourceId?: string;
  action: "view" | "download" | "print" | "share" | "access";
}

export const logAccessEvent = async (options: LogAccessOptions) => {
  try {
    const { 
      userId, 
      accessCodeId,
      consultantName, 
      consultantFirstName, 
      resourceType,
      resourceId,
      action 
    } = options;

    // Récupérer les informations sur l'environnement client
    const userAgent = navigator.userAgent;
    
    // Pour obtenir l'adresse IP, il faut normalement passer par un service côté serveur
    // Ici, pour des raisons de démonstration nous allons l'enregistrer comme "client_side"
    // Dans un environnement de production, cela devrait être remplacé par une fonction Edge
    const ipAddress = "client_side";

    // Enregistrer l'événement d'accès dans la table document_access_logs
    const { error } = await supabase
      .from('document_access_logs')
      .insert({
        user_id: userId,
        access_code_id: accessCodeId,
        nom_consultant: consultantName || null,
        prenom_consultant: consultantFirstName || null,
        ip_address: ipAddress,
        user_agent: userAgent,
        resource_type: resourceType,
        resource_id: resourceId,
        action_type: action,
        date_consultation: new Date().toISOString()
      });

    if (error) {
      console.error("Erreur lors de la journalisation de l'accès:", error);
      return false;
    }

    console.log(`Accès ${action} journalisé avec succès pour ${resourceType}`);
    return true;
  } catch (error) {
    console.error("Erreur lors de la journalisation:", error);
    return false;
  }
};

// Fonction utilitaire pour afficher une notification de journalisation
export const notifyAccessLogged = (action: string, success: boolean) => {
  if (success) {
    toast({
      description: `L'accès ${action} a été enregistré conformément aux normes HDS.`,
      duration: 3000,
    });
  }
};

// Fonction pour journaliser une erreur d'accès
export const logAccessError = async (userId: string, error: any, resourceType: string) => {
  try {
    const { error: logError } = await supabase
      .from('document_access_logs')
      .insert({
        user_id: userId,
        ip_address: "client_side",
        user_agent: navigator.userAgent,
        resource_type: resourceType,
        action_type: "error",
        error_details: JSON.stringify(error),
        date_consultation: new Date().toISOString()
      });
      
    if (logError) {
      console.error("Erreur lors de la journalisation de l'erreur:", logError);
    }
  } catch (e) {
    console.error("Erreur lors de la journalisation de l'erreur:", e);
  }
};
