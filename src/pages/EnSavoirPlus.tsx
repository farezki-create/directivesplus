
import { useEffect } from "react";
import Header from "@/components/Header";
import PageFooter from "@/components/layout/PageFooter";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const EnSavoirPlus = () => {
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
            En savoir plus sur DirectivesPlus
          </h1>
          
          <div className="mb-8 space-y-6">
            <div className="flex justify-center">
              <img 
                src="/lovable-uploads/89dffdef-ec1c-4e83-a2a6-aec4cb3eb098.png" 
                alt="Comment utiliser DirectivesPlus - Processus de création des directives anticipées" 
                className="w-full max-w-3xl rounded-lg shadow-md" 
              />
            </div>
            <div className="flex justify-center">
              <img 
                src="/lovable-uploads/362aba50-e9d2-4f3d-a392-18650f79e34d.png" 
                alt="Les étapes pour créer vos directives anticipées avec DirectivesPlus" 
                className="w-full max-w-3xl rounded-lg shadow-md" 
              />
            </div>
          </div>
          
          <div className="prose max-w-none">
            <h2 className="text-xl font-semibold mb-4">Notre mission</h2>
            <p className="mb-6">
              DirectivesPlus a été créé pour simplifier la création, le stockage et le partage des directives
              anticipées médicales. Notre mission est de garantir que les souhaits de chaque personne concernant
              ses soins de santé soient clairement documentés et facilement accessibles par les professionnels
              de santé au moment où ces informations sont nécessaires.
            </p>
            
            <h2 className="text-xl font-semibold mb-4">Comment ça fonctionne ?</h2>
            <div className="mb-8">
              <ol className="list-decimal pl-5 space-y-4">
                <li>
                  <strong>Créez votre compte personnel</strong> : Inscrivez-vous gratuitement sur notre plateforme sécurisée.
                </li>
                <li>
                  <strong>Rédigez vos directives</strong> : Utilisez notre questionnaire guidé pour exprimer vos préférences
                  médicales dans différentes situations.
                </li>
                <li>
                  <strong>Désignez vos personnes de confiance</strong> : Identifiez les personnes qui pourront témoigner
                  de vos volontés si vous ne pouvez plus vous exprimer.
                </li>
                <li>
                  <strong>Partagez l'accès</strong> : Générez des codes d'accès que vous pouvez partager avec vos proches
                  ou professionnels de santé.
                </li>
                <li>
                  <strong>Utilisez votre carte d'accès</strong> : Imprimez ou enregistrez votre carte d'accès pour
                  permettre une consultation rapide de vos directives en cas d'urgence.
                </li>
              </ol>
            </div>
            
            <h2 className="text-xl font-semibold mb-4">Sécurité et confidentialité</h2>
            <p className="mb-6">
              Nous prenons très au sérieux la protection de vos données personnelles et médicales. Notre plateforme
              utilise un chiffrement de bout en bout et est hébergée sur des serveurs conformes aux normes HDS
              (Hébergement des Données de Santé). Vous gardez toujours le contrôle sur qui peut accéder à vos
              informations et quand.
            </p>
            
            <h2 className="text-xl font-semibold mb-4">Pour qui ?</h2>
            <p className="mb-6">
              DirectivesPlus s'adresse à toute personne souhaitant :
            </p>
            <ul className="list-disc pl-5 mb-6">
              <li>Préparer ses directives anticipées médicales</li>
              <li>Faciliter l'accès à ses informations médicales importantes</li>
              <li>Désigner des personnes de confiance</li>
              <li>S'assurer que ses volontés seront respectées en cas d'incapacité à s'exprimer</li>
            </ul>
            
            <h2 className="text-xl font-semibold mb-4">Nous contacter</h2>
            <p>
              Pour toute question concernant nos services, n'hésitez pas à nous contacter à l'adresse email suivante :
              <a href="mailto:mesdirectives@directivesplus.fr" className="text-directiveplus-600 hover:underline ml-1">
                mesdirectives@directivesplus.fr
              </a>
            </p>
          </div>
        </div>
      </main>
      
      <PageFooter />
    </div>
  );
};

export default EnSavoirPlus;
