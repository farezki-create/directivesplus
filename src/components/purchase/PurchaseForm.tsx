
import * as React from "react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { User } from "@supabase/supabase-js";
import { OrderFormValues, orderFormSchema } from "./types";
import { ShippingForm } from "./ShippingForm";
import { PaymentForm } from "./PaymentForm";
import { useStripePayment } from "./useStripePayment";

interface PurchaseFormProps {
  onClose: () => void;
  user: User | null;
}

export const PurchaseForm = ({ onClose, user }: PurchaseFormProps) => {
  const { toast } = useToast();
  const [isOrdering, setIsOrdering] = React.useState(false);
  const [paymentStatus, setPaymentStatus] = React.useState<string>("");
  const cardElementRef = React.useRef<HTMLDivElement>(null);
  const { stripe, card, error: stripeError } = useStripePayment(cardElementRef);

  React.useEffect(() => {
    if (stripeError) {
      toast({
        title: "Erreur de paiement",
        description: "Le système de paiement n'a pas pu être initialisé.",
        variant: "destructive",
      });
    }
  }, [stripeError, toast]);

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: user?.email || "",
      address: "",
      city: "",
      postalCode: "",
    },
  });

  const onSubmit = async (values: OrderFormValues) => {
    if (!stripe || !card) {
      toast({
        title: "Erreur",
        description: "Le système de paiement n'est pas prêt",
        variant: "destructive",
      });
      return;
    }

    setIsOrdering(true);
    setPaymentStatus("Initialisation du paiement...");

    try {
      setPaymentStatus("Création de l'intention de paiement...");
      const { data: intentData, error: intentError } = await supabase.functions.invoke('create-payment', {
        body: {
          amount: 19.90,
          email: values.email,
        },
      });

      if (intentError || !intentData?.clientSecret) {
        throw new Error(intentError?.message || "Erreur lors de la création du paiement");
      }

      setPaymentStatus("Configuration du moyen de paiement...");
      const { paymentMethod, error: paymentMethodError } = await stripe.createPaymentMethod({
        type: 'card',
        card: card as any,
        billing_details: {
          name: `${values.firstName} ${values.lastName}`,
          email: values.email,
          address: {
            line1: values.address,
            city: values.city,
            postal_code: values.postalCode,
            country: 'FR',
          },
        },
      });

      if (paymentMethodError) {
        throw new Error(paymentMethodError.message || "Erreur lors de la création du moyen de paiement");
      }

      setPaymentStatus("Confirmation du paiement...");
      const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(
        intentData.clientSecret,
        {
          payment_method: paymentMethod.id,
        }
      );

      if (confirmError) {
        throw new Error(confirmError.message);
      }

      if (paymentIntent.status !== 'succeeded') {
        throw new Error("Le paiement n'a pas été confirmé");
      }

      setPaymentStatus("Enregistrement de la commande...");
      const { error: dbError } = await supabase.from('orders').insert({
        user_id: user?.id,
        amount: 19.90,
        status: 'completed',
        payment_intent_id: paymentIntent.id,
        first_name: values.firstName,
        last_name: values.lastName,
        email: values.email,
        address: values.address,
        city: values.city,
        postal_code: values.postalCode,
      });

      if (dbError) {
        throw dbError;
      }

      toast({
        title: "Paiement réussi",
        description: "Votre commande a été enregistrée avec succès. Vous recevrez un email de confirmation.",
      });
      
      onClose();
      form.reset();
    } catch (error: any) {
      console.error('Payment error:', error);
      toast({
        title: "Erreur de paiement",
        description: error.message || "Une erreur est survenue lors du traitement de votre commande.",
        variant: "destructive",
      });
    } finally {
      setIsOrdering(false);
      setPaymentStatus("");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <ShippingForm form={form} />
        <PaymentForm cardElementRef={cardElementRef} error={stripeError} />

        {paymentStatus && (
          <div className="text-sm text-gray-600 animate-pulse">
            {paymentStatus}
          </div>
        )}

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" disabled={isOrdering}>
            {isOrdering ? "Paiement en cours..." : "Commander - 19,90 €"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
