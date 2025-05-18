
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { createDonationSession } from "@/utils/stripeService";

export const useDonation = () => {
  const [selectedAmount, setSelectedAmount] = useState<string | null>(null);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleAmountClick = (amount: string) => {
    setSelectedAmount(amount);
    setCustomAmount("");
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAmount(e.target.value);
    setSelectedAmount(null);
  };

  const handleDonation = async (isRecurring: boolean) => {
    try {
      setIsProcessing(true);
      
      // Get the amount in cents (Stripe requires amounts in cents)
      const amount = selectedAmount 
        ? parseInt(selectedAmount) * 100 
        : customAmount 
          ? parseFloat(customAmount) * 100 
          : 0;
      
      if (!amount || amount <= 0) {
        toast({
          title: "Montant invalide",
          description: "Veuillez sélectionner ou saisir un montant valide.",
          variant: "destructive"
        });
        return;
      }
      
      // For demo purposes, show a success message instead of actually processing payment
      toast({
        title: "Démo de don",
        description: `Cette démo simule un don ${isRecurring ? 'mensuel' : 'ponctuel'} de ${amount/100}€. En production, vous seriez redirigé vers la page de paiement Stripe.`,
      });
      
      // Simulate processing delay
      setTimeout(() => {
        setIsProcessing(false);
        setSelectedAmount(null);
        setCustomAmount("");
      }, 1500);
      
      // In a real implementation with Stripe backend:
      // const result = await createDonationSession({ 
      //   amount, 
      //   isRecurring 
      // });
      // 
      // if (!result.success) {
      //   toast({
      //     title: "Erreur",
      //     description: result.error || "Une erreur est survenue lors du traitement de votre don.",
      //     variant: "destructive"
      //   });
      // }
    } catch (error) {
      console.error("Error processing donation:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du traitement de votre don.",
        variant: "destructive"
      });
      setIsProcessing(false);
    }
  };

  return {
    selectedAmount,
    customAmount,
    isProcessing,
    handleAmountClick,
    handleCustomAmountChange,
    handleDonation
  };
};
