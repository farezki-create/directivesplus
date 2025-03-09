
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PreferencesExplanationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContinue: () => void;
}

export function PreferencesExplanationDialog({
  open,
  onOpenChange,
  onContinue,
}: PreferencesExplanationDialogProps) {
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
                  Ce questionnaire vous permet d'exprimer vos préférences personnelles concernant votre qualité de vie et vos soins. Ces préférences sont importantes pour guider vos proches et les professionnels de santé.
                </p>
                <p className="text-base">
                  Nous vous demandons d'indiquer ce qui est important pour vous dans différentes situations, ce qui peut vous faire peur ou ce que vous souhaitez éviter.
                </p>
                <p className="text-base">
                  Ces informations complètent vos autres directives et aident à créer un plan de soins qui respecte vos valeurs et votre personnalité.
                </p>
              </>
            ) : (
              <>
                <p className="text-base">
                  This questionnaire allows you to express your personal preferences regarding your quality of life and care. These preferences are important to guide your loved ones and healthcare professionals.
                </p>
                <p className="text-base">
                  We ask you to indicate what is important to you in different situations, what you might fear, or what you wish to avoid.
                </p>
                <p className="text-base">
                  This information complements your other directives and helps create a care plan that respects your values and personality.
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
