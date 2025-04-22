
import React from "react";

interface CardInfoMessageProps {
  cardPdfUrl: string | null;
}

export function CardInfoMessage({ cardPdfUrl }: CardInfoMessageProps) {
  if (!cardPdfUrl) return null;
  
  return (
    <div className="mt-4 p-3 bg-blue-50 rounded-md">
      <p className="text-sm text-blue-800 mb-2">
        <strong>Information:</strong> La carte a été sauvegardée dans votre espace sécurisé et ajoutée à vos documents.
      </p>
      <div className="text-sm text-gray-600">
        <p className="mb-2">
          Cette carte contient les liens vers votre espace documents et directives anticipées.
        </p>
      </div>
    </div>
  );
}
