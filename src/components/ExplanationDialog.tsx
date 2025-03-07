
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/language/useLanguage";
import { useEffect } from "react";

interface ExplanationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContinue: () => void;
}

export function ExplanationDialog({ open, onOpenChange, onContinue }: ExplanationDialogProps) {
  const { t, currentLanguage } = useLanguage();
  
  useEffect(() => {
    if (open) {
      console.log("[ExplanationDialog] Dialog opened with language:", currentLanguage);
    }
  }, [open, currentLanguage]);
  
  const handleContinueClick = () => {
    console.log("[ExplanationDialog] Continue button clicked");
    onContinue();
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-center">
            {t('generalOpinion')}
          </DialogTitle>
          <DialogDescription className="text-center pt-2">
            {t('generalOpinionDesc')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-6">
          <p className="text-lg mb-4">
            {currentLanguage === 'fr' ? (
              "Cette section vous permet d'exprimer vos souhaits généraux concernant vos soins médicaux. Pour chaque question, vous pouvez répondre par OUI ou NON."
            ) : (
              "This section allows you to express your general wishes regarding your medical care. For each question, you can answer YES or NO."
            )}
          </p>
          
          <p className="mb-4">
            {currentLanguage === 'fr' ? (
              "Vos réponses aideront les médecins et vos proches à comprendre vos souhaits et à prendre des décisions conformes à vos valeurs si vous ne pouvez plus vous exprimer."
            ) : (
              "Your answers will help doctors and your loved ones understand your wishes and make decisions in accordance with your values if you can no longer express yourself."
            )}
          </p>
        </div>

        <DialogFooter>
          <Button onClick={handleContinueClick} className="w-full sm:w-auto">
            {t('continueToQuestionnaire')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
