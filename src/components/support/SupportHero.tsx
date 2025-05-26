
import React from "react";
import { Heart, Users, Shield } from "lucide-react";

const SupportHero = () => {
  return (
    <div className="bg-gradient-to-br from-directiveplus-600 to-directiveplus-800 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-white/10 rounded-full p-4">
              <Heart className="h-12 w-12" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Soutenez DirectivesPlus
          </h1>
          
          <p className="text-xl mb-8 text-gray-100 leading-relaxed">
            Aidez-nous à rendre les directives anticipées accessibles à tous. 
            Votre soutien nous permet de maintenir cette plateforme gratuite et sécurisée.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <div className="bg-white/10 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Accessibilité</h3>
              <p className="text-gray-200">
                Maintenir un service gratuit pour tous
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-white/10 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Sécurité</h3>
              <p className="text-gray-200">
                Investir dans les meilleures technologies de protection
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-white/10 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Heart className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Innovation</h3>
              <p className="text-gray-200">
                Développer de nouvelles fonctionnalités utiles
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportHero;
