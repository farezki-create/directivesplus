
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useLanguage } from "@/hooks/language/useLanguage";

interface ExportButtonProps {
  content: string;
  responses: {
    general: any[];
    lifeSupport: any[];
    advancedIllness: any[];
    preferences: any[];
    synthesis?: any;
  }
}

export const ExportButton = ({ content, responses }: ExportButtonProps) => {
  const { t } = useLanguage();

  const handleExport = () => {
    // Format the responses data
    const generalSection = responses.general?.length 
      ? `\n\n# ${t('generalOpinion')}\n${responses.general.map(r => `- ${r.question_text || ''}: ${r.response || ''}`).join('\n')}` 
      : '';
      
    const lifeSupportSection = responses.lifeSupport?.length
      ? `\n\n# ${t('lifeSupport')}\n${responses.lifeSupport.map(r => `- ${r.question_text || ''}: ${r.response || ''}`).join('\n')}`
      : '';
      
    const advancedIllnessSection = responses.advancedIllness?.length
      ? `\n\n# ${t('advancedIllnessTitle')}\n${responses.advancedIllness.map(r => `- ${r.question_text || ''}: ${r.response || ''}`).join('\n')}`
      : '';
      
    const preferencesSection = responses.preferences?.length
      ? `\n\n# ${t('preferences')}\n${responses.preferences.map(r => `- ${r.question_text || ''}: ${r.response || ''}`).join('\n')}`
      : '';

    // Get the free text synthesis
    const synthesisSection = responses.synthesis?.free_text 
      ? `\n\n# ${t('synthesis')}\n${responses.synthesis.free_text}`
      : '';

    // Create the content
    const fullText = 
      `# ${t('directivesTitle')}\n${t('generatedAt')}: ${new Date().toLocaleString()}${generalSection}${lifeSupportSection}${advancedIllnessSection}${preferencesSection}${synthesisSection}\n\n# ${t('freeTextOpinion')}\n${content}`;

    // Create and download the file
    const element = document.createElement('a');
    const file = new Blob([fullText], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${t('directives')}_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <Button 
      onClick={handleExport} 
      variant="outline" 
      className="flex items-center gap-2"
    >
      <Download className="w-4 h-4" />
      {t('exportText')}
    </Button>
  );
};
