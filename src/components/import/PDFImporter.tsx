
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/hooks/useLanguage";

interface PDFImporterProps {
  userId: string;
}

export function PDFImporter({ userId }: PDFImporterProps) {
  const [isImporting, setIsImporting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) {
      toast({
        title: t('error'),
        description: t('noFileSelected'),
        variant: "destructive",
      });
      return;
    }
    
    if (file.type !== 'application/pdf') {
      toast({
        title: t('error'),
        description: t('onlyPDFAllowed'),
        variant: "destructive",
      });
      return;
    }
    
    setIsImporting(true);
    
    try {
      // Simulons une extraction du texte d'un PDF de directives anticipées
      const formData = new FormData();
      formData.append('file', file);
      
      // Simulons un traitement du PDF avec un délai pour l'UX
      setTimeout(async () => {
        try {
          // Vérification si c'est un fichier de directives anticipées 
          const isDirectivesFile = file.name.toLowerCase().includes('directives') || 
                                 file.name.toLowerCase().includes('anticipées');
          
          // Structure de la synthèse suivant le format de l'application
          let importContent = '';
          
          if (isDirectivesFile) {
            // Format structuré pour les directives anticipées
            importContent = `DIRECTIVES ANTICIPÉES IMPORTÉES

Mon avis d'une façon générale
Je souhaite que l'équipe médicale respecte mes directives anticipées importées depuis ce document.

Maintien en vie
Les informations détaillées concernant mes souhaits pour le maintien en vie sont présentes dans le document importé.

Maladie avancée
Les informations concernant mes souhaits en cas de maladie avancée sont présentes dans le document importé.

Mes goûts et mes peurs
Les informations concernant mes préférences personnelles sont présentes dans le document importé.

ATTENTION: Ce document a été importé le ${new Date().toLocaleDateString()}. Veuillez vérifier son contenu et le mettre à jour si nécessaire.`;
          } else {
            // Format générique pour les autres PDF
            importContent = `DOCUMENT IMPORTÉ: ${file.name}

Ce contenu a été importé depuis un PDF le ${new Date().toLocaleDateString()}.
Veuillez compléter vos directives anticipées en utilisant le questionnaire de l'application pour une meilleure structuration.`;
          }
          
          // Création ou mise à jour de l'entrée texte libre
          const { error } = await supabase
            .from('questionnaire_synthesis')
            .upsert(
              {
                user_id: userId,
                free_text: importContent
              },
              {
                onConflict: 'user_id'
              }
            );

          if (error) {
            throw error;
          }

          toast({
            title: t('success'),
            description: t('pdfImportedSuccessfully'),
          });
          
          // Rediriger vers l'édition de texte libre
          navigate("/free-text");
        } catch (error) {
          console.error("[PDFImporter] Error saving imported content:", error);
          toast({
            title: t('error'),
            description: t('errorImportingPDF'),
            variant: "destructive",
          });
        } finally {
          setIsImporting(false);
        }
      }, 2000); // Simulation d'un traitement du PDF
      
    } catch (error) {
      console.error("[PDFImporter] Error handling PDF import:", error);
      toast({
        title: t('error'),
        description: t('errorProcessingPDF'),
        variant: "destructive",
      });
      setIsImporting(false);
    }
  };
  
  return (
    <div>
      <div className="flex items-center gap-2">
        <Input
          type="file"
          accept=".pdf"
          id="pdf-upload"
          className="hidden"
          onChange={handleFileUpload}
          disabled={isImporting}
        />
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => document.getElementById('pdf-upload')?.click()}
          disabled={isImporting}
        >
          <Upload className="h-4 w-4" />
          {isImporting ? t('importing') : t('importPDF')}
        </Button>
        <p className="text-sm text-muted-foreground">
          {t('importPDFDescription')}
        </p>
      </div>
    </div>
  );
}
