
import { useState, useEffect } from "react";
import { useQuestionnairesResponses } from "@/hooks/useQuestionnairesResponses";
import { usePDFData } from "./pdf/usePDFData";
import { handlePDFGeneration, handlePDFDownload, savePDFToStorage } from "./pdf/utils/PDFGenerationUtils";
import { Button } from "@/components/ui/button";
import { FileText, Lock } from "lucide-react";
import { PDFPreviewDialog } from "./pdf/PDFPreviewDialog";
import { toast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { DocumentRetriever } from "./pdf/DocumentRetriever";

interface PDFGeneratorProps {
  userId: string;
  onPdfGenerated?: (url: string | null) => void;
  synthesisText?: string;
}

/**
 * @protected
 * CCOMPOSANT PROTÉGÉ - NE PAS MODIFIER LA MÉTHODE DE GÉNÉRATION PDF
 * Protected component - do not modify the PDF generation method
 * Version: 1.0.0
 */
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

export function PDFGenerator({ userId, onPdfGenerated, synthesisText }: PDFGeneratorProps) {
  console.log("[PDFGenerator] Initializing with userId:", userId);
  console.log("[PDFGenerator] Synthesis text provided:", synthesisText ? "Yes" : "No");
  
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [externalDocumentId, setExternalDocumentId] = useState<string | null>(null);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const { responses, synthesis, isLoading } = useQuestionnairesResponses(userId);
  const { profile, trustedPersons, loading } = usePDFData();

  useEffect(() => {
    if (isGenerating) {
      // Message rotation interval
      const messageInterval = setInterval(() => {
        setCurrentMessageIndex((prev) => (prev + 1) % waitingMessages.length);
      }, 2000);

      // Progress bar animation
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          // Slow down as we approach 100%
          if (prev >= 90) {
            return Math.min(prev + 0.5, 95);
          }
          return Math.min(prev + 5, 90);
        });
      }, 500);

      return () => {
        clearInterval(messageInterval);
        clearInterval(progressInterval);
      };
    } else {
      // Reset progress when not generating
      setProgress(0);
    }
  }, [isGenerating]);

  console.log("[PDFGenerator] Current state:", {
    hasProfile: !!profile,
    hasTrustedPersons: trustedPersons.length,
    hasResponses: !!responses,
    isLoading: loading || isLoading,
    synthesisText: synthesisText ? "Provided" : "Not provided",
    dbSynthesis: synthesis?.free_text ? "Available" : "Not available"
  });

  const generatePDF = () => {
    console.log("[PDFGenerator] Button clicked - Starting PDF generation");
    setIsGenerating(true);
    setProgress(10); // Start with some progress
    
    if (!profile) {
      console.error("[PDFGenerator] No profile data available");
      toast({
        title: "Erreur",
        description: "Données de profil non disponibles. Veuillez compléter votre profil.",
        variant: "destructive",
      });
      setIsGenerating(false);
      return;
    }

    try {
      console.log("[PDFGenerator] Generating full PDF");
      
      // Use provided synthesis text if available, otherwise fallback to database
      const finalSynthesisText = synthesisText || synthesis?.free_text || "";
      console.log("[PDFGenerator] Using synthesis text, length:", finalSynthesisText.length);
      
      // Small delay to ensure UI updates before heavy PDF generation starts
      setTimeout(() => {
        handlePDFGeneration(
          profile,
          {
            ...responses,
            synthesis: { free_text: finalSynthesisText }
          },
          trustedPersons,
          async (url) => {
            console.log("[PDFGenerator] PDF generated, URL status:", url ? "success" : "failed");
            
            // Set progress to complete
            setProgress(100);
            
            // Store the PDF URL in localStorage as a backup
            if (url) {
              try {
                localStorage.setItem(`pdf_${userId}`, url);
                console.log("[PDFGenerator] PDF URL saved to localStorage");
                
                // Save to external storage and get the identifier
                try {
                  const response = await fetch(url);
                  const blob = await response.blob();
                  
                  // Generate external ID based on profile info
                  const firstName = profile.first_name || 'unknown';
                  const lastName = profile.last_name || 'unknown';
                  const birthDate = profile.birth_date ? new Date(profile.birth_date).toISOString().split('T')[0] : 'unknown';
                  const timestamp = new Date().toISOString().replace(/[-:.]/g, '').substring(0, 14);
                  
                  const externalId = `${lastName}_${firstName}_${birthDate}_${timestamp}`;
                  const sanitizedExternalId = externalId.replace(/[^a-zA-Z0-9_-]/g, '_');
                  
                  // Save external ID for display
                  setExternalDocumentId(sanitizedExternalId);
                  
                  // Upload to storage
                  const filePath = `external_storage/${sanitizedExternalId}.pdf`;
                  const { error } = await supabase
                    .storage
                    .from('directives_pdfs')
                    .upload(filePath, blob, {
                      contentType: 'application/pdf',
                      upsert: false
                    });
                    
                  if (error) {
                    console.error("[PDFGenerator] Error uploading to external storage:", error);
                  } else {
                    // Save reference to database
                    const { error: dbError } = await supabase
                      .from('pdf_documents')
                      .insert({
                        user_id: userId,
                        file_name: `${sanitizedExternalId}.pdf`,
                        file_path: filePath,
                        content_type: 'application/pdf',
                        description: `Directives anticipées de ${firstName} ${lastName}`
                      });
                      
                    if (dbError) {
                      console.error("[PDFGenerator] Error saving reference to database:", dbError);
                    }
                  }
                } catch (storageError) {
                  console.error("[PDFGenerator] Error saving to external storage:", storageError);
                }
              } catch (e) {
                console.warn("[PDFGenerator] Could not save PDF to localStorage:", e);
              }
            }
            
            // Short delay to show 100% before hiding the loading screen
            setTimeout(() => {
              setPdfUrl(url);
              if (onPdfGenerated) {
                onPdfGenerated(url);
              }
              setIsGenerating(false);
            }, 500);
          },
          setShowPreview
        );
      }, 500);
    } catch (error) {
      console.error("[PDFGenerator] Error during PDF generation:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la génération du PDF.",
        variant: "destructive",
      });
      setIsGenerating(false);
    }
  };

  if (loading || isLoading) {
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
            <Progress value={progress} className="h-2 w-full" />
            <p className="text-lg font-medium text-foreground animate-pulse">
              {waitingMessages[currentMessageIndex]}
            </p>
          </div>
        </div>
      )}
      
      <div className="space-y-6">
        <Button 
          onClick={generatePDF}
          className="flex items-center gap-2"
          disabled={isGenerating}
        >
          <FileText className="h-4 w-4" />
          <Lock className="h-3 w-3" />
          Générer Mes directives anticipées
        </Button>
        
        <DocumentRetriever userId={userId} />
      </div>
      
      {showPreview && (
        <PDFPreviewDialog
          key={pdfUrl}
          open={showPreview}
          onOpenChange={(open) => {
            console.log("[PDFGenerator] Dialog state changing to:", open);
            setShowPreview(open);
          }}
          pdfUrl={pdfUrl}
          onSave={() => handlePDFDownload(pdfUrl)}
          externalDocumentId={externalDocumentId}
        />
      )}
    </>
  );
}
