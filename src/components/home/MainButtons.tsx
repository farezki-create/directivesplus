
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/hooks/language/useLanguage";
import { ArrowRight, FileText, Users, Brain, Settings, ClipboardList, BookOpen } from "lucide-react";

interface MainButtonsProps {
  onGeneralOpinionClick: () => void;
  onLifeSupportClick: () => void;
  onAdvancedIllnessClick: () => void;
  onPreferencesClick: () => void;
}

export function MainButtons({
  onGeneralOpinionClick,
  onLifeSupportClick,
  onAdvancedIllnessClick,
  onPreferencesClick,
}: MainButtonsProps) {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const navigateToTrustedPersons = () => {
    navigate("/dashboard?tab=persons");
  };

  return (
    <div className="flex flex-col gap-8 max-w-2xl mx-auto mb-8">
      {/* Primary Buttons - First Level */}
      <div className="grid gap-4 md:grid-cols-2">
        <Button 
          onClick={onGeneralOpinionClick} 
          size="lg" 
          className="h-16 bg-blue-600 hover:bg-blue-700 text-base font-medium shadow-md flex justify-between"
        >
          <Brain className="w-5 h-5 mr-2" />
          <span className="flex-1 text-left">{t('generalOpinion')}</span>
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
        
        <Button 
          onClick={onLifeSupportClick} 
          size="lg" 
          className="h-16 bg-blue-600 hover:bg-blue-700 text-base font-medium shadow-md flex justify-between"
        >
          <FileText className="w-5 h-5 mr-2" />
          <span className="flex-1 text-left">{t('lifeSupport')}</span>
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
        
        <Button 
          onClick={onAdvancedIllnessClick} 
          size="lg" 
          className="h-16 bg-blue-600 hover:bg-blue-700 text-base font-medium shadow-md flex justify-between"
        >
          <Brain className="w-5 h-5 mr-2" />
          <span className="flex-1 text-left">{t('advancedIllnessTitle')}</span>
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
        
        <Button 
          onClick={onPreferencesClick} 
          size="lg" 
          className="h-16 bg-blue-600 hover:bg-blue-700 text-base font-medium shadow-md flex justify-between"
        >
          <Settings className="w-5 h-5 mr-2" />
          <span className="flex-1 text-left">{t('preferences')}</span>
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>

      {/* Secondary Buttons - Second Level */}
      <div className="grid gap-4 md:grid-cols-2">
        <Button 
          onClick={navigateToTrustedPersons} 
          variant="outline"
          size="lg" 
          className="h-14 border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 text-base font-medium shadow-sm flex items-center justify-start"
        >
          <Users className="w-5 h-5 mr-3" />
          {t('trustedPerson')}
        </Button>
        
        <Button 
          onClick={() => navigate("/free-text")} 
          variant="outline"
          size="lg" 
          className="h-14 border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 text-base font-medium shadow-sm flex items-center justify-start"
        >
          <ClipboardList className="w-5 h-5 mr-3" />
          {t('summary')}
        </Button>
        
        <Button 
          onClick={() => navigate("/examples")} 
          variant="outline"
          size="lg" 
          className="h-14 border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 text-base font-medium shadow-sm md:col-span-2 flex items-center justify-start"
        >
          <BookOpen className="w-5 h-5 mr-3" />
          {t('examples')}
        </Button>
      </div>
    </div>
  );
}
