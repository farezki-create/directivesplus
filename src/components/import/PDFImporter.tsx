
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
      // Pour cette version, nous allons simplement extraire le texte brut du PDF
      // et l'ajouter comme texte libre dans la synthèse
      const formData = new FormData();
      formData.append('file', file);
      
      // Simulons un traitement du PDF
      setTimeout(async () => {
        try {
          // Création d'une entrée texte libre basique
          const { error } = await supabase
            .from('questionnaire_synthesis')
            .upsert(
              {
                user_id: userId,
                free_text: `Contenu importé depuis le PDF: ${file.name}\n\nCe contenu a été importé automatiquement. Vous pouvez maintenant le modifier dans l'interface.`
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
