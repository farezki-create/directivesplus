
import { Button } from "@/components/ui/button";
import { Database, Shield } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface HDSStorageButtonProps {
  onSave: () => Promise<boolean>;
  disabled?: boolean;
}

export function HDSStorageButton({ onSave, disabled = false }: HDSStorageButtonProps) {
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const result = await onSave();
      if (!result) {
        toast({
          title: "Attention",
          description: "Problème lors de l'envoi vers l'hébergeur HDS.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi vers HDS:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi vers l'hébergeur HDS.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="default"
      className="flex items-center gap-2"
      onClick={handleSave}
      disabled={disabled || isSaving}
    >
      {isSaving ? (
        <>
          <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span>Envoi en cours...</span>
        </>
      ) : (
        <>
          <Database className="h-4 w-4" />
          <Shield className="h-4 w-4" />
          <span>Envoyer vers hébergeur HDS</span>
        </>
      )}
    </Button>
  );
}
