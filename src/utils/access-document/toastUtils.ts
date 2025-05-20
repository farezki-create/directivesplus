
import { toast } from "@/hooks/use-toast";

/**
 * Shows an error toast notification
 */
export const showErrorToast = (title: string, description: string) => {
  toast({
    title,
    description,
    variant: "destructive"
  });
};

/**
 * Shows a success toast notification
 */
export const showSuccessToast = (title: string, description: string) => {
  toast({
    title,
    description,
  });
};
