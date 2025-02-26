
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export interface ConfirmDialogState {
  isOpen: boolean;
  type: 'add' | 'remove';
  phrase: string;
}

interface ConfirmationDialogProps {
  dialogState: ConfirmDialogState;
  onOpenChange: (isOpen: boolean) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmationDialog({
  dialogState,
  onOpenChange,
  onConfirm,
  onCancel
}: ConfirmationDialogProps) {
  const { isOpen, type, phrase } = dialogState;
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {type === 'add' ? 'Ajouter à la synthèse' : 'Supprimer de la synthèse'}
          </DialogTitle>
          <DialogDescription>
            {type === 'add' 
              ? 'Voulez-vous vraiment ajouter cette phrase à votre synthèse ?'
              : 'Voulez-vous vraiment supprimer cette phrase de votre synthèse ?'
            }
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-start gap-3">
          <Button
            variant="default"
            onClick={onConfirm}
          >
            Confirmer
          </Button>
          <Button
            variant="outline"
            onClick={onCancel}
          >
            Annuler
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
