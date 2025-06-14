
import { useCallback } from 'react';
import { toast } from "@/hooks/use-toast";
import { ErrorType, handleError as centralHandleError } from "@/utils/error-handling";

interface UseErrorHandlerOptions {
  component: string;
  showToast?: boolean;
}

export const useErrorHandler = ({ component, showToast = true }: UseErrorHandlerOptions) => {
  const handleError = useCallback(async (
    error: any,
    operation: string,
    customMessage?: string
  ) => {
    // Determine error type
    let errorType = ErrorType.UNKNOWN;
    
    if (error?.message?.includes('rate limit')) {
      errorType = ErrorType.AUTH_SECURITY;
    } else if (error?.message?.includes('auth') || error?.message?.includes('unauthorized')) {
      errorType = ErrorType.AUTH;
    } else if (error?.message?.includes('network') || error?.name === 'NetworkError') {
      errorType = ErrorType.NETWORK;
    } else if (error?.message?.includes('validation')) {
      errorType = ErrorType.VALIDATION;
    }

    // Use centralized error handler
    await centralHandleError({
      error,
      type: errorType,
      component,
      operation,
      showToast,
      toastMessage: customMessage
    });

    return errorType;
  }, [component, showToast]);

  const handleNetworkError = useCallback((error: any, operation: string) => {
    return handleError(error, operation, "Problème de connexion. Veuillez réessayer.");
  }, [handleError]);

  const handleAuthError = useCallback((error: any, operation: string) => {
    return handleError(error, operation, "Erreur d'authentification. Veuillez vous reconnecter.");
  }, [handleError]);

  const handleValidationError = useCallback((error: any, operation: string) => {
    return handleError(error, operation, "Les données saisies ne sont pas valides.");
  }, [handleError]);

  return {
    handleError,
    handleNetworkError,
    handleAuthError,
    handleValidationError
  };
};
