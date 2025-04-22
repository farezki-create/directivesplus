
import React from "react";

interface CardSectionContainerProps {
  children: React.ReactNode;
}

export function CardSectionContainer({ children }: CardSectionContainerProps) {
  return (
    <div className="border-t pt-6">
      <h3 className="text-lg font-semibold mb-3">Carte format bancaire</h3>
      <p className="text-sm text-gray-500 mb-4">
        Générez une carte au format bancaire contenant vos informations principales et les liens d'accès pour un accès facile à vos directives via Scalingo HDS.
      </p>
      {children}
    </div>
  );
}
