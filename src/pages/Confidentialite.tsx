
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import PageFooter from "@/components/layout/PageFooter";
import DataProtectionLinks from "@/components/DataProtectionLinks";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const Confidentialite = () => {
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
            POLITIQUE DE CONFIDENTIALITÉ
          </h1>
          
          <div className="prose max-w-none">
            <h2 className="text-xl font-semibold mb-4">1. Collecte des données</h2>
            <p>
              DirectivesPlus collecte uniquement les données nécessaires au fonctionnement du service :
              informations personnelles d'identification, données médicales que vous choisissez de saisir,
              et données techniques de connexion pour assurer la sécurité.
            </p>
            
            <h2 className="text-xl font-semibold mb-4 mt-8">2. Utilisation des données</h2>
            <p>
              Vos données sont utilisées exclusivement pour :
            </p>
            <ul className="list-disc pl-5 mb-4">
              <li>Vous permettre de créer et gérer vos directives anticipées</li>
              <li>Faciliter l'accès sécurisé par les professionnels de santé autorisés</li>
              <li>Assurer la sécurité et le bon fonctionnement du service</li>
              <li>Vous contacter en cas de problème technique ou de sécurité</li>
            </ul>
            
            <h2 className="text-xl font-semibold mb-4 mt-8">3. Partage des données</h2>
            <p>
              Vos données ne sont jamais vendues, louées ou partagées à des fins commerciales.
              Elles ne sont accessibles qu'aux professionnels de santé que vous autorisez
              explicitement via un code d'accès temporaire.
            </p>
            
            <h2 className="text-xl font-semibold mb-4 mt-8">4. Sécurité</h2>
            <p>
              Nous utilisons un chiffrement de niveau bancaire et un hébergement certifié HDS
              (Hébergeur de Données de Santé) pour protéger vos informations.
            </p>
            
            <h2 className="text-xl font-semibold mb-4 mt-8">5. Vos droits</h2>
            <p>
              Conformément au RGPD, vous disposez des droits d'accès, rectification,
              effacement et portabilité de vos données. Contactez-nous à
              <a href="mailto:contact@directivesplus.fr" className="text-directiveplus-600 hover:underline ml-1">
                contact@directivesplus.fr
              </a>
            </p>
          </div>
          
          <div className="mt-10">
            <DataProtectionLinks />
          </div>
        </div>
      </main>
      
      <PageFooter />
    </div>
  );
};

export default Confidentialite;
