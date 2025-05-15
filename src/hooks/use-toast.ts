
import { useToast as useShadcnToast } from "@/components/ui/use-toast";
import { toast as shadcnToast } from "@/components/ui/toast";

// Re-export the hook and toast function
export const useToast = useShadcnToast;
export const toast = shadcnToast;
