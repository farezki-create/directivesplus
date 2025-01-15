import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-center">
            Maladie avancée
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-6">
          <p className="text-lg text-center mb-6">
            Cette section concerne vos souhaits concernant les traitements en cas de maladie avancée.
          </p>
          
          <div className="aspect-video bg-muted rounded-lg mb-6">
            <p className="flex items-center justify-center h-full text-muted-foreground">
              Vidéo explicative à venir
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onContinue} className="w-full sm:w-auto">
            Continuer vers le questionnaire
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}