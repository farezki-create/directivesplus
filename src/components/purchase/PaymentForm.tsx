
import * as React from "react";
import { CreditCard, AlertCircle, CheckCircle } from "lucide-react";

interface PaymentFormProps {
  cardElementRef: React.RefObject<HTMLDivElement>;
  error?: string;
  isProcessing?: boolean;
  isComplete?: boolean;
}

export const PaymentForm = ({ 
  cardElementRef, 
  error, 
  isProcessing = false,
  isComplete = false 
}: PaymentFormProps) => {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold flex items-center gap-2">
        <CreditCard className="w-4 h-4" />
        Paiement
      </h3>

      <div className={`p-3 border rounded-md transition-colors ${isComplete ? 'border-green-500 bg-green-50' : error ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}>
        <div ref={cardElementRef} id="card-element" className={isProcessing ? 'opacity-50' : ''} />
        
        {isComplete && (
          <div className="mt-2 text-sm text-green-600 flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4" />
            Informations de paiement validées
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-sm text-red-500 flex items-center gap-1.5">
          <AlertCircle className="w-4 h-4" />
          {error}
        </p>
      )}
    </div>
  );
};
