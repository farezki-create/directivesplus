
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import AmountSelector from "./AmountSelector";
import { usePayPalDonation } from "@/hooks/usePayPalDonation";

interface PayPalDonationCardProps {
  isRecurring: boolean;
}

const PayPalDonationCard = ({ isRecurring }: PayPalDonationCardProps) => {
  const {
    selectedAmount,
    customAmount,
    isProcessing,
    handleAmountClick,
    handleCustomAmountChange,
    handlePayPalDonation
  } = usePayPalDonation();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl text-directiveplus-700 flex items-center gap-2">
          <span className="text-blue-600 font-bold">PayPal</span>
          {isRecurring ? "Devenir donateur mensuel" : "Faire un don ponctuel"}
        </CardTitle>
        <CardDescription>
          {isRecurring 
            ? "Votre soutien régulier via PayPal nous permet de planifier nos projets sur le long terme."
            : "Votre soutien via PayPal nous aide à maintenir notre plateforme. Accepte les cartes bancaires."
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AmountSelector
          selectedAmount={selectedAmount}
          customAmount={customAmount}
          onAmountClick={handleAmountClick}
          onCustomAmountChange={handleCustomAmountChange}
          isRecurring={isRecurring}
        />
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
          onClick={() => handlePayPalDonation(isRecurring)}
          disabled={isProcessing}
        >
          <span className="font-bold">PayPal</span>
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

export default PayPalDonationCard;
