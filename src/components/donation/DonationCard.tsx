
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign } from "lucide-react";
import AmountSelector from "./AmountSelector";

interface DonationCardProps {
  isRecurring: boolean;
  selectedAmount: string | null;
  customAmount: string;
  isProcessing: boolean;
  onAmountClick: (amount: string) => void;
  onCustomAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDonation: () => void;
}

const DonationCard = ({
  isRecurring,
  selectedAmount,
  customAmount,
  isProcessing,
  onAmountClick,
  onCustomAmountChange,
  onDonation
}: DonationCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl text-directiveplus-700">
          {isRecurring ? "Devenir donateur mensuel" : "Faire un don ponctuel"}
        </CardTitle>
        <CardDescription>
          {isRecurring 
            ? "Votre soutien régulier nous permet de planifier nos projets sur le long terme."
            : "Votre soutien nous aide à maintenir notre plateforme et à développer de nouvelles fonctionnalités."
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AmountSelector
          selectedAmount={selectedAmount}
          customAmount={customAmount}
          onAmountClick={onAmountClick}
          onCustomAmountChange={onCustomAmountChange}
          isRecurring={isRecurring}
        />
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full bg-directiveplus-600 hover:bg-directiveplus-700 flex items-center gap-2"
          onClick={onDonation}
          disabled={isProcessing}
        >
          <DollarSign className="h-5 w-5" />
          {isProcessing 
            ? "Traitement en cours..." 
            : isRecurring 
              ? "Devenir donateur mensuel" 
              : "Faire un don maintenant"
          }
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DonationCard;
