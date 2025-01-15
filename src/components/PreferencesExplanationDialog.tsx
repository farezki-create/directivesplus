import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Mes goûts et mes peurs</DialogTitle>
          <DialogDescription>
            Cette section vous permet d'exprimer vos préférences personnelles et vos appréhensions. 
            Ces informations aideront l'équipe soignante à mieux vous accompagner et à respecter vos souhaits.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={onContinue}>Continuer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}