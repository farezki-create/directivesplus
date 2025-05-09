
import React from "react";
import { Button } from "@/components/ui/button";
import { IdCard } from "lucide-react";

interface GenerateCardButtonProps {
  onClick: () => void;
  disabled: boolean;
  isGenerating: boolean;
}

export function GenerateCardButton({ onClick, disabled, isGenerating }: GenerateCardButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2 w-full"
    >
      {isGenerating ? (
        <>Génération en cours...</>
      ) : (
        <>
          <IdCard className="h-4 w-4" />
          Générer ma carte d'accès à mes données médicales
        </>
      )}
    </Button>
  );
}
