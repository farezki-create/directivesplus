import { Button } from "@/components/ui/button";
import { BookOpen, FileText } from "lucide-react";

interface ExamplesButtonsProps {
  onExamplesClick: () => void;
  onDocumentsClick: () => void;
}

export function ExamplesButtons({ onExamplesClick, onDocumentsClick }: ExamplesButtonsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 max-w-2xl mx-auto">
      <Button 
        onClick={onExamplesClick} 
        size="lg"
        className="flex items-center gap-2"
      >
        <BookOpen className="w-5 h-5" />
        Exemples de Directives anticipées
      </Button>
      <Button 
        onClick={onDocumentsClick} 
        size="lg"
        className="flex items-center gap-2"
      >
        <FileText className="w-5 h-5" />
        Mes Documents
      </Button>
    </div>
  );
}