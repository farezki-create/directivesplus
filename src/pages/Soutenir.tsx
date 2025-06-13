
import React from "react";
import Header from "@/components/Header";
import PageFooter from "@/components/layout/PageFooter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart, CreditCard, Users, Star, Building2, Mail, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Soutenir = () => {
  const navigate = useNavigate();

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
            <Heart className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-4 text-directiveplus-800">
              Soutenir DirectivesPlus
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Votre soutien nous aide à maintenir et améliorer DirectivesPlus pour que chacun puisse 
              exprimer ses volontés médicales en toute sécurité.
            </p>
          </div>

          {/* Options de don */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <CreditCard className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <CardTitle className="text-xl">Paiement par carte</CardTitle>
                <CardDescription>
                  Paiement sécurisé par carte bancaire
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Paiement instantané</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Sécurisé SSL</span>
                </div>
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  Faire un don par carte
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <Building2 className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <CardTitle className="text-xl">Virement bancaire</CardTitle>
                <CardDescription>
                  Don par virement bancaire SEPA
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-50 p-3 rounded-lg text-sm">
                  <p><strong>IBAN:</strong> FR76 XXXX XXXX XXXX XXXX XXXX XXX</p>
                  <p><strong>BIC:</strong> BNPAFRPPXXX</p>
                  <p><strong>Bénéficiaire:</strong> DirectivesPlus</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Aucuns frais</span>
                </div>
                <Button variant="outline" className="w-full">
                  Copier les coordonnées
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <Mail className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <CardTitle className="text-xl">Envoi de chèque</CardTitle>
                <CardDescription>
                  Don par courrier postal
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-50 p-3 rounded-lg text-sm">
                  <p><strong>À l'ordre de:</strong> DirectivesPlus</p>
                  <p><strong>Adresse:</strong></p>
                  <p>DirectivesPlus<br/>
                     123 Rue de la Santé<br/>
                     75014 Paris, France</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Accusé de réception</span>
                </div>
                <Button variant="outline" className="w-full">
                  Imprimer l'adresse
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Section supplémentaire */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card>
              <CardHeader>
                <Users className="w-8 h-8 text-blue-600 mb-2" />
                <CardTitle>Parrainage</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Parrainez DirectivesPlus et bénéficiez d'avantages exclusifs pour votre institution.
                </p>
                <Button variant="outline" className="w-full">
                  En savoir plus
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Star className="w-8 h-8 text-yellow-600 mb-2" />
                <CardTitle>Bénévolat</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Contribuez en tant que bénévole à notre communauté et partagez votre expertise.
                </p>
                <Button variant="outline" className="w-full">
                  Nous rejoindre
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="bg-gray-50 rounded-lg p-8">
            <h2 className="text-2xl font-semibold mb-6 text-center">
              Pourquoi soutenir DirectivesPlus ?
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">🔒 Sécurité et confidentialité</h3>
                <p className="text-gray-600 mb-4">
                  Nous investissons constamment dans la sécurité pour protéger vos données médicales sensibles.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-3">🚀 Innovation continue</h3>
                <p className="text-gray-600 mb-4">
                  Votre soutien nous permet de développer de nouvelles fonctionnalités pour améliorer l'expérience utilisateur.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-3">🌍 Accessibilité pour tous</h3>
                <p className="text-gray-600 mb-4">
                  Nous souhaitons que DirectivesPlus reste accessible au plus grand nombre, indépendamment des moyens financiers.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-3">📚 Éducation et sensibilisation</h3>
                <p className="text-gray-600 mb-4">
                  Nous créons du contenu éducatif pour sensibiliser à l'importance des directives anticipées.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-gray-600 mb-4">
              Vous avez des questions sur les façons de soutenir DirectivesPlus ?
            </p>
            <Button variant="outline" asChild>
              <a href="mailto:contact@mesdirectives.fr">
                Nous contacter
              </a>
            </Button>
          </div>
        </div>
      </main>
      
      <PageFooter />
    </div>
  );
};

export default Soutenir;
