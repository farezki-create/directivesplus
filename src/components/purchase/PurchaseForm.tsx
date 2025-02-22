
import * as React from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CreditCard, Package } from "lucide-react";
import { DialogFooter } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import { User } from "@supabase/supabase-js";

const stripePromise = loadStripe('pk_test_51OvZy8KJHojJ27FpoHYRFw3pYJB93qZFLbOieT47naK9trTRqUUfWVM4kugAGoN7V6lDaUxydQ6k9Kk4FvFa2gvX00RzW8wPxX');

const orderFormSchema = z.object({
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  address: z.string().min(5, "L'adresse doit contenir au moins 5 caractères"),
  city: z.string().min(2, "La ville doit contenir au moins 2 caractères"),
  postalCode: z.string().regex(/^[0-9]{5}$/, "Code postal invalide"),
  cardToken: z.string(),
});

type OrderFormValues = z.infer<typeof orderFormSchema>;

interface PurchaseFormProps {
  onClose: () => void;
  user: User | null;
}

export const PurchaseForm = ({ onClose, user }: PurchaseFormProps) => {
  const { toast } = useToast();
  const [isOrdering, setIsOrdering] = React.useState(false);
  const [stripe, setStripe] = React.useState<Stripe | null>(null);

  React.useEffect(() => {
    const initStripe = async () => {
      const stripeInstance = await stripePromise;
      setStripe(stripeInstance);
    };
    initStripe();
  }, []);

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      address: "",
      city: "",
      postalCode: "",
      cardToken: "",
    },
  });

  const onSubmit = async (values: OrderFormValues) => {
    setIsOrdering(true);
    try {
      if (!stripe) throw new Error("Stripe n'est pas initialisé");

      const response = await fetch(
        'https://kytqqjnecezkxyhmmjrz.supabase.co/functions/v1/create-payment',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: 19.90,
            email: values.email,
          }),
        }
      );

      const { clientSecret } = await response.json();
      if (!clientSecret) throw new Error("Erreur lors de la création du paiement");

      // Créer un PaymentMethod avec Stripe
      const { paymentMethod, error: paymentMethodError } = await stripe.createPaymentMethod({
        type: 'card',
        card: { token: values.cardToken },
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
        throw new Error(paymentMethodError.message);
      }

      const { error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethod.id,
      });

      if (confirmError) {
        throw new Error(confirmError.message);
      }

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

      if (dbError) throw dbError;

      toast({
        title: "Commande confirmée",
        description: "Votre commande a été enregistrée avec succès. Vous recevrez un email de confirmation.",
      });
      
      onClose();
      form.reset();
    } catch (error) {
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
        <div className="space-y-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Package className="w-4 h-4" />
            Adresse de livraison
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prénom</FormLabel>
                  <FormControl>
                    <Input placeholder="Jean" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <Input placeholder="Dupont" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="jean.dupont@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Adresse</FormLabel>
                <FormControl>
                  <Input placeholder="123 rue des Lilas" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ville</FormLabel>
                  <FormControl>
                    <Input placeholder="Paris" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="postalCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code postal</FormLabel>
                  <FormControl>
                    <Input placeholder="75001" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            Paiement
          </h3>

          <FormField
            control={form.control}
            name="cardToken"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Carte bancaire</FormLabel>
                <FormControl>
                  <div id="card-element" className="p-3 border rounded-md" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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
