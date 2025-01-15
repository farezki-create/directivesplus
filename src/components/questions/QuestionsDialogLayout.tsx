import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Header } from "@/components/Header";
import { useSession } from "@supabase/auth-helpers-react";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

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

  // Modification des conditions d'activation du bouton
  const isButtonDisabled = !session || questionsLength === 0 || isSaving;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] h-[90vh] max-h-[90vh] p-0 flex flex-col">
        <Header />
        
        <div className="flex-1 overflow-hidden flex flex-col p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-center">
              {title}
            </DialogTitle>
          </DialogHeader>
          
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : questionsLength > 0 ? (
            <ScrollArea className="flex-1 px-1">
              <div className="space-y-6 py-4">
                {children}
              </div>
            </ScrollArea>
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              Aucune question trouvée.
            </div>
          )}

          <DialogFooter className="mt-6">
            <Button
              onClick={handleSubmit}
              className="w-full sm:w-auto"
              disabled={isButtonDisabled}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                'Enregistrer mes réponses'
              )}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}