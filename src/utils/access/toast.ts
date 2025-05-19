
import { toast } from "@/hooks/use-toast";

// Gestionnaires de notifications toast
export const showErrorToast = (title: string, description: string) => {
  toast({
    title,
    description,
    variant: "destructive"
  });
};

export const showSuccessToast = (title: string, description: string) => {
  toast({
    title,
    description,
  });
};
