
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/language/useLanguage";

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
  const { isOpen, type } = dialogState;
  const { t } = useLanguage();
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {type === 'add' ? t('confirmAdd') : t('confirmRemove')}
          </DialogTitle>
          <DialogDescription>
            {type === 'add' ? t('confirmAddDesc') : t('confirmRemoveDesc')}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-start gap-3">
          <Button
            variant="default"
            onClick={onConfirm}
          >
            {t('confirm')}
          </Button>
          <Button
            variant="outline"
            onClick={onCancel}
          >
            {t('cancel')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
