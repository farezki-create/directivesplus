
import { toast } from "@/hooks/use-toast";
import { ErrorType, logError } from "./error-logger";

/**
 * Gestionnaire d'erreurs centralisé pour l'application
 * Permet de traiter les erreurs de manière cohérente avec journalisation et notification
 */

// Messages d'erreur utilisateur par type d'erreur
const ERROR_MESSAGES = {
  [ErrorType.VALIDATION]: "Veuillez vérifier les informations saisies.",
  [ErrorType.AUTHENTICATION]: "Un problème d'authentification est survenu.",
  [ErrorType.NETWORK]: "Problème de connexion réseau.",
  [ErrorType.API]: "Un problème est survenu lors de la communication avec le serveur.",
  [ErrorType.DATABASE]: "Problème d'accès aux données.",
  [ErrorType.UNKNOWN]: "Une erreur inattendue s'est produite."
};

/**
 * Traite une erreur avec journalisation et notification à l'utilisateur
 * @param error L'erreur à traiter
 * @param errorType Le type d'erreur pour la classification
 * @param component Le composant où l'erreur s'est produite
 * @param action L'action qui a généré l'erreur
 * @param showToast Afficher une notification à l'utilisateur
 * @param customMessage Message personnalisé à afficher à l'utilisateur
 */
export async function handleError(
  error: Error | unknown,
  errorType: ErrorType = ErrorType.UNKNOWN,
  component?: string,
  action?: string,
  showToast: boolean = true,
  customMessage?: string
): Promise<void> {
  // Journalisation de l'erreur
  await logError(error, errorType, { component, action });

  // Notification à l'utilisateur si demandé
  if (showToast) {
    const message = customMessage || ERROR_MESSAGES[errorType];
    toast({
      title: "Erreur",
      description: message,
      variant: "destructive",
    });
  }
}

/**
 * HOC pour envelopper une fonction asynchrone avec gestion d'erreurs
 * @param fn Fonction à exécuter
 * @param errorType Type d'erreur par défaut
 * @param component Composant concerné
 * @param action Action concernée
 * @param showToast Afficher une notification en cas d'erreur
 * @returns La fonction enveloppée avec gestion d'erreurs
 */
export function withErrorHandling<T, Args extends any[]>(
  fn: (...args: Args) => Promise<T>,
  errorType: ErrorType = ErrorType.UNKNOWN,
  component?: string,
  action?: string,
  showToast: boolean = true
): (...args: Args) => Promise<T | undefined> {
  return async (...args: Args): Promise<T | undefined> => {
    try {
      return await fn(...args);
    } catch (error) {
      await handleError(error, errorType, component, action, showToast);
      return undefined;
    }
  };
}
