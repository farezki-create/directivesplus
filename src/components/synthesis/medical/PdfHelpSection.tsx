
import React from 'react';

interface PdfHelpSectionProps {
  extractedText: string;
}

const PdfHelpSection: React.FC<PdfHelpSectionProps> = ({ extractedText }) => {
  return (
    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
      <p className="text-xs text-green-700 font-medium flex items-center">
        <span className="mr-1">💡</span>
        {extractedText ? 
          "Copie photo prête pour l'intégration dans votre PDF" : 
          "Créez une copie photo du document pour l'intégrer visuellement dans vos directives"
        }
      </p>
    </div>
  );
};

export default PdfHelpSection;
