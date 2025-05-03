
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import { ArrowLeft } from "lucide-react";
import { AdvanceDirectivesGuide } from "./AdvanceDirectivesGuide";
import { AppInfoSection } from "./AppInfoSection";
import { LegalNoticesSection } from "./LegalNoticesSection";
import { useState } from "react";

export function LearnMoreSection() {
  const navigate = useNavigate();
  const { currentLanguage } = useLanguage();
  const [showGuide, setShowGuide] = useState(false);
  const [showAppInfo, setShowAppInfo] = useState(false);
  const [showLegalNotices, setShowLegalNotices] = useState(false);

  const navigateToFAQ = () => {
    navigate("/faq");
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => window.history.back()}
          className="mr-2"
          aria-label="Retour"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-3xl font-bold text-center">
          {currentLanguage === 'fr' ? 'Informations supplémentaires' : 'Additional Information'}
        </h1>
      </div>
      
      <div className="flex flex-col space-y-6 items-center">
        <Button
          variant="default"
          size="lg"
          onClick={() => setShowGuide(!showGuide)}
          className="w-full max-w-2xl py-6 text-lg bg-blue-600 hover:bg-blue-700"
        >
          {currentLanguage === 'fr' 
            ? 'Pourquoi et comment rédiger mes directives anticipées ?' 
            : 'Why and how to write my advance directives?'}
        </Button>
        
        {showGuide && <AdvanceDirectivesGuide />}
        
        <Button
          variant="default"
          size="lg"
          onClick={navigateToFAQ}
          className="w-full max-w-2xl py-6 text-lg bg-blue-600 hover:bg-blue-700"
        >
          {currentLanguage === 'fr' ? 'Questions/Réponses' : 'FAQ'}
        </Button>
        
        <Button
          variant="default"
          size="lg"
          onClick={() => setShowAppInfo(!showAppInfo)}
          className="w-full max-w-2xl py-6 text-lg bg-blue-600 hover:bg-blue-700"
        >
          {currentLanguage === 'fr' 
            ? 'Informations sur l\'application DirectivesPlus' 
            : 'Information about DirectivesPlus application'}
        </Button>
        
        {showAppInfo && <AppInfoSection />}
        
        <Button
          id="legal-notices-button"
          variant="default"
          size="lg"
          onClick={() => setShowLegalNotices(!showLegalNotices)}
          className="w-full max-w-2xl py-6 text-lg bg-blue-600 hover:bg-blue-700"
        >
          {currentLanguage === 'fr' ? 'Mentions légales' : 'Legal notices'}
        </Button>
        
        {showLegalNotices && <LegalNoticesSection />}
      </div>
    </div>
  );
}
