
import React from "react";
import Header from "@/components/Header";
import PageFooter from "@/components/layout/PageFooter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart, CreditCard, Users, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

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

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center shadow-sm">
              <CreditCard className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Don ponctuel</h3>
              <p className="text-gray-600 mb-4">
                Faites un don unique pour soutenir notre mission.
              </p>
              <Button className="w-full">
                Faire un don
              </Button>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center shadow-sm">
              <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Parrainage</h3>
              <p className="text-gray-600 mb-4">
                Parrainez DirectivesPlus et bénéficiez d'avantages exclusifs.
              </p>
              <Button variant="outline" className="w-full">
                En savoir plus
              </Button>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center shadow-sm">
              <Star className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Bénévolat</h3>
              <p className="text-gray-600 mb-4">
                Contribuez en tant que bénévole à notre communauté.
              </p>
              <Button variant="outline" className="w-full">
                Nous rejoindre
              </Button>
            </div>
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
            <Button variant="outline">
              Nous contacter
            </Button>
          </div>
        </div>
      </main>
      
      <PageFooter />
    </div>
  );
};

export default Soutenir;
