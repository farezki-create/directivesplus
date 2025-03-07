
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";

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
  const { t } = useLanguage();
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-center">
            {t('beforeStarting')}
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-6">
          <p className="text-lg text-center mb-6">
            {t('freeTextInstructions')}
          </p>
          
          <div className="aspect-video bg-muted rounded-lg mb-6">
            <p className="flex items-center justify-center h-full text-muted-foreground">
              {t('explanatoryVideo')}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onContinue} className="w-full sm:w-auto">
            {t('continueToQuestionnaire')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
