
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import { PenLine, Heart, Stethoscope, Leaf, Users, Book, FileText } from "lucide-react";

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
    <div className="grid gap-4 md:grid-cols-2 max-w-2xl mx-auto mb-8">
      <Button 
        onClick={onGeneralOpinionClick} 
        size="lg"
        className="group rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-md hover:shadow-lg transition-all duration-200 border border-indigo-400/20"
      >
        <PenLine className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
        {t('generalOpinion')}
      </Button>
      
      <Button 
        onClick={onLifeSupportClick} 
        size="lg"
        className="group rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all duration-200 border border-blue-400/20"
      >
        <Heart className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
        {t('lifeSupport')}
      </Button>
      
      <Button 
        onClick={onAdvancedIllnessClick} 
        size="lg"
        className="group rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 shadow-md hover:shadow-lg transition-all duration-200 border border-violet-400/20"
      >
        <Stethoscope className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
        {t('advancedIllnessTitle')}
      </Button>
      
      <Button 
        onClick={onPreferencesClick} 
        size="lg"
        className="group rounded-xl bg-gradient-to-r from-fuchsia-500 to-pink-600 hover:from-fuchsia-600 hover:to-pink-700 shadow-md hover:shadow-lg transition-all duration-200 border border-fuchsia-400/20"
      >
        <Leaf className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
        {t('preferences')}
      </Button>
      
      <Button 
        onClick={navigateToTrustedPersons} 
        size="lg"
        className="group rounded-xl bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 shadow-md hover:shadow-lg transition-all duration-200 border border-purple-400/20"
      >
        <Users className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
        {t('trustedPerson')}
      </Button>
      
      <Button 
        onClick={() => navigate("/examples")} 
        size="lg"
        className="group rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 shadow-md hover:shadow-lg transition-all duration-200 border border-indigo-400/20"
      >
        <Book className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
        {t('phrasesTitle')}
      </Button>
      
      <Button 
        onClick={() => navigate("/free-text")} 
        size="lg"
        className="md:col-span-2 group rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-purple-400/20"
      >
        <FileText className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
        {t('summary')}
      </Button>
    </div>
  );
}
