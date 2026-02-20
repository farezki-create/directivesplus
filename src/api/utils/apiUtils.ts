
import { toast } from "@/hooks/use-toast";

/**
 * Makes API calls with retry and backoff mechanism
 * @param apiFn Function that makes the API call
 * @param maxRetries Maximum number of retries
 * @returns API response
 */
export const retryWithBackoff = async (apiFn: () => Promise<any>, maxRetries = 3) => {
  let retries = 0;
  while (retries < maxRetries) {
    try {
      return await apiFn();
    } catch (err) {
      retries++;
      if (retries >= maxRetries) {
        throw err;
      }
      // Exponential backoff
      const delay = Math.pow(2, retries) * 500 + Math.floor(Math.random() * 500);
      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

/**
 * Shows error toast with standardized format
 * @param title Title of the error toast
 * @param message Error message
 */
export const showErrorToast = (title: string, message: string) => {
  toast({
    variant: "destructive",
    title,
    description: message
  });
};
