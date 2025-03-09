
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";
import { ScrollArea } from "@/components/ui/scroll-area";

interface LifeSupportExplanationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContinue: () => void;
}

export function LifeSupportExplanationDialog({ open, onOpenChange, onContinue }: LifeSupportExplanationDialogProps) {
  const { t, currentLanguage } = useLanguage();
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-center">
            {t('lifeSupport')}
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="mt-4 max-h-[60vh]">
          <div className="space-y-6 pr-4">
            {currentLanguage === 'fr' ? (
              <>
                <p className="text-base">
                  Ce questionnaire concerne vos souhaits concernant le maintien en vie et les interventions médicales dans des situations critiques. Il est important de bien comprendre ce que signifient ces interventions et leurs conséquences.
                </p>
                <p className="text-base">
                  Les décisions concernant le maintien en vie peuvent être difficiles mais exprimer vos préférences à l'avance peut aider vos proches et les équipes médicales à respecter vos souhaits.
                </p>
                <p className="text-base">
                  Prenez le temps de réfléchir à vos valeurs et à la qualité de vie que vous souhaitez préserver. N'hésitez pas à discuter de ces questions avec vos proches et votre médecin.
                </p>
              </>
            ) : (
              <>
                <p className="text-base">
                  This questionnaire concerns your wishes regarding life support and medical interventions in critical situations. It is important to understand what these interventions mean and their consequences.
                </p>
                <p className="text-base">
                  Decisions about life support can be difficult, but expressing your preferences in advance can help your loved ones and medical teams respect your wishes.
                </p>
                <p className="text-base">
                  Take time to reflect on your values and the quality of life you wish to maintain. Don't hesitate to discuss these questions with your loved ones and your doctor.
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
