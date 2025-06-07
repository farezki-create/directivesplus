
import React from 'react';
import { CheckCircle, Circle, FileText } from 'lucide-react';

const InfoSteps = () => {
  const steps = [
    {
      id: 1,
      title: "Inscription sécurisée",
      description: "Créez votre compte avec une authentification renforcée",
      completed: true
    },
    {
      id: 2,
      title: "Rédaction de vos directives",
      description: "Rédigez vos directives anticipées étape par étape",
      completed: false,
      current: true
    },
    {
      id: 3,
      title: "Validation et stockage",
      description: "Vos directives sont stockées de manière sécurisée",
      completed: false
    },
    {
      id: 4,
      title: "Partage contrôlé",
      description: "Partagez vos directives avec vos proches et médecins",
      completed: false
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
      <div className="flex items-center mb-4">
        <FileText className="w-5 h-5 text-directiveplus-600 mr-2" />
        <h2 className="text-lg font-semibold">Votre progression</h2>
      </div>
      
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-start">
            <div className="flex-shrink-0 mr-3">
              {step.completed ? (
                <CheckCircle className="w-6 h-6 text-green-500" />
              ) : (
                <Circle className={`w-6 h-6 ${step.current ? 'text-directiveplus-600' : 'text-gray-300'}`} />
              )}
            </div>
            <div className="flex-grow">
              <h3 className={`font-medium ${step.current ? 'text-directiveplus-600' : step.completed ? 'text-green-600' : 'text-gray-500'}`}>
                {step.title}
              </h3>
              <p className="text-gray-600 text-sm">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InfoSteps;
