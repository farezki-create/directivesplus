
import { toast } from '@/hooks/use-toast';
import { handleError, ErrorType } from '@/utils/error-handling/error-handler';

interface UseErrorHandlerOptions {
  component: string;
  showToast?: boolean;
}

export const useErrorHandler = ({ component, showToast = true }: UseErrorHandlerOptions) => {
  const handleAuthError = async (error: any, operation: string) => {
    console.error(`❌ [${component}] Erreur ${operation}:`, error);
    
    await handleError({
      error,
      type: ErrorType.AUTH,
      component,
      operation,
      showToast,
      toastMessage: error.message || "Une erreur d'authentification s'est produite"
    });
  };

  const handleGenericError = async (error: any, operation: string) => {
    console.error(`❌ [${component}] Erreur ${operation}:`, error);
    
    await handleError({
      error,
      type: ErrorType.CLIENT,
      component,
      operation,
      showToast,
      toastMessage: error.message || "Une erreur s'est produite"
    });
  };

  return {
    handleError: handleGenericError,
    handleAuthError,
  };
};
