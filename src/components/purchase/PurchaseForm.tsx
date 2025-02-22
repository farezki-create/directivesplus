
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
  const cardElementRef = React.useRef<HTMLDivElement>(null);
  const { stripe, card } = useStripePayment(cardElementRef);

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
    try {
      console.log('Creating payment intent...');
      const { data: intentData, error: intentError } = await supabase.functions.invoke('create-payment', {
        body: {
          amount: 19.90,
          email: values.email,
        },
      });

      console.log('Payment intent response:', { intentData, intentError });

      if (intentError || !intentData?.clientSecret) {
        throw new Error(intentError?.message || "Erreur lors de la création du paiement");
      }

      console.log('Creating payment method...');
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
        console.error('Payment method error:', paymentMethodError);
        throw new Error(paymentMethodError.message);
      }

      console.log('Confirming card payment...');
      const { error: confirmError } = await stripe.confirmCardPayment(intentData.clientSecret, {
        payment_method: paymentMethod.id,
      });

      if (confirmError) {
        console.error('Confirm payment error:', confirmError);
        throw new Error(confirmError.message);
      }

      console.log('Saving order to database...');
      const { error: dbError } = await supabase.from('orders').insert({
        user_id: user?.id,
        amount: 19.90,
        status: 'completed',
        first_name: values.firstName,
        last_name: values.lastName,
        email: values.email,
        address: values.address,
        city: values.city,
        postal_code: values.postalCode,
      });

      if (dbError) {
        console.error('Database error:', dbError);
        throw dbError;
      }

      console.log('Order completed successfully');
      toast({
        title: "Commande confirmée",
        description: "Votre commande a été enregistrée avec succès. Vous recevrez un email de confirmation.",
      });
      
      onClose();
      form.reset();
    } catch (error: any) {
      console.error('Payment error:', error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors du traitement de votre commande.",
        variant: "destructive",
      });
    } finally {
      setIsOrdering(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <ShippingForm form={form} />
        <PaymentForm cardElementRef={cardElementRef} />

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" disabled={isOrdering}>
            {isOrdering ? "Traitement en cours..." : "Commander - 19,90 €"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
