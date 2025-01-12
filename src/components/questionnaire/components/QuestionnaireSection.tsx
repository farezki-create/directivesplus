import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

interface QuestionnaireSectionProps {
  id: string;
  title: string;
  content: React.ReactNode;
  isOpen: boolean;
  onOpenChange: (id: string) => void;
}

export const QuestionnaireSection = ({ 
  id, 
  title, 
  content, 
  isOpen, 
  onOpenChange 
}: QuestionnaireSectionProps) => {
  return (
    <Collapsible
      key={id}
      open={isOpen}
      onOpenChange={() => onOpenChange(id)}
      className={`transition-all duration-300 ${
        isOpen 
          ? 'fixed inset-0 z-50 bg-background overflow-auto pt-20' 
          : 'relative border rounded-lg hover:border-primary/50 shadow-sm hover:shadow-md'
      }`}
    >
      <CollapsibleTrigger className={`w-full flex items-center justify-between p-4 ${
        isOpen ? 'fixed top-16 left-0 right-0 bg-background z-50 border-b px-6' : ''
      }`}>
        <span className="text-lg font-semibold">{title}</span>
        <ChevronDown className={`h-5 w-5 transition-transform duration-300 ease-in-out text-primary ${
          isOpen ? 'transform rotate-180' : ''
        }`} />
      </CollapsibleTrigger>
      
      <CollapsibleContent className={`transition-all duration-300 ${
        isOpen ? 'px-6 pb-6 pt-16' : 'p-4'
      }`}>
        {content}
      </CollapsibleContent>
    </Collapsible>
  );
};