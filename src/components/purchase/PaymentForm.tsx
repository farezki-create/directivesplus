
import * as React from "react";
import { CreditCard } from "lucide-react";
import { StripeElement, Stripe, StripeElements } from "@stripe/stripe-js";

interface PaymentFormProps {
  cardElementRef: React.RefObject<HTMLDivElement>;
}

export const PaymentForm = ({ cardElementRef }: PaymentFormProps) => {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold flex items-center gap-2">
        <CreditCard className="w-4 h-4" />
        Paiement
      </h3>

      <div className="p-3 border rounded-md">
        <div ref={cardElementRef} id="card-element" />
      </div>
    </div>
  );
};
