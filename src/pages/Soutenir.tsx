
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, DollarSign, Users } from "lucide-react";
import { createDonationSession } from "@/utils/stripeService";

const Soutenir = () => {
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
      // In a real implementation, you'd use the createDonationSession function
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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-directiveplus-50 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-directiveplus-700 mb-6">
                Soutenez DirectivesPlus
              </h1>
              <p className="text-lg md:text-xl text-gray-700 mb-8">
                Votre soutien nous permet de continuer notre mission : rendre accessible à tous la gestion des directives anticipées.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <a href="#faire-un-don">
                  <Button 
                    size="lg"
                    className="bg-directiveplus-600 hover:bg-directiveplus-700 text-lg flex items-center gap-2"
                  >
                    <Heart className="h-5 w-5" />
                    Je fais un don
                  </Button>
                </a>
                <a href="#devenir-membre">
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="border-directiveplus-200 text-directiveplus-700 hover:bg-directiveplus-50 text-lg flex items-center gap-2"
                  >
                    <Users className="h-5 w-5" />
                    Devenir membre
                  </Button>
                </a>
              </div>
              <p className="mt-4 text-sm text-gray-600">
                Vos dons sont déductibles des impôts à hauteur de 66%
              </p>
            </div>
          </div>
        </section>
        
        {/* Donation Section */}
        <section id="faire-un-don" className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Tabs defaultValue="ponctuel" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8">
                  <TabsTrigger value="ponctuel">Don ponctuel</TabsTrigger>
                  <TabsTrigger value="mensuel">Don mensuel</TabsTrigger>
                </TabsList>
                
                <TabsContent value="ponctuel">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-2xl text-directiveplus-700">Faire un don ponctuel</CardTitle>
                      <CardDescription>
                        Votre soutien nous aide à maintenir notre plateforme et à développer de nouvelles fonctionnalités.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div>
                          <h3 className="font-medium mb-3">Choisissez un montant</h3>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {["10", "20", "50", "100"].map((amount) => (
                              <Button
                                key={amount}
                                variant={selectedAmount === amount ? "default" : "outline"}
                                className={selectedAmount === amount 
                                  ? "bg-directiveplus-600 hover:bg-directiveplus-700" 
                                  : "border-directiveplus-200 hover:border-directiveplus-300"
                                }
                                onClick={() => handleAmountClick(amount)}
                              >
                                {amount} €
                              </Button>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="font-medium mb-3">Ou entrez un autre montant</h3>
                          <div className="flex items-center max-w-xs">
                            <input
                              type="number"
                              min="1"
                              step="1"
                              value={customAmount}
                              onChange={handleCustomAmountChange}
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                              placeholder="Montant"
                            />
                            <span className="ml-2 text-lg font-medium">€</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        className="w-full bg-directiveplus-600 hover:bg-directiveplus-700 flex items-center gap-2"
                        onClick={() => handleDonation(false)}
                        disabled={isProcessing}
                      >
                        <DollarSign className="h-5 w-5" />
                        {isProcessing ? "Traitement en cours..." : "Faire un don maintenant"}
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
                
                <TabsContent value="mensuel">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-2xl text-directiveplus-700">Devenir donateur mensuel</CardTitle>
                      <CardDescription>
                        Votre soutien régulier nous permet de planifier nos projets sur le long terme.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div>
                          <h3 className="font-medium mb-3">Choisissez un montant mensuel</h3>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {["5", "10", "15", "25"].map((amount) => (
                              <Button
                                key={amount}
                                variant={selectedAmount === amount ? "default" : "outline"}
                                className={selectedAmount === amount 
                                  ? "bg-directiveplus-600 hover:bg-directiveplus-700" 
                                  : "border-directiveplus-200 hover:border-directiveplus-300"
                                }
                                onClick={() => handleAmountClick(amount)}
                              >
                                {amount} €/mois
                              </Button>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="font-medium mb-3">Ou entrez un autre montant mensuel</h3>
                          <div className="flex items-center max-w-xs">
                            <input
                              type="number"
                              min="1"
                              step="1"
                              value={customAmount}
                              onChange={handleCustomAmountChange}
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                              placeholder="Montant"
                            />
                            <span className="ml-2 text-lg font-medium">€/mois</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        className="w-full bg-directiveplus-600 hover:bg-directiveplus-700 flex items-center gap-2"
                        onClick={() => handleDonation(true)}
                        disabled={isProcessing}
                      >
                        <DollarSign className="h-5 w-5" />
                        {isProcessing ? "Traitement en cours..." : "Devenir donateur mensuel"}
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </Tabs>
              
              {/* Info Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl text-directiveplus-700">Pourquoi soutenir ?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">
                      Vos dons nous permettent de maintenir la plateforme accessible gratuitement et de développer de nouvelles fonctionnalités pour améliorer l'expérience utilisateur.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl text-directiveplus-700">Comment sont utilisés les dons ?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">
                      Les dons servent à financer l'hébergement sécurisé des données, le développement technique de la plateforme et les actions de sensibilisation autour des directives anticipées.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl text-directiveplus-700">Avantages fiscaux</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">
                      Vos dons à DirectivesPlus sont déductibles des impôts à hauteur de 66% de leur montant dans la limite de 20% de votre revenu imposable.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Soutenir;
