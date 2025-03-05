
import * as React from "react";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface PurchaseFormActionsProps {
  onClose: () => void;
}

export const PurchaseFormActions = ({ onClose }: PurchaseFormActionsProps) => {
  const { toast } = useToast();

  const handleNotifyClick = () => {
    toast({
      title: "Notification enregistrée",
      description: "Nous vous informerons dès que la carte sera disponible.",
    });
    onClose();
  };

  return (
    <DialogFooter>
      <Button 
        type="button" 
        variant="outline" 
        onClick={onClose}
      >
        Fermer
      </Button>
      <Button 
        type="button"
        onClick={handleNotifyClick}
      >
        Me notifier quand disponible
      </Button>
    </DialogFooter>
  );
};
