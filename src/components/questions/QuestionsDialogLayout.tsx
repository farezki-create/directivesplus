import { Dialog, DialogContent as UIDialogContent, DialogFooter } from "@/components/ui/dialog";
import { Header } from "@/components/Header";
import { useSession } from "@supabase/auth-helpers-react";
import { useState } from "react";
import { DialogContent } from "./DialogContent";
import { SubmitButton } from "./SubmitButton";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface QuestionsDialogLayoutProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  onSubmit: () => Promise<void>;
  loading: boolean;
  questionsLength: number;
  children: React.ReactNode;
}

export function QuestionsDialogLayout({
  open,
  onOpenChange,
  title,
  onSubmit,
  loading,
  questionsLength,
  children
}: QuestionsDialogLayoutProps) {
  const session = useSession();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async () => {
    if (!session) {
      console.log("Redirection vers la page de connexion - utilisateur non connecté");
      toast({
        variant: "destructive",
        title: "Connexion requise",
        description: "Vous devez être connecté pour enregistrer vos réponses."
      });
      onOpenChange(false);
      navigate("/auth");
      return;
    }

    try {
      console.log("Début de la sauvegarde des réponses...");
      setIsSaving(true);
      await onSubmit();
      console.log("Sauvegarde réussie");
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde de vos réponses."
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <UIDialogContent className="sm:max-w-[800px] h-[90vh] max-h-[90vh] p-0 flex flex-col">
        <Header />
        
        <div className="flex-1 overflow-hidden flex flex-col p-6">
          <DialogContent
            title={title}
            loading={loading}
            questionsLength={questionsLength}
          >
            {children}
          </DialogContent>

          <DialogFooter className="mt-6">
            <SubmitButton
              isDisabled={!session || isSaving}
              isSaving={isSaving}
              onClick={handleSubmit}
            />
          </DialogFooter>
        </div>
      </UIDialogContent>
    </Dialog>
  );
}