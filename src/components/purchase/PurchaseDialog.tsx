
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ProductDetails } from "./ProductDetails";
import { PurchaseForm } from "./PurchaseForm";
import { User } from "@supabase/supabase-js";
import { useLanguage } from "@/hooks/language/useLanguage";

interface PurchaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
}

export const PurchaseDialog = ({ open, onOpenChange, user }: PurchaseDialogProps) => {
  const { t } = useLanguage();
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('usbMemoryCard')}</DialogTitle>
          <DialogDescription>
            {t('usbMemoryCardDescription')}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <ProductDetails />
          <PurchaseForm onClose={() => onOpenChange(false)} user={user} />
        </div>
      </DialogContent>
    </Dialog>
  );
};
