
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ProductDetails } from "./ProductDetails";
import { PurchaseForm } from "./PurchaseForm";
import { User } from "@supabase/supabase-js";

interface PurchaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
}

export const PurchaseDialog = ({ open, onOpenChange, user }: PurchaseDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Carte mémoire USB format carte de crédit</DialogTitle>
          <DialogDescription>
            Stockez vos directives anticipées sur une carte mémoire USB au format carte de crédit (non encore disponible).
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
