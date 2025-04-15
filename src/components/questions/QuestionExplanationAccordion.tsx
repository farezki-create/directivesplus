
import React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Info } from "lucide-react";

interface QuestionExplanationAccordionProps {
  explanationText: string;
  language: 'en' | 'fr';
}

export function QuestionExplanationAccordion({
  explanationText,
  language
}: QuestionExplanationAccordionProps) {
  if (!explanationText) {
    return (
      <div className="text-xs text-muted-foreground mt-2">
        {language === 'en' ? 'No explanation available' : 'Pas d\'explication disponible'}
      </div>
    );
  }

  return (
    <Accordion type="single" collapsible className="mt-2">
      <AccordionItem value="explanation" className="border-0">
        <AccordionTrigger className="py-2 text-muted-foreground hover:text-primary text-sm">
          <div className="flex items-center">
            <Info className="mr-1 h-4 w-4" />
            {language === 'en' ? 'Explanation' : 'Explication'}
          </div>
        </AccordionTrigger>
        <AccordionContent className="p-4 bg-muted rounded-md text-sm">
          {explanationText}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
