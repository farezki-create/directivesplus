
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";
import { useLanguage, type SupportedLanguage } from "@/hooks/useLanguage";

export const LanguageSelector = () => {
  const { currentLanguage, setLanguage, t } = useLanguage();

  const languages: { code: SupportedLanguage; label: string }[] = [
    { code: 'fr', label: t('french') },
    { code: 'en', label: t('english') },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          className="text-sm px-3 py-1.5 rounded-md bg-white border border-purple-300 text-purple-700 hover:bg-purple-50 transition-all duration-200 shadow-sm flex items-center gap-2"
        >
          <Globe className="h-3 w-3" />
          <span>{t('language')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={currentLanguage === lang.code ? "bg-muted" : ""}
          >
            {lang.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
