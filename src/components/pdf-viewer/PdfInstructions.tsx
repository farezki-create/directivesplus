
import React from "react";

interface PdfInstructionsProps {
  isMobile: boolean;
}

const PdfInstructions: React.FC<PdfInstructionsProps> = ({ isMobile }) => {
  return (
    <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
      <p className="text-sm text-blue-800">
        📄 <strong>Navigation :</strong> Utilisez la barre d'outils du PDF pour naviguer entre les pages, zoomer, ou rechercher du contenu dans le document.
      </p>
      <p className="text-xs text-blue-600 mt-1">
        💡 <strong>Astuce :</strong> Si le document semble incomplet, attendez quelques secondes que toutes les pages se chargent, ou utilisez le bouton "Ouvrir" pour l'afficher dans un nouvel onglet.
      </p>
      {isMobile && (
        <p className="text-xs text-green-600 mt-1">
          📱 <strong>Sur mobile :</strong> Utilisez le bouton vert "Télécharger" en haut pour une meilleure expérience sur téléphone.
        </p>
      )}
    </div>
  );
};

export default PdfInstructions;
