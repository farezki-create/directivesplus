
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Euro, CreditCard, Repeat, Gift } from "lucide-react";

const FinancialSection = () => {
  const donationAmounts = [5, 10, 25, 50, 100];

  const handleDonation = (amount: number, recurring: boolean = false) => {
    // Simulation - ici vous pourriez intégrer Stripe, PayPal, etc.
  };

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Soutien financier
            </h2>
            <p className="text-lg text-gray-600">
              Votre contribution financière nous aide à maintenir et développer DirectivesPlus
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Don unique */}
            <Card className="border-2 border-gray-200 hover:border-directiveplus-300 transition-colors">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2 text-directiveplus-700">
                  <Gift className="h-6 w-6" />
                  Don unique
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 text-center mb-6">
                  Faites un don ponctuel pour soutenir notre mission
                </p>
                
                <div className="grid grid-cols-3 gap-2">
                  {donationAmounts.map((amount) => (
                    <Button
                      key={amount}
                      variant="outline"
                      className="h-12"
                      onClick={() => handleDonation(amount)}
                    >
                      {amount}€
                    </Button>
                  ))}
                </div>
                
                <Button 
                  className="w-full bg-directiveplus-600 hover:bg-directiveplus-700"
                  onClick={() => handleDonation(25)}
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Faire un don
                </Button>
              </CardContent>
            </Card>
            
            {/* Don récurrent */}
            <Card className="border-2 border-directiveplus-200 bg-directiveplus-50">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2 text-directiveplus-700">
                  <Repeat className="h-6 w-6" />
                  Don mensuel
                </CardTitle>
                <div className="bg-directiveplus-600 text-white px-3 py-1 rounded-full text-sm">
                  Recommandé
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 text-center mb-6">
                  Un soutien régulier nous aide à planifier nos développements
                </p>
                
                <div className="grid grid-cols-3 gap-2">
                  {donationAmounts.slice(0, 3).map((amount) => (
                    <Button
                      key={amount}
                      variant="outline"
                      className="h-12"
                      onClick={() => handleDonation(amount, true)}
                    >
                      {amount}€/mois
                    </Button>
                  ))}
                </div>
                
                <Button 
                  className="w-full bg-directiveplus-600 hover:bg-directiveplus-700"
                  onClick={() => handleDonation(10, true)}
                >
                  <Euro className="mr-2 h-4 w-4" />
                  Don mensuel
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-12 text-center">
            <Card className="bg-gray-50">
              <CardContent className="p-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  À quoi servent vos dons ?
                </h3>
                <div className="grid md:grid-cols-3 gap-6 text-sm text-gray-600">
                  <div>
                    <div className="font-medium text-directiveplus-600 mb-2">Hébergement sécurisé</div>
                    <p>Serveurs certifiés HDS pour protéger vos données de santé</p>
                  </div>
                  <div>
                    <div className="font-medium text-directiveplus-600 mb-2">Développement</div>
                    <p>Nouvelles fonctionnalités et améliorations continues</p>
                  </div>
                  <div>
                    <div className="font-medium text-directiveplus-600 mb-2">Support</div>
                    <p>Assistance aux utilisateurs et maintenance</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialSection;
