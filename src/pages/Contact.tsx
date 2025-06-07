
import React from "react";
import Header from "@/components/Header";
import PageFooter from "@/components/layout/PageFooter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, Phone, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Contact = () => {
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
          <h1 className="text-3xl font-bold mb-8 text-center text-directiveplus-800">
            Nous contacter
          </h1>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <Mail className="w-6 h-6 text-directiveplus-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Email</h3>
                  <p className="text-gray-600 mb-2">
                    Pour toute question concernant vos directives anticipées :
                  </p>
                  <a 
                    href="mailto:contact@directivesplus.fr" 
                    className="text-directiveplus-600 hover:underline font-medium"
                  >
                    contact@directivesplus.fr
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Phone className="w-6 h-6 text-directiveplus-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Support technique</h3>
                  <p className="text-gray-600">
                    Notre équipe de support est disponible du lundi au vendredi de 9h à 18h.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-directiveplus-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Adresse</h3>
                  <p className="text-gray-600">
                    DirectivesPlus<br />
                    Service Client<br />
                    France
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-4">Questions fréquentes</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Comment modifier mes directives ?</h4>
                  <p className="text-sm text-gray-600">
                    Connectez-vous à votre espace personnel et accédez à la section "Rédiger".
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Comment partager mes directives ?</h4>
                  <p className="text-sm text-gray-600">
                    Utilisez votre carte d'accès ou générez un code de partage depuis votre espace.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Mes données sont-elles sécurisées ?</h4>
                  <p className="text-sm text-gray-600">
                    Oui, nous utilisons un hébergement certifié HDS et un chiffrement de bout en bout.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <PageFooter />
    </div>
  );
};

export default Contact;
