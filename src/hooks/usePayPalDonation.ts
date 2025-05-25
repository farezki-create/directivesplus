
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const usePayPalDonation = () => {
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

  const handlePayPalDonation = async (isRecurring: boolean) => {
    try {
      setIsProcessing(true);
      
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
        setIsProcessing(false);
        return;
      }
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Authentification requise",
          description: "Veuillez vous connecter pour effectuer un don.",
          variant: "destructive"
        });
        setIsProcessing(false);
        return;
      }

      const { data, error } = await supabase.functions.invoke('create-paypal-payment', {
        body: { 
          amount,
          currency: 'EUR',
          isRecurring 
        }
      });

      if (error) {
        console.error('Error creating PayPal payment:', error);
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de la création du paiement PayPal.",
          variant: "destructive"
        });
        setIsProcessing(false);
        return;
      }

      if (data?.url) {
        window.open(data.url, '_blank');
        
        toast({
          title: "Redirection vers PayPal",
          description: "Vous allez être redirigé vers PayPal pour finaliser votre don.",
        });
        
        setTimeout(() => {
          setSelectedAmount(null);
          setCustomAmount("");
          setIsProcessing(false);
        }, 2000);
      } else {
        throw new Error('No PayPal URL received');
      }

    } catch (error) {
      console.error("Error processing PayPal donation:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du traitement de votre don PayPal.",
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
    handlePayPalDonation
  };
};
