
import { Button } from "./ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { DocumentScanner } from "@/components/DocumentScanner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { CreditCard, Package } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe('pk_test_51OvZy8KJHojJ27FpoHYRFw3pYJB93qZFLbOieT47naK9trTRqUUfWVM4kugAGoN7V6lDaUxydQ6k9Kk4FvFa2gvX00RzW8wPxX');

const orderFormSchema = z.object({
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  address: z.string().min(5, "L'adresse doit contenir au moins 5 caractères"),
  city: z.string().min(2, "La ville doit contenir au moins 2 caractères"),
  postalCode: z.string().regex(/^[0-9]{5}$/, "Code postal invalide"),
  cardNumber: z.string().regex(/^[0-9]{16}$/, "Numéro de carte invalide"),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, "Date d'expiration invalide (MM/YY)"),
  cvv: z.string().regex(/^[0-9]{3}$/, "CVV invalide"),
});

type OrderFormValues = z.infer<typeof orderFormSchema>;

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [isOrdering, setIsOrdering] = useState(false);
  const { toast } = useToast();

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      address: "",
      city: "",
      postalCode: "",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
    },
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleHomeClick = () => {
    window.location.href = "/";
  };

  const onSubmitOrder = async (values: OrderFormValues) => {
    setIsOrdering(true);
    try {
      const stripe = await stripePromise;
      if (!stripe) throw new Error("Stripe n'est pas initialisé");

      // Créer l'intention de paiement
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

      // Confirmer le paiement avec Stripe
      const { error: stripeError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: {
            number: values.cardNumber,
            exp_month: parseInt(values.expiryDate.split('/')[0]),
            exp_year: parseInt(values.expiryDate.split('/')[1]),
            cvc: values.cvv,
          },
          billing_details: {
            name: `${values.firstName} ${values.lastName}`,
            email: values.email,
            address: {
              line1: values.address,
              city: values.city,
              postal_code: values.postalCode,
            },
          },
        },
      });

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      // Enregistrer la commande dans Supabase
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
      
      setShowPurchaseDialog(false);
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

  const isHomePage = location.pathname === "/";
  const [showPurchaseDialog, setShowPurchaseDialog] = useState(false);

  return (
    <>
      <header className="w-full border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-primary">DirectivesPlus</h1>
          </div>
          <nav className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={handleHomeClick}
            >
              Accueil
            </Button>

            <Button
              variant="outline"
              onClick={() => setShowPurchaseDialog(true)}
              className="flex items-center gap-2"
            >
              <CreditCard className="w-4 h-4" />
              Achat carte
            </Button>

            <Button
              variant="ghost"
              onClick={() => navigate("/dashboard")}
            >
              En savoir plus
            </Button>
            
            {user && !isHomePage && (
              <Button
                variant="ghost"
                onClick={() => navigate("/dashboard")}
              >
                Désignation de la personne de confiance
              </Button>
            )}
            
            {user ? (
              <Button variant="default" onClick={handleSignOut}>
                Déconnexion
              </Button>
            ) : (
              <Button variant="default" onClick={() => navigate("/auth")}>
                Connexion
              </Button>
            )}
          </nav>
        </div>
      </header>

      <Dialog open={showPurchaseDialog} onOpenChange={setShowPurchaseDialog}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Carte mémoire USB format carte de crédit</DialogTitle>
            <DialogDescription>
              Stockez vos directives anticipées sur une carte mémoire USB au format carte de crédit.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="h-[400px] bg-white relative rounded-lg overflow-hidden">
                <img 
                  src="/lovable-uploads/6bb21b02-63a3-4da2-8feb-a4ec9237c2bf.png"
                  alt="Carte mémoire USB Directives Anticipées"
                  className="object-contain w-full h-full"
                />
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">Caractéristiques</h4>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                    <li>Format carte de crédit - Se range facilement dans votre portefeuille</li>
                    <li>Connecteur USB intégré</li>
                    <li>Capacité de stockage de 2 Go</li>
                    <li>Stockage sécurisé de vos directives anticipées</li>
                    <li>Compatibilité universelle</li>
                  </ul>
                </div>

                <div>
                  <p className="text-2xl font-bold">
                    Prix : 19,90 €
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Frais de port inclus
                  </p>
                </div>
              </div>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmitOrder)} className="space-y-6">
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
                    name="cardNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Numéro de carte</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="1234 5678 9012 3456" 
                            {...field}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, '').slice(0, 16);
                              field.onChange(value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="expiryDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date d'expiration</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="MM/YY" 
                              {...field}
                              onChange={(e) => {
                                let value = e.target.value.replace(/\D/g, '');
                                if (value.length >= 2) {
                                  value = value.slice(0, 2) + '/' + value.slice(2, 4);
                                }
                                field.onChange(value);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="cvv"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CVV</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="123" 
                              {...field}
                              onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '').slice(0, 3);
                                field.onChange(value);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setShowPurchaseDialog(false)}>
                    Annuler
                  </Button>
                  <Button type="submit" disabled={isOrdering}>
                    {isOrdering ? "Traitement en cours..." : "Commander - 19,90 €"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
