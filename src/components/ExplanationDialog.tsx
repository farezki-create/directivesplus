
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/language/useLanguage";
import { useEffect } from "react";

interface ExplanationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContinue: () => void;
  title: string;
  description: string;
  content: string;
}

export function ExplanationDialog({ 
  open, 
  onOpenChange, 
  onContinue,
  title,
  description,
  content
}: ExplanationDialogProps) {
  const { t, currentLanguage } = useLanguage();
  
  useEffect(() => {
    if (open) {
      console.log("[ExplanationDialog] Dialog opened with language:", currentLanguage);
    }
  }, [open, currentLanguage]);
  
  const handleContinueClick = () => {
    console.log("[ExplanationDialog] Continue button clicked");
    onOpenChange(false);
    
    // Wait for the dialog to close before continuing to the next step
    setTimeout(() => {
      console.log("[ExplanationDialog] Calling onContinue function after delay");
      onContinue();
    }, 500);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-center">
            {title}
          </DialogTitle>
          <DialogDescription className="text-center pt-2">
            {description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-6">
          <div className="prose prose-sm max-w-none">
            <p className="text-lg mb-4">{content}</p>
          </div>
        </div>

        <DialogFooter>
          <Button 
            onClick={handleContinueClick} 
            className="w-full sm:w-auto"
            type="button"
          >
            {t('continueToQuestionnaire')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
