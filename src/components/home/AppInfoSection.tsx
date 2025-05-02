
import { useLanguage } from "@/hooks/useLanguage";
import { FrenchFlag } from "../ui/FrenchFlag";

export function AppInfoSection() {
  const { currentLanguage } = useLanguage();
  
  return (
    <div className="max-w-3xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {currentLanguage === 'fr' ? 'À propos de DirectivesPlus' : 'About DirectivesPlus'}
      </h2>
      
      <div className="space-y-6">
        {/* Étapes d'utilisation */}
        <div className="bg-blue-50 p-4 rounded-md">
          <h3 className="font-semibold text-lg mb-3">
            {currentLanguage === 'fr' ? 'Comment utiliser DirectivesPlus :' : 'How to use DirectivesPlus:'}
          </h3>
          
          <div className="space-y-2">
            {currentLanguage === 'fr' ? (
              <>
                <p><span className="font-medium">Après connexion:</span></p>
                <ol className="list-decimal pl-6 space-y-1">
                  <li>Répondre aux 4 questionnaires.</li>
                  <li>Rajouter aux choix, des phrases types.</li>
                  <li>Désigner la personne de confiance.</li>
                  <li>Consulter la synthèse.</li>
                  <li>Rajouter si besoin, un texte libre.</li>
                  <li>Enregistrer.</li>
                  <li>Signer.</li>
                  <li>Générer les directives anticipées en format PDF.</li>
                  <li>Télécharger, Partager.</li>
                </ol>
                <div className="flex items-center space-x-2 mt-3">
                  <p className="text-sm font-semibold">100% sécurisé</p>
                  <FrenchFlag />
                </div>
                <p className="text-sm mt-1">
                  Vos directives anticipées et documents de santé sont hébergés en France 
                  dans le serveur Scalingo, certifiés HDS par les autorités de santé.
                </p>
              </>
            ) : (
              <>
                <p><span className="font-medium">After login:</span></p>
                <ol className="list-decimal pl-6 space-y-1">
                  <li>Answer the 4 questionnaires.</li>
                  <li>Add template phrases of your choice.</li>
                  <li>Designate a trusted person.</li>
                  <li>Review the synthesis.</li>
                  <li>Add free text if needed.</li>
                  <li>Save.</li>
                  <li>Sign.</li>
                  <li>Generate advance directives in PDF format.</li>
                  <li>Download, Share.</li>
                </ol>
                <div className="flex items-center space-x-2 mt-3">
                  <p className="text-sm font-semibold">100% secure</p>
                  <FrenchFlag />
                </div>
                <p className="text-sm mt-1">
                  Your advance directives and health documents are hosted in France
                  on the Scalingo server, HDS certified by health authorities.
                </p>
              </>
            )}
          </div>
        </div>
        
        {/* Image au milieu */}
        <div className="flex justify-center my-4">
          <img 
            src="/lovable-uploads/8e206e7b-bb7a-4e2d-8e38-fa1a1becc37d.png" 
            alt="DirectivesPlus"
            className="max-w-full rounded-md shadow-sm"
          />
        </div>
        
        {/* Information originale */}
        <div className="text-center space-y-2">
          <p className="text-base">
            {currentLanguage === 'fr' 
              ? 'Cette application a été imaginée par des :'
              : 'This application was designed by:'}
          </p>
          <p className="font-medium">
            {currentLanguage === 'fr'
              ? 'médecins anesthésistes-réanimateurs et en éthique médicale.'
              : 'anesthesiologist-intensivists and medical ethics specialists.'}
          </p>
          <p className="mt-4">
            {currentLanguage === 'fr' ? 'Contact :' : 'Contact:'}{' '}
            <a 
              href="mailto:mesdirectives@directivesplus.fr" 
              className="text-blue-600 hover:underline"
            >
              mesdirectives@directivesplus.fr
            </a>
          </p>
        </div>
        
        {/* Copyright */}
        <div className="text-center text-sm text-gray-500 mt-4 pt-4 border-t border-gray-200">
          © {new Date().getFullYear()} DirectivesPlus. {currentLanguage === 'fr' ? 'Tous droits réservés.' : 'All rights reserved.'}
        </div>
      </div>
    </div>
  );
}
