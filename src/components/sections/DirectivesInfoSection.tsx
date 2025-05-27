
import { Button } from "@/components/ui/button";
import { ChevronDown, BookOpen } from "lucide-react";
import { useState } from "react";
import FAQSection from "./directives-info/FAQSection";

const DirectivesInfoSection = () => {
  const [showFAQ, setShowFAQ] = useState(false);

  const toggleFAQ = () => {
    setShowFAQ(!showFAQ);
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Comprendre les directives anticipées
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
              Les directives anticipées vous permettent d'exprimer vos souhaits concernant vos soins médicaux 
              pour le cas où vous ne pourriez plus vous exprimer. Découvrez comment elles fonctionnent.
            </p>
            
            <Button 
              onClick={toggleFAQ}
              className="bg-directiveplus-600 hover:bg-directiveplus-700 text-white px-6 py-3 text-lg"
              size="lg"
            >
              <BookOpen className="mr-2 h-5 w-5" />
              {showFAQ ? "Masquer" : "Voir"} les questions-réponses
              <ChevronDown className={`ml-2 h-5 w-5 transition-transform ${showFAQ ? "rotate-180" : ""}`} />
            </Button>
          </div>

          {showFAQ && (
            <div className="mt-8 animate-in slide-in-from-top-4 duration-300">
              <FAQSection />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default DirectivesInfoSection;
