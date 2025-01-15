import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ExternalLink } from "lucide-react";

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
          <DialogDescription className="space-y-4">
            <p>
              Cette section vous permet d'exprimer vos préférences personnelles et vos appréhensions. 
              Ces informations aideront l'équipe soignante à mieux vous accompagner et à respecter vos souhaits.
            </p>
            <a 
              href="https://www.youtube.com/watch?v=example"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline inline-flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Regarder la vidéo explicative
            </a>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={onContinue}>Continuer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}