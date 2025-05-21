
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { ErrorType, handleError } from "@/utils/error-handling";

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

    // Format combiné pour stocker les métadonnées de ressource jusqu'à la mise à jour des types
    const enhancedUserAgent = `${userAgent} | ResourceType: ${resourceType} | Action: ${action} | ResourceID: ${resourceId || "general_access"}`;

    // Enregistrer l'événement d'accès dans la table document_access_logs
    // IMPORTANT: Nous utilisons uniquement les champs reconnus par TypeScript
    // Les nouveaux champs seront gérés après mise à jour des types
    const { error } = await supabase
      .from('document_access_logs')
      .insert({
        user_id: userId,
        access_code_id: accessCodeId,
        nom_consultant: consultantName || null,
        prenom_consultant: consultantFirstName || null,
        ip_address: ipAddress,
        user_agent: enhancedUserAgent
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
    const userAgent = navigator.userAgent;
    const enhancedUserAgent = `Error logging | ResourceType: ${resourceType} | Error: ${JSON.stringify(error).slice(0, 500)}`;
    
    const { error: logError } = await supabase
      .from('document_access_logs')
      .insert({
        user_id: userId,
        ip_address: "client_side",
        user_agent: enhancedUserAgent,
        // Nous ne pouvons pas utiliser les nouveaux champs tant que les types ne sont pas mis à jour
        access_code_id: "error_log" // Pour respecter la contrainte non-null
      });
      
    if (logError) {
      console.error("Erreur lors de la journalisation de l'erreur:", logError);
    }
  } catch (e) {
    console.error("Erreur lors de la journalisation de l'erreur:", e);
  }
};

/**
 * Recherche et analyse les journaux d'accès pour détecter des activités suspectes
 * @param userId ID de l'utilisateur pour lequel rechercher les logs
 * @param daysBack Nombre de jours à analyser (défaut: 30)
 */
export const auditAccessLogs = async (userId: string, daysBack: number = 30) => {
  try {
    // Calculer la date de début pour la recherche
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);
    const startDateStr = startDate.toISOString();
    
    // Récupérer les logs d'accès pour la période spécifiée
    const { data: logs, error } = await supabase
      .from('document_access_logs')
      .select('*')
      .eq('user_id', userId)
      .gte('date_consultation', startDateStr)
      .order('date_consultation', { ascending: false });
      
    if (error) {
      throw error;
    }
    
    if (!logs || logs.length === 0) {
      return {
        suspicious: false,
        message: "Aucun log d'accès trouvé pour la période spécifiée.",
        details: null,
        stats: {
          totalAccesses: 0,
          uniqueIPs: 0,
          uniqueAgents: 0
        }
      };
    }
    
    // Analyser les logs pour détecter des activités suspectes
    const ipAddresses = new Set<string>();
    const userAgents = new Set<string>();
    const accessesByDay = new Map<string, number>();
    const suspiciousActivities = [];
    
    // Seuil pour les accès par jour considérés comme suspects
    const suspiciousAccessThreshold = 20;
    
    logs.forEach(log => {
      // Collecter les IP et user agents uniques
      if (log.ip_address && log.ip_address !== 'client_side') {
        ipAddresses.add(log.ip_address);
      }
      
      if (log.user_agent) {
        userAgents.add(log.user_agent);
      }
      
      // Compter les accès par jour
      const day = new Date(log.date_consultation).toISOString().split('T')[0];
      accessesByDay.set(day, (accessesByDay.get(day) || 0) + 1);
      
      // Vérifier les activités nocturnes (entre minuit et 5h du matin)
      const hour = new Date(log.date_consultation).getHours();
      if (hour >= 0 && hour < 5) {
        suspiciousActivities.push({
          type: "accès_nocturne",
          details: `Accès le ${new Date(log.date_consultation).toLocaleString()} depuis ${log.ip_address || 'IP inconnue'}`,
          timestamp: log.date_consultation,
          log_id: log.id
        });
      }
    });
    
    // Vérifier les jours avec un nombre anormal d'accès
    for (const [day, count] of accessesByDay.entries()) {
      if (count > suspiciousAccessThreshold) {
        suspiciousActivities.push({
          type: "nombre_accès_élevé",
          details: `${count} accès détectés le ${day}`,
          day,
          count
        });
      }
    }
    
    // Statistiques et résumé
    const stats = {
      totalAccesses: logs.length,
      uniqueIPs: ipAddresses.size,
      uniqueAgents: userAgents.size,
      mostActiveDay: [...accessesByDay.entries()].sort((a, b) => b[1] - a[1])[0]
    };
    
    const suspicious = suspiciousActivities.length > 0;
    
    return {
      suspicious,
      message: suspicious ? 
        `${suspiciousActivities.length} activité(s) suspecte(s) détectée(s)` : 
        "Aucune activité suspecte détectée",
      details: suspiciousActivities,
      stats
    };
    
  } catch (error) {
    await handleError({
      error,
      type: ErrorType.DATABASE,
      component: "AccessLogAudit",
      operation: "auditAccessLogs",
      showToast: false
    });
    
    return {
      suspicious: false,
      message: "Erreur lors de l'analyse des logs d'accès",
      details: null,
      error
    };
  }
};
