
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Header } from "@/components/Header";
import { useLanguage } from "@/hooks/language/useLanguage";

interface QuestionsDialogLayoutProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  onSubmit: () => void;
  loading: boolean;
  questionsLength: number;
  children: React.ReactNode;
}

export function QuestionsDialogLayout({
  open,
  onOpenChange,
  title,
  description,
  onSubmit,
  loading,
  questionsLength,
  children
}: QuestionsDialogLayoutProps) {
  const { t, currentLanguage } = useLanguage();
  
  const saveButtonText = currentLanguage === 'fr' ? 
    "Enregistrer mes réponses" : 
    "Save my answers";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] h-[90vh] max-h-[90vh] p-0 flex flex-col">
        <Header />
        
        <div className="flex-1 overflow-hidden flex flex-col p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-center">
              {title}
            </DialogTitle>
            {description && (
              <DialogDescription className="text-center">
                {description}
              </DialogDescription>
            )}
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
              {t('noQuestionFound')}
            </div>
          )}

          <DialogFooter className="mt-6">
            <Button
              onClick={onSubmit}
              className="w-full sm:w-auto"
              disabled={loading || questionsLength === 0}
            >
              {saveButtonText}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
