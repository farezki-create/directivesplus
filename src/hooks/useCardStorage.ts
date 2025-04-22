
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { UserProfile } from "@/components/pdf/types";
import { saveCardToStorage } from "@/services/card/utils/cardStorage";

export function useCardStorage(userId: string | null) {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [storageError, setStorageError] = useState<string | null>(null);

  const storeCard = async (cardPdfUrl: string, profile: UserProfile) => {
    if (!userId) {
      setStorageError("User ID is required");
      return null;
    }

    setIsSaving(true);
    setStorageError(null);

    try {
      const result = await saveCardToStorage(cardPdfUrl, userId, profile);
      return result;
    } catch (error) {
      console.error("[useCardStorage] Error saving card:", error);
      setStorageError((error as Error).message);
      
      toast({
        title: "Erreur de sauvegarde",
        description: "La carte n'a pas pu être sauvegardée dans le stockage",
        variant: "destructive",
      });
      
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    storeCard,
    isSaving,
    storageError
  };
}
