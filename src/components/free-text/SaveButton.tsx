
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface SaveButtonProps {
  userId: string;
  freeText: string;
  hasChanges: boolean;
  loading: boolean;
  onSaveComplete?: () => void;
  setLoading: (loading: boolean) => void;
  setInitialText: (text: string) => void;
  setIsSaved: (saved: boolean) => void;
}

export function SaveButton({
  userId,
  freeText,
  hasChanges,
  loading,
  onSaveComplete,
  setLoading,
  setInitialText,
  setIsSaved,
}: SaveButtonProps) {
  const handleSubmit = async () => {
    if (onSaveComplete) {
      onSaveComplete();
    }
  };

  return (
    <Button
      onClick={handleSubmit}
      disabled={loading || (hasChanges === false && freeText.trim().length === 0)}
      className="w-full"
    >
      <Save className="mr-2 h-4 w-4" />
      Enregistrer mes directives anticipées
    </Button>
  );
}
