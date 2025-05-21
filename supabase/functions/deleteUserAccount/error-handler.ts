
import { corsHeaders, createErrorResponse } from "./corsHelpers.ts";

/**
 * Capture et gère les erreurs dans les edge functions
 * @param fn Fonction à exécuter avec gestion d'erreur
 */
export function withErrorHandler(fn: (req: Request) => Promise<Response>) {
  return async (req: Request): Promise<Response> => {
    try {
      // Exécution de la fonction avec gestion des erreurs
      return await fn(req);
    } catch (error) {
      console.error("Erreur non gérée:", error);
      
      // Détermine le statut HTTP approprié
      const status = error instanceof URIError || error instanceof SyntaxError ? 400 : 500;
      
      // Crée une réponse d'erreur standardisée
      return createErrorResponse(
        "Une erreur est survenue lors du traitement de la demande", 
        status, 
        error instanceof Error ? error.message : String(error)
      );
    }
  };
}

/**
 * Fonction pour créer des réponses d'erreur améliorées avec contexte
 * @param message Message d'erreur principal
 * @param status Code d'état HTTP
 * @param context Contexte ou détails supplémentaires
 * @param errorCode Code d'erreur optionnel pour classification
 */
export function createEnhancedErrorResponse(
  message: string, 
  status = 400, 
  context?: any,
  errorCode?: string
) {
  return new Response(
    JSON.stringify({ 
      error: message,
      code: errorCode,
      context: context ? context : undefined,
      timestamp: new Date().toISOString()
    }),
    {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    }
  );
}
