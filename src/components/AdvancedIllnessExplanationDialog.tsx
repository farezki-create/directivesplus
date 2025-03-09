
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AdvancedIllnessExplanationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContinue: () => void;
}

export function AdvancedIllnessExplanationDialog({ 
  open, 
  onOpenChange, 
  onContinue 
}: AdvancedIllnessExplanationDialogProps) {
  const { t, currentLanguage } = useLanguage();
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-center">
            {t('advancedIllnessTitle')}
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="mt-4 max-h-[60vh]">
          <div className="space-y-6 pr-4">
            {currentLanguage === 'fr' ? (
              <>
                <p className="text-base">
                  Ce questionnaire concerne vos préférences de soins en cas de maladie avancée ou incurable. Il est conçu pour vous aider à exprimer vos souhaits concernant les traitements et la qualité de vie que vous désirez préserver.
                </p>
                <p className="text-base">
                  Une maladie avancée est un état où la guérison n'est plus possible et où les soins se concentrent sur le confort et la qualité de vie plutôt que sur la guérison.
                </p>
                <p className="text-base">
                  Vos réponses guideront les professionnels de santé pour adapter leurs soins à vos valeurs et préférences personnelles. Prenez le temps de réfléchir à ces questions importantes.
                </p>
              </>
            ) : (
              <>
                <p className="text-base">
                  This questionnaire concerns your care preferences in case of advanced or incurable illness. It is designed to help you express your wishes regarding treatments and the quality of life you wish to maintain.
                </p>
                <p className="text-base">
                  An advanced illness is a condition where cure is no longer possible and care focuses on comfort and quality of life rather than recovery.
                </p>
                <p className="text-base">
                  Your answers will guide healthcare professionals to adapt their care to your personal values and preferences. Take time to reflect on these important questions.
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
