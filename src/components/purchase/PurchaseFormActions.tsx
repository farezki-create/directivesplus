
import * as React from "react";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/language/useLanguage";

interface PurchaseFormActionsProps {
  onClose: () => void;
}

export const PurchaseFormActions = ({ onClose }: PurchaseFormActionsProps) => {
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleNotifyClick = () => {
    toast({
      title: t('notificationRegistered'),
      description: t('notifyWhenAvailable'),
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
        {t('close')}
      </Button>
      <Button 
        type="button"
        onClick={handleNotifyClick}
      >
        {t('notifyMe')}
      </Button>
    </DialogFooter>
  );
};
