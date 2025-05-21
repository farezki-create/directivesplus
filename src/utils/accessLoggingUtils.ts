
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface AccessEventLog {
  userId: string;
  accessCodeId: string;
  consultantName?: string;
  consultantFirstName?: string;
  resourceType: string;
  resourceId?: string;
  action: string;
  success: boolean;
  details?: string;
}

export const logAccessEvent = async (event: AccessEventLog): Promise<boolean> => {
  try {
    // Make sure we have valid UUIDs or handle non-UUID values
    const validUserId = isValidUUID(event.userId) ? 
      event.userId : 
      '00000000-0000-0000-0000-000000000000';
    
    const validAccessCodeId = isValidUUID(event.accessCodeId) ? 
      event.accessCodeId : 
      null;

    // Logging pour le débogage
    console.log("Logging access event:", {
      ...event,
      userId: validUserId,
      accessCodeId: validAccessCodeId
    });

    // Créer le détail de l'événement
    const details = `ResourceType: ${event.resourceType} | Action: ${event.action} | ResourceID: ${event.resourceId || 'general_access'} | Success: ${event.success}`;
    
    const { error } = await supabase
      .from('document_access_logs')
      .insert({
        user_id: validUserId,
        access_code_id: validAccessCodeId,
        nom_consultant: event.consultantName || 'Unknown',
        prenom_consultant: event.consultantFirstName || 'Unknown',
        ip_address: 'client_side',
        user_agent: navigator.userAgent + ' | ' + details
      });

    if (error) {
      console.error("Erreur lors de la journalisation de l'accès:", error);
      return false;
    }
    
    return !error;
  } catch (error) {
    console.error("Erreur lors de la journalisation de l'accès:", error);
    return false;
  }
};

// Add the notifyAccessLogged function
export const notifyAccessLogged = (action: string, success: boolean) => {
  if (success) {
    toast({
      title: "Journal d'accès",
      description: `Les détails de ${action} ont été journalisés avec succès.`
    });
  } else {
    console.warn("La journalisation de l'accès a échoué");
  }
};

// Helper function to validate UUID format
function isValidUUID(uuid: string): boolean {
  if (!uuid) return false;
  
  // UUID format regex validation
  const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return regex.test(uuid);
}
