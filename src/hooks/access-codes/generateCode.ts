
import { User } from "@supabase/supabase-js";
import { toast } from "@/components/ui/use-toast";

/**
 * Generates a random alphanumeric code of specified length
 * Kept for utility purposes
 */
export const generateRandomCode = (length: number = 8) => {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * REMOVED: Generate code functionality
 * This function is now a placeholder that indicates the functionality has been removed
 */
export const generateAccessCode = async (user: User | null, type: "directive" | "medical"): Promise<string | null> => {
  console.log(`[generateAccessCode] Generate functionality has been removed by request`);
  
  toast({
    title: "Fonctionnalité désactivée",
    description: "La génération automatique de codes d'accès a été désactivée.",
    variant: "destructive"
  });
  
  return null; // Return null as generation is disabled
};
