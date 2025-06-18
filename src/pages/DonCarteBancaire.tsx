
import React, { useState } from "react";
import Header from "@/components/Header";
import PageFooter from "@/components/layout/PageFooter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CreditCard, Check, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import PayPalDonationCard from "@/components/donation/PayPalDonationCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const DonCarteBancaire = () => {
  const navigate = useNavigate();

  const handleHelloAssoRedirect = () => {
    // Lien HelloAsso temporaire - à remplacer par votre vrai lien d'association
    window.open("https://www.helloasso.com/", "_blank");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Retour
          </Button>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <CreditCard className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-4 text-directiveplus-800">
              Don par carte bancaire
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choisissez votre plateforme de paiement préférée pour effectuer votre don en toute sécurité.
            </p>
          </div>

          <Tabs defaultValue="ponctuel" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="ponctuel">Don ponctuel</TabsTrigger>
              <TabsTrigger value="mensuel">Don mensuel</TabsTrigger>
            </TabsList>
            
            <TabsContent value="ponctuel" className="space-y-8">
              <div className="grid lg:grid-cols-2 gap-8">
                <PayPalDonationCard isRecurring={false} />
                
                <Card className="shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader className="text-center">
                    <div className="bg-blue-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-lg">HA</span>
                    </div>
                    <CardTitle className="text-2xl text-directiveplus-700">
                      HelloAsso
                    </CardTitle>
                    <CardDescription>
                      Plateforme française spécialisée dans les dons, 0% de commission
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Check className="w-4 h-4 text-green-600" />
                        <span>0% de commission</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Check className="w-4 h-4 text-green-600" />
                        <span>Plateforme française</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Check className="w-4 h-4 text-green-600" />
                        <span>Paiement sécurisé</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Check className="w-4 h-4 text-green-600" />
                        <span>Contribution libre</span>
                      </div>
                    </div>
                    
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
                      <p className="text-sm text-orange-800">
                        <strong>Configuration en cours :</strong> Le lien HelloAsso spécifique à DirectivesPlus est en cours de configuration. 
                        Vous serez redirigé vers HelloAsso pour le moment.
                      </p>
                    </div>
                    
                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
                      onClick={handleHelloAssoRedirect}
                    >
                      <ExternalLink className="h-4 w-4" />
                      Faire un don via HelloAsso
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="mensuel" className="space-y-8">
              <div className="grid lg:grid-cols-2 gap-8">
                <PayPalDonationCard isRecurring={true} />
                
                <Card className="shadow-lg hover:shadow-xl transition-shadow opacity-75">
                  <CardHeader className="text-center">
                    <div className="bg-gray-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <span className="text-gray-600 font-bold text-lg">HA</span>
                    </div>
                    <CardTitle className="text-2xl text-gray-600">
                      HelloAsso
                    </CardTitle>
                    <CardDescription>
                      Les dons récurrents via HelloAsso ne sont pas encore disponibles
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      className="w-full" 
                      variant="outline"
                      disabled
                    >
                      Bientôt disponible
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* Section informative */}
          <div className="mt-12 bg-gray-50 rounded-lg p-8">
            <h2 className="text-2xl font-semibold mb-6 text-center">
              Pourquoi ces plateformes ?
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3 text-blue-600">💳 PayPal</h3>
                <ul className="text-gray-600 space-y-2 text-sm">
                  <li>• Accepte toutes les cartes bancaires</li>
                  <li>• Paiements ponctuels et récurrents</li>
                  <li>• Interface sécurisée reconnue</li>
                  <li>• Frais : ~2,9% + 0,35€</li>
                </ul>
                <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
                  <strong>Note :</strong> Configuration PayPal en cours. Contactez l'administrateur si les paiements ne fonctionnent pas.
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3 text-blue-600">🇫🇷 HelloAsso</h3>
                <ul className="text-gray-600 space-y-2 text-sm">
                  <li>• Plateforme française spécialisée</li>
                  <li>• 0% de commission sur les dons</li>
                  <li>• Contribution libre optionnelle</li>
                  <li>• Idéale pour les projets citoyens</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-gray-600 mb-4">
              Vous préférez un autre moyen de paiement ?
            </p>
            <Button variant="outline" onClick={() => navigate("/soutenir")}>
              Voir toutes les options de don
            </Button>
          </div>
        </div>
      </main>
      
      <PageFooter />
    </div>
  );
};

export default DonCarteBancaire;
