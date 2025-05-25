
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
        setIsProcessing(false);
        return;
      }
      
      // Check if user is authenticated
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

      // Call the appropriate Stripe function
      const functionName = isRecurring ? 'create-checkout' : 'create-payment';
      
      const { data, error } = await supabase.functions.invoke(functionName, {
        body: { 
          amount,
          currency: 'eur',
          isRecurring 
        }
      });

      if (error) {
        console.error('Error creating payment session:', error);
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de la création de la session de paiement.",
          variant: "destructive"
        });
        setIsProcessing(false);
        return;
      }

      if (data?.url) {
        // Redirect to Stripe Checkout
        window.open(data.url, '_blank');
        
        toast({
          title: "Redirection vers le paiement",
          description: "Vous allez être redirigé vers la page de paiement sécurisée.",
        });
        
        // Reset form after successful redirect
        setTimeout(() => {
          setSelectedAmount(null);
          setCustomAmount("");
          setIsProcessing(false);
        }, 2000);
      } else {
        throw new Error('No checkout URL received');
      }

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
