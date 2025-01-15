import { Dialog, DialogContent as UIDialogContent, DialogFooter } from "@/components/ui/dialog";
import { Header } from "@/components/Header";
import { useSession } from "@supabase/auth-helpers-react";
import { useState, useEffect } from "react";
import { DialogContent } from "./DialogContent";
import { SubmitButton } from "./SubmitButton";

interface QuestionsDialogLayoutProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  onSubmit: () => void;
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
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    console.log("État actuel :", {
      session: !!session,
      loading,
      questionsLength,
      isSaving
    });
  }, [session, loading, questionsLength, isSaving]);

  const handleSubmit = async () => {
    if (!session) {
      console.log("Pas de session utilisateur, impossible de sauvegarder");
      return;
    }

    try {
      console.log("Début de la sauvegarde...");
      setIsSaving(true);
      await onSubmit();
      console.log("Sauvegarde terminée avec succès");
    } catch (error) {
      console.error("Erreur lors de la sauvegarde :", error);
    } finally {
      setIsSaving(false);
    }
  };

  const isButtonDisabled = !session || questionsLength === 0 || isSaving;

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
              isDisabled={isButtonDisabled}
              isSaving={isSaving}
              onClick={handleSubmit}
            />
          </DialogFooter>
        </div>
      </UIDialogContent>
    </Dialog>
  );
}