import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";

interface ExamplesButtonsProps {
  onExamplesClick: () => void;
}

export function ExamplesButtons({ onExamplesClick }: ExamplesButtonsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-1 max-w-2xl mx-auto">
      <Button 
        onClick={onExamplesClick} 
        size="lg"
        className="flex items-center gap-2"
      >
        <BookOpen className="w-5 h-5" />
        Proposition de Directives Anticipées
      </Button>
    </div>
  );
}