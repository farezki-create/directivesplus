
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ExplanationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContinue: () => void;
}

export function ExplanationDialog({ open, onOpenChange, onContinue }: ExplanationDialogProps) {
  const { t, currentLanguage } = useLanguage();
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-center">
            {t('beforeStarting')}
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="mt-4 max-h-[60vh]">
          <div className="space-y-6 pr-4">
            {currentLanguage === 'fr' ? (
              <>
                <p className="text-base">
                  Ce questionnaire vous permet d'exprimer vos opinions générales concernant vos soins de santé et vos préférences de fin de vie. Vos réponses aideront vos proches et les professionnels de santé à comprendre vos valeurs et souhaits.
                </p>
                <p className="text-base">
                  Prenez le temps de réfléchir à chaque question. Il n'y a pas de bonnes ou mauvaises réponses - il s'agit de vos préférences personnelles.
                </p>
                <p className="text-base">
                  Vous pourrez toujours modifier vos réponses ultérieurement si vos opinions changent.
                </p>
              </>
            ) : (
              <>
                <p className="text-base">
                  This questionnaire allows you to express your general opinions regarding your healthcare and end-of-life preferences. Your answers will help your loved ones and healthcare professionals understand your values and wishes.
                </p>
                <p className="text-base">
                  Take time to reflect on each question. There are no right or wrong answers - these are your personal preferences.
                </p>
                <p className="text-base">
                  You can always change your answers later if your opinions change.
                </p>
              </>
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="mt-6">
          <Button onClick={onContinue} className="w-full sm:w-auto">
            {t('continueToQuestionnaire')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
