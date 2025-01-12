import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { ReactNode } from "react";

interface SectionContentProps {
  section: {
    id: string;
    title: string;
    content: ReactNode;
  };
  openSection: string | null;
  handleSectionClick: (section: string) => void;
}

export const SectionContent = ({ section, openSection, handleSectionClick }: SectionContentProps) => {
  return (
    <Collapsible
      key={section.id}
      open={openSection === section.id}
      onOpenChange={() => handleSectionClick(section.id)}
      className={`transition-all duration-300 ${
        openSection === section.id 
          ? 'fixed inset-0 z-50 bg-white overflow-auto p-6' 
          : 'relative border rounded-lg p-4 hover:border-primary/50 shadow-sm hover:shadow-md'
      }`}
    >
      <CollapsibleTrigger className="w-full flex items-center justify-between font-semibold group">
        <span className="text-lg">{section.title}</span>
        <ChevronDown className={`h-5 w-5 transition-transform duration-300 ease-in-out text-primary ${
          openSection === section.id ? 'transform rotate-180' : ''
        }`} />
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-4 transition-all duration-300">
        <div className="border-t pt-4">
          {section.content}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};