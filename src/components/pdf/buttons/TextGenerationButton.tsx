
import { AlignLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TextGenerationButtonProps {
  onClick: () => void;
  isGenerating: boolean;
}

export function TextGenerationButton({ 
  onClick, 
  isGenerating 
}: TextGenerationButtonProps) {
  return (
    <Button 
      onClick={onClick}
      className="flex items-center gap-2"
      disabled={isGenerating}
    >
      <AlignLeft className="h-4 w-4" />
      Générer mes directives anticipées
    </Button>
  );
}
