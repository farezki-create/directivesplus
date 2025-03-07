
import * as React from "react";
import { CreditCard } from "lucide-react";

interface PaymentFormProps {
  cardElementRef: React.RefObject<HTMLDivElement>;
  error?: string;
}

export const PaymentForm = ({ cardElementRef, error }: PaymentFormProps) => {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold flex items-center gap-2">
        <CreditCard className="w-4 h-4" />
        Paiement
      </h3>

      <div className="p-3 border rounded-md">
        <div ref={cardElementRef} id="card-element" />
      </div>
      
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};
