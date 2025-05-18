
import React from 'react';
import { 
  ClipboardList, 
  FileText, 
  UserCheck, 
  Sparkles, 
  Save, 
  PenLine, 
  FileDown, 
  Share2 
} from 'lucide-react';

const InfoSteps = () => {
  const steps = [
    { id: 1, text: "Répondre aux questionnaires", icon: <ClipboardList /> },
    { id: 5, text: "Ajouter texte libre et phrases types", icon: <FileText /> },
    { id: 6, text: "Désigner la personne de confiance", icon: <UserCheck /> },
    { id: 7, text: "Consulter la synthèse", icon: <Sparkles /> },
    { id: 8, text: "Enregistrer", icon: <Save /> },
    { id: 9, text: "Signer", icon: <PenLine /> },
    { id: 10, text: "Générer le PDF", icon: <FileDown /> },
    { id: 11, text: "Télécharger, Partager", icon: <Share2 /> }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
      <h2 className="text-xl font-semibold text-directiveplus-700 mb-4">Comment utiliser DirectivesPlus</h2>
      
      {/* Simple Diagram - Desktop */}
      <div className="hidden md:block relative">
        <div className="max-w-4xl mx-auto bg-directiveplus-50 p-6 rounded-lg">
          <div className="flex justify-between items-center">
            <div className="w-1/3 text-center">
              <h3 className="text-directiveplus-700 font-medium mb-4">Préparation</h3>
              <div className="flex flex-col space-y-4">
                {steps.slice(0, 3).map((step) => (
                  <div key={step.id} className="flex items-center bg-white p-3 rounded-md shadow-sm">
                    <div className="bg-directiveplus-100 p-2 rounded-full mr-3 text-directiveplus-600">
                      {step.icon}
                    </div>
                    <span className="text-sm">
                      <span className="inline-flex items-center justify-center bg-directiveplus-600 text-white rounded-full h-5 w-5 mr-1.5 text-xs">
                        {step.id}
                      </span>
                      {step.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="w-1/3 text-center">
              <h3 className="text-directiveplus-700 font-medium mb-4">Finalisation</h3>
              <div className="flex flex-col space-y-4">
                {steps.slice(3, 6).map((step) => (
                  <div key={step.id} className="flex items-center bg-white p-3 rounded-md shadow-sm">
                    <div className="bg-directiveplus-100 p-2 rounded-full mr-3 text-directiveplus-600">
                      {step.icon}
                    </div>
                    <span className="text-sm">
                      <span className="inline-flex items-center justify-center bg-directiveplus-600 text-white rounded-full h-5 w-5 mr-1.5 text-xs">
                        {step.id}
                      </span>
                      {step.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="w-1/3 text-center">
              <h3 className="text-directiveplus-700 font-medium mb-4">Distribution</h3>
              <div className="flex flex-col space-y-4">
                {steps.slice(6).map((step) => (
                  <div key={step.id} className="flex items-center bg-white p-3 rounded-md shadow-sm">
                    <div className="bg-directiveplus-100 p-2 rounded-full mr-3 text-directiveplus-600">
                      {step.icon}
                    </div>
                    <span className="text-sm">
                      <span className="inline-flex items-center justify-center bg-directiveplus-600 text-white rounded-full h-5 w-5 mr-1.5 text-xs">
                        {step.id}
                      </span>
                      {step.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Process Arrows */}
          <div className="flex justify-center mt-6">
            <div className="flex items-center text-directiveplus-600">
              <span>Préparation</span>
              <svg className="w-12 h-6 mx-2" viewBox="0 0 24 12">
                <path d="M0,6 H20 M16,1 L22,6 L16,11" fill="none" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <span>Finalisation</span>
              <svg className="w-12 h-6 mx-2" viewBox="0 0 24 12">
                <path d="M0,6 H20 M16,1 L22,6 L16,11" fill="none" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <span>Distribution</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Step List */}
      <div className="md:hidden">
        <h3 className="text-sm font-medium text-gray-600 mb-3">Après connexion:</h3>
        <ol className="space-y-3">
          {steps.map((step) => (
            <li key={step.id} className="flex items-center gap-3">
              <div className="bg-directiveplus-100 p-2 rounded-full text-directiveplus-600">
                {step.icon}
              </div>
              <span className="text-sm">
                <span className="inline-flex items-center justify-center bg-directiveplus-600 text-white rounded-full h-5 w-5 mr-1.5 text-xs">
                  {step.id}
                </span>
                {step.text}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default InfoSteps;
