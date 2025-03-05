
import * as React from "react";
import { User } from "@supabase/supabase-js";
import { NotificationMessage } from "./NotificationMessage";
import { PurchaseFormActions } from "./PurchaseFormActions";

interface PurchaseFormProps {
  onClose: () => void;
  user: User | null;
}

export const PurchaseForm = ({ onClose, user }: PurchaseFormProps) => {
  return (
    <div className="space-y-6">
      <NotificationMessage />
      <PurchaseFormActions onClose={onClose} />
    </div>
  );
};
