
import React from 'react';
import { 
  ClipboardList, 
  FileText, 
  UserCheck, 
  FileSparkles, 
  Save, 
  PenLine, 
  FileDown, 
  Share2 
} from 'lucide-react';

const InfoSteps = () => {
  const steps = [
    { id: 1, text: "Répondre aux questionnaires 1 à 4", icon: <ClipboardList /> },
    { id: 5, text: "Ajouter texte libre et phrases types", icon: <FileText /> },
    { id: 6, text: "Désigner la personne de confiance", icon: <UserCheck /> },
    { id: 7, text: "Consulter la synthèse", icon: <FileSparkles /> },
    { id: 8, text: "Enregistrer", icon: <Save /> },
    { id: 9, text: "Signer", icon: <PenLine /> },
    { id: 10, text: "Générer le PDF", icon: <FileDown /> },
    { id: 11, text: "Télécharger, Partager", icon: <Share2 /> }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
      <h2 className="text-xl font-semibold text-directiveplus-700 mb-4">Comment utiliser DirectivesPlus</h2>
      
      {/* Desktop Wheel View */}
      <div className="hidden md:block relative">
        <div className="w-64 h-64 rounded-full bg-directiveplus-50 mx-auto relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-directiveplus-600 font-bold text-lg">DirectivesPlus</span>
          </div>
          
          {steps.map((step, index) => {
            // Calculate position around the circle
            const angle = ((Math.PI * 2) / steps.length) * index - Math.PI / 2;
            const radius = 150; // Radius of the circle in px
            const x = Math.cos(angle) * radius + 180; // Position X (180 is to center)
            const y = Math.sin(angle) * radius + 180; // Position Y
            
            return (
              <div 
                key={step.id} 
                className="absolute transform -translate-x-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md border border-directiveplus-100 flex flex-col items-center w-16 h-16"
                style={{ left: `${x}px`, top: `${y}px` }}
              >
                <div className="text-directiveplus-600">
                  {step.icon}
                </div>
                <span className="text-xs font-medium">{step.id >= 8 ? "" : step.id}</span>
              </div>
            );
          })}
          
          {/* Connecting lines */}
          {steps.map((step, index) => {
            const nextIndex = (index + 1) % steps.length;
            const angle1 = ((Math.PI * 2) / steps.length) * index - Math.PI / 2;
            const angle2 = ((Math.PI * 2) / steps.length) * nextIndex - Math.PI / 2;
            
            const innerRadius = 50;
            const x1 = Math.cos(angle1) * innerRadius + 180;
            const y1 = Math.sin(angle1) * innerRadius + 180;
            const x2 = Math.cos(angle2) * innerRadius + 180;
            const y2 = Math.sin(angle2) * innerRadius + 180;
            
            return (
              <svg key={`line-${index}`} className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#e5deff"
                  strokeWidth="2"
                  strokeDasharray="4"
                />
              </svg>
            );
          })}
        </div>
        
        {/* Legend */}
        <div className="grid grid-cols-4 gap-4 mt-8 max-w-2xl mx-auto">
          {steps.map((step) => (
            <div key={step.id} className="flex items-center gap-2">
              <div className="bg-directiveplus-100 p-1.5 rounded-full text-directiveplus-600">
                {step.icon}
              </div>
              <span className="text-sm text-gray-700">{step.text}</span>
            </div>
          ))}
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
                {step.id <= 7 && (
                  <span className="inline-flex items-center justify-center bg-directiveplus-600 text-white rounded-full h-5 w-5 mr-1.5 text-xs">
                    {step.id}
                  </span>
                )}
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
