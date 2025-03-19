
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PDFDocumentGenerator } from "@/components/pdf/PDFDocumentGenerator";
import { useQuestionnairesResponses } from "@/hooks/useQuestionnairesResponses";
import { useSynthesis } from "@/hooks/useSynthesis";
import { handlePDFGeneration, savePDFToStorage } from "@/components/pdf/utils/PDFGenerationUtils";

export function usePDFGeneration(userId: string | null, text?: string) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isSavingToHDS, setIsSavingToHDS] = useState(false);
  const [hdsStorageSuccess, setHdsStorageSuccess] = useState(false);
  const { toast } = useToast();
  const { responses, synthesis } = useQuestionnairesResponses(userId || "");
  const { text: freeText } = useSynthesis(userId);

  const generatePDF = async () => {
    try {
      console.log("[PDFGeneration] Generating PDF");
      
      if (!userId) {
        console.error("[PDFGeneration] No user ID provided");
        throw new Error("User ID is required");
      }

      // Fetch user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error("[PDFGeneration] Error fetching profile:", profileError);
        throw profileError;
      }

      // Get user email from auth session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        throw new Error("No authenticated user");
      }

      // Fetch trusted persons
      const { data: trustedPersons, error: trustedPersonsError } = await supabase
        .from('trusted_persons')
        .select('*')
        .eq('user_id', userId);

      if (trustedPersonsError) {
        console.error("[PDFGeneration] Error fetching trusted persons:", trustedPersonsError);
        // Continue without trusted persons
      }

      // Use the passed text parameter if provided, otherwise use the synthesis text from database
      const synthesisText = text || freeText || synthesis?.free_text || "";

      // Generate PDF with all responses
      const pdfDataUrl = await PDFDocumentGenerator.generate(
        {
          ...profile,
          unique_identifier: userId,
          email: session.user.email
        },
        {
          ...responses,
          synthesis: { free_text: synthesisText }
        },
        trustedPersons || []
      );
      setPdfUrl(pdfDataUrl);
      setShowPreview(true);

      console.log("[PDFGeneration] PDF generated successfully");
      toast({
        title: "Succès",
        description: "Le PDF a été généré avec succès.",
      });
    } catch (error) {
      console.error("[PDFGeneration] Error generating PDF:", error);
      toast({
        title: "Erreur",
        description: "Impossible de générer le PDF.",
        variant: "destructive",
      });
    }
  };

  const handlePrint = () => {
    if (pdfUrl) {
      const printWindow = window.open(pdfUrl);
      printWindow?.print();
    }
  };

  const handleEmail = async () => {
    // Email handling logic here
  };

  const handleDownload = () => {
    if (pdfUrl) {
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = 'synthese-directives-anticipees.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const saveToHDS = async () => {
    if (!pdfUrl || !userId) {
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer le document à l'hébergeur HDS. PDF ou utilisateur non disponible.",
        variant: "destructive",
      });
      return false;
    }

    setIsSavingToHDS(true);
    setHdsStorageSuccess(false);
    
    try {
      // Préparer les métadonnées
      const metadata = {
        createdAt: new Date().toISOString(),
        documentType: "DIRECTIVES_ANTICIPEES",
        documentName: `directives_anticipees_${new Date().toISOString()}`,
      };

      console.log("[HDS] Envoi du document vers l'hébergeur HDS...");
      
      // Appeler l'edge function pour envoyer le PDF vers l'hébergeur HDS
      const { data, error } = await supabase.functions.invoke("send-to-hds", {
        body: {
          pdfData: pdfUrl,
          userId: userId,
          metadata: metadata
        }
      });

      if (error) {
        console.error("[HDS] Erreur lors de l'appel de la fonction:", error);
        throw new Error(error.message || "Échec de l'envoi vers l'hébergeur HDS");
      }

      console.log("[HDS] Réponse de la fonction:", data);
      
      if (!data.success) {
        throw new Error(data.error || "Échec de l'envoi vers l'hébergeur HDS");
      }

      setHdsStorageSuccess(true);
      
      toast({
        title: "Succès",
        description: "Le document a été envoyé avec succès à l'hébergeur HDS.",
      });

      return true;
    } catch (error: any) {
      console.error("[HDS] Erreur:", error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de l'envoi vers l'hébergeur HDS.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSavingToHDS(false);
    }
  };

  return {
    pdfUrl,
    showPreview,
    setShowPreview,
    generatePDF,
    handlePrint,
    handleEmail,
    handleDownload,
    saveToHDS,
    isSavingToHDS,
    hdsStorageSuccess
  };
}
