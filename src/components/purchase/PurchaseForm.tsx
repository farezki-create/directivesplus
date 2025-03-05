
import * as React from "react";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { User } from "@supabase/supabase-js";
import { InfoIcon } from "lucide-react";

interface PurchaseFormProps {
  onClose: () => void;
  user: User | null;
}

export const PurchaseForm = ({ onClose }: PurchaseFormProps) => {
  const { toast } = useToast();

  const handleNotifyClick = () => {
    toast({
      title: "Notification enregistrée",
      description: "Nous vous informerons dès que la carte sera disponible.",
    });
    onClose();
  };

  return (
    <div className="space-y-6">
      <div className="p-4 bg-blue-50 text-blue-700 rounded-md border border-blue-200 flex items-start gap-3">
        <InfoIcon className="h-5 w-5 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-medium">Produit bientôt disponible</p>
          <p className="text-sm mt-1">
            Ce produit n'est pas encore disponible à l'achat. Vous pouvez demander à être notifié lorsqu'il sera disponible.
          </p>
        </div>
      </div>

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
    </div>
  );
};
