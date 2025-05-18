
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface AmountSelectorProps {
  selectedAmount: string | null;
  customAmount: string;
  onAmountClick: (amount: string) => void;
  onCustomAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isRecurring?: boolean;
}

const AmountSelector = ({
  selectedAmount,
  customAmount,
  onAmountClick,
  onCustomAmountChange,
  isRecurring = false
}: AmountSelectorProps) => {
  const amounts = isRecurring ? ["5", "10", "15", "25"] : ["10", "20", "50", "100"];
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium mb-3">
          Choisissez un montant {isRecurring ? "mensuel" : ""}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {amounts.map((amount) => (
            <Button
              key={amount}
              variant={selectedAmount === amount ? "default" : "outline"}
              className={selectedAmount === amount 
                ? "bg-directiveplus-600 hover:bg-directiveplus-700" 
                : "border-directiveplus-200 hover:border-directiveplus-300"
              }
              onClick={() => onAmountClick(amount)}
            >
              {amount} €{isRecurring ? "/mois" : ""}
            </Button>
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="font-medium mb-3">
          Ou entrez un autre montant {isRecurring ? "mensuel" : ""}
        </h3>
        <div className="flex items-center max-w-xs">
          <input
            type="number"
            min="1"
            step="1"
            value={customAmount}
            onChange={onCustomAmountChange}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            placeholder="Montant"
          />
          <span className="ml-2 text-lg font-medium">
            €{isRecurring ? "/mois" : ""}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AmountSelector;
