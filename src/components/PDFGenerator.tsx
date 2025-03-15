
import { useState, useEffect } from "react";
import { useQuestionnairesResponses } from "@/hooks/useQuestionnairesResponses";
import { usePDFData } from "./pdf/usePDFData";
import { handlePDFGeneration, handlePDFDownload } from "./pdf/utils/PDFGenerationUtils";
import { Button } from "@/components/ui/button";
import { FileText, RefreshCw, FileText as FileTextIcon, AlignLeft } from "lucide-react";
import { PDFPreviewDialog } from "./pdf/PDFPreviewDialog";
import { toast } from "@/hooks/use-toast";

interface PDFGeneratorProps {
  userId: string;
  onPdfGenerated?: (url: string | null) => void;
}

const waitingMessages = [
  "Préparation de votre document avec soin... 📝",
  "Mise en page de vos directives... 📄",
  "Ajout d'une touche de professionnalisme... ✨",
  "Finalisation des derniers détails... 🎯",
  "Vérification de la mise en forme... 🔍",
  "Assemblage de vos informations... 📋",
  "Plus que quelques secondes... ⏳",
  "Votre document est presque prêt... 🌟",
];

export function PDFGenerator({ userId, onPdfGenerated }: PDFGeneratorProps) {
  console.log("[PDFGenerator] Initializing with userId:", userId);
  
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [textContent, setTextContent] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationFailed, setGenerationFailed] = useState(false);
  const { responses, synthesis } = useQuestionnairesResponses(userId);
  const { profile, trustedPersons, loading } = usePDFData();

  // Check if we have a cached PDF in localStorage
  useEffect(() => {
    if (userId && !pdfUrl) {
      try {
        const cachedPdf = localStorage.getItem(`pdf_${userId}`);
        if (cachedPdf && (cachedPdf.startsWith('data:') || cachedPdf.startsWith('http'))) {
          console.log("[PDFGenerator] Found cached PDF in localStorage");
          setPdfUrl(cachedPdf);
        }
      } catch (e) {
        console.warn("[PDFGenerator] Could not read from localStorage:", e);
      }
    }
  }, [userId, pdfUrl]);

  useEffect(() => {
    if (isGenerating) {
      const interval = setInterval(() => {
        setCurrentMessageIndex((prev) => (prev + 1) % waitingMessages.length);
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [isGenerating]);

  console.log("[PDFGenerator] Current state:", {
    hasProfile: !!profile,
    hasTrustedPersons: trustedPersons.length,
    hasResponses: !!responses,
    isLoading: loading
  });

  const generatePDF = () => {
    console.log("[PDFGenerator] Button clicked - Starting PDF generation");
    setIsGenerating(true);
    setGenerationFailed(false);
    setTextContent(null);
    
    if (!profile) {
      console.error("[PDFGenerator] No profile data available");
      toast({
        title: "Erreur",
        description: "Données de profil non disponibles. Veuillez compléter votre profil.",
        variant: "destructive",
      });
      setIsGenerating(false);
      setGenerationFailed(true);
      return;
    }

    try {
      console.log("[PDFGenerator] Generating full PDF");
      handlePDFGeneration(
        profile,
        responses,
        trustedPersons,
        (url) => {
          console.log("[PDFGenerator] PDF generated, URL status:", url ? "success" : "failed");
          
          // Display detailed error if no URL was returned
          if (!url) {
            setGenerationFailed(true);
            toast({
              title: "Erreur",
              description: "Impossible de générer le PDF. Veuillez vérifier votre connexion internet.",
              variant: "destructive",
            });
          }
          
          setPdfUrl(url);
          if (onPdfGenerated) {
            onPdfGenerated(url);
          }
          setIsGenerating(false);
        },
        setShowPreview
      );
    } catch (error) {
      console.error("[PDFGenerator] Error during PDF generation:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la génération du PDF.",
        variant: "destructive",
      });
      setIsGenerating(false);
      setGenerationFailed(true);
    }
  };

  const generateTextDocument = () => {
    console.log("[PDFGenerator] Generating text document");
    setIsGenerating(true);
    setGenerationFailed(false);
    setPdfUrl(null);
    
    try {
      // Start building the text document
      let textDoc = "";
      
      // Add header with date
      const date = new Date();
      const dateStr = date.toLocaleDateString('fr-FR');
      textDoc += `DIRECTIVES ANTICIPÉES\nDocument établi le ${dateStr}\n\n`;
      
      // Add profile information
      if (profile) {
        textDoc += `INFORMATIONS PERSONNELLES\n`;
        textDoc += `Prénom: ${profile.first_name || 'Non renseigné'}\n`;
        textDoc += `Nom: ${profile.last_name || 'Non renseigné'}\n`;
        textDoc += `Date de naissance: ${profile.birth_date || 'Non renseignée'}\n`;
        textDoc += `Adresse: ${profile.address || 'Non renseignée'}\n`;
        if (profile.postal_code) textDoc += `Code postal: ${profile.postal_code}\n`;
        if (profile.city) textDoc += `Ville: ${profile.city}\n`;
        textDoc += `\n`;
      }
      
      // Add responses by category
      if (responses.general && responses.general.length > 0) {
        textDoc += `OPINION GÉNÉRALE\n`;
        responses.general.forEach(item => {
          textDoc += `- Question: ${item.question_text}\n`;
          textDoc += `  Réponse: ${item.response}\n`;
        });
        textDoc += `\n`;
      }
      
      if (responses.lifeSupport && responses.lifeSupport.length > 0) {
        textDoc += `MAINTIEN ARTIFICIEL DE LA VIE\n`;
        responses.lifeSupport.forEach(item => {
          textDoc += `- Question: ${item.question_text}\n`;
          textDoc += `  Réponse: ${item.response}\n`;
        });
        textDoc += `\n`;
      }
      
      if (responses.advancedIllness && responses.advancedIllness.length > 0) {
        textDoc += `MALADIE GRAVE\n`;
        responses.advancedIllness.forEach(item => {
          textDoc += `- Question: ${item.question_text}\n`;
          textDoc += `  Réponse: ${item.response}\n`;
        });
        textDoc += `\n`;
      }
      
      if (responses.preferences && responses.preferences.length > 0) {
        textDoc += `PRÉFÉRENCES\n`;
        responses.preferences.forEach(item => {
          textDoc += `- Question: ${item.question_text}\n`;
          textDoc += `  Réponse: ${item.response}\n`;
        });
        textDoc += `\n`;
      }
      
      // Add synthesis if available
      if (synthesis && synthesis.free_text) {
        textDoc += `SYNTHÈSE\n${synthesis.free_text}\n\n`;
      }
      
      // Add trusted persons if available
      if (trustedPersons && trustedPersons.length > 0) {
        textDoc += `PERSONNES DE CONFIANCE\n`;
        trustedPersons.forEach((person, index) => {
          textDoc += `Personne de confiance ${index + 1}:\n`;
          textDoc += `Nom: ${person.name}\n`;
          if (person.relation) textDoc += `Relation: ${person.relation}\n`;
          if (person.phone) textDoc += `Téléphone: ${person.phone}\n`;
          if (person.email) textDoc += `Email: ${person.email}\n`;
          if (person.address) textDoc += `Adresse: ${person.address}\n`;
          if (person.city) textDoc += `Ville: ${person.city}\n`;
          if (person.postal_code) textDoc += `Code postal: ${person.postal_code}\n`;
          textDoc += `\n`;
        });
      }
      
      // Add signature placeholder
      textDoc += `SIGNATURE\n`;
      textDoc += `Date: ${dateStr}\n`;
      textDoc += `Signature: ________________________________\n`;
      
      // Store the text content
      setTextContent(textDoc);
      
      // Show preview
      setShowPreview(true);
      
      // Success notification
      toast({
        title: "Succès",
        description: "Le document texte a été généré avec succès.",
      });
      
    } catch (error) {
      console.error("[PDFGenerator] Error generating text document:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la génération du document texte.",
        variant: "destructive",
      });
      setGenerationFailed(true);
    } finally {
      setIsGenerating(false);
    }
  };

  if (loading) {
    console.log("[PDFGenerator] Still loading data...");
    return null;
  }

  console.log("[PDFGenerator] Rendering buttons");
  return (
    <>
      {isGenerating && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="max-w-sm p-6 text-center space-y-4 animate-fade-in">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-lg font-medium text-foreground animate-pulse">
              {waitingMessages[currentMessageIndex]}
            </p>
          </div>
        </div>
      )}
      
      <div className="flex flex-wrap gap-4">
        <Button 
          onClick={generatePDF}
          className="flex items-center gap-2"
          disabled={isGenerating}
        >
          {generationFailed ? (
            <>
              <RefreshCw className="h-4 w-4" />
              Réessayer la génération
            </>
          ) : (
            <>
              <FileTextIcon className="h-4 w-4" />
              Générer en PDF
            </>
          )}
        </Button>
        
        <Button 
          onClick={generateTextDocument}
          className="flex items-center gap-2"
          disabled={isGenerating}
          variant="outline"
        >
          <AlignLeft className="h-4 w-4" />
          Générer en texte simple
        </Button>
      </div>
      
      {showPreview && (
        <PDFPreviewDialog
          key={`document-preview-${Date.now()}`}
          open={showPreview}
          onOpenChange={(open) => {
            console.log("[PDFGenerator] Dialog state changing to:", open);
            setShowPreview(open);
          }}
          pdfUrl={pdfUrl}
          textContent={textContent}
          onSave={() => handlePDFDownload(pdfUrl)}
        />
      )}
    </>
  );
}
