
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { PDFPreviewDialog } from "../pdf/PDFPreviewDialog";
import { usePDFData } from "../pdf/usePDFData";
import { handlePDFGeneration, handlePDFDownload, savePDFToStorage } from "../pdf/utils/PDFGenerationUtils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function TrustedPersonPDFGenerator() {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const { profile, trustedPersons, loading } = usePDFData();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && profile) {
      generatePDF();
    }
  }, [loading, profile]);

  const generatePDF = () => {
    console.log("[TrustedPersonPDF] Starting PDF generation");
    handlePDFGeneration(
      profile,
      { type: "trusted_person" },
      trustedPersons,
      (url: string | null) => {
        if (url) {
          const cleanUrl = url.replace(/([^:])\/\/+/g, '$1/').replace(/:\//g, '://');
          console.log("[TrustedPersonPDF] Cleaned URL:", cleanUrl);
          setPdfUrl(cleanUrl);
        } else {
          setPdfUrl(null);
        }
      },
      setShowPreview
    );
  };

  const saveToSynthesis = async () => {
    try {
      console.log("[TrustedPersonPDF] Saving to synthesis");
      
      // Get current user
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour enregistrer la personne de confiance.",
          variant: "destructive",
        });
        return;
      }
      
      const userId = session.user.id;
      
      // Get current synthesis
      const { data: currentSynthesis, error: fetchError } = await supabase
        .from("questionnaire_synthesis")
        .select("free_text")
        .eq("user_id", userId)
        .maybeSingle();
        
      if (fetchError) {
        console.error("[TrustedPersonPDF] Error fetching synthesis:", fetchError);
        throw fetchError;
      }
      
      const currentText = currentSynthesis?.free_text || "";
      
      // Create trusted person text
      let trustedPersonText = "";
      if (trustedPersons.length > 0) {
        const person = trustedPersons[0];
        const separator = "\n\n-------------------------------------------\n";
        trustedPersonText = `${separator}PERSONNE DE CONFIANCE\n\nNom: ${person.name}\nTéléphone: ${person.phone}\nEmail: ${person.email}${person.relation ? `\nRelation: ${person.relation}` : ""}${person.address ? `\nAdresse: ${person.address}` : ""}${person.city || person.postal_code ? `\n${person.postal_code} ${person.city}` : ""}`;
      }
      
      // Check if we already have a trusted person section
      const hasTrustedPersonSection = currentText.includes("PERSONNE DE CONFIANCE");
      let updatedText = "";
      
      if (hasTrustedPersonSection) {
        // Replace existing trusted person section
        const parts = currentText.split("PERSONNE DE CONFIANCE");
        updatedText = parts[0] + (trustedPersonText ? trustedPersonText.replace("PERSONNE DE CONFIANCE", "") : "");
      } else {
        // Add new trusted person section
        updatedText = currentText + (trustedPersonText || "");
      }
      
      // Save to database
      const operation = currentSynthesis ? 
        supabase
          .from("questionnaire_synthesis")
          .update({ free_text: updatedText })
          .eq("user_id", userId) :
        supabase
          .from("questionnaire_synthesis")
          .insert({ user_id: userId, free_text: updatedText });
          
      const { error: saveError } = await operation;
      
      if (saveError) {
        console.error("[TrustedPersonPDF] Error saving to synthesis:", saveError);
        throw saveError;
      }
      
      toast({
        title: "Succès",
        description: "Les informations de la personne de confiance ont été enregistrées.",
      });
      
      if (pdfUrl) {
        handlePDFDownload(pdfUrl);
      }
    } catch (error) {
      console.error("[TrustedPersonPDF] Error saving to synthesis:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return null;
  }

  return (
    <>
      <Button 
        onClick={saveToSynthesis}
        className="flex items-center gap-2"
      >
        <Save className="h-4 w-4" />
        Enregistrer
      </Button>
      
      <PDFPreviewDialog
        open={showPreview}
        onOpenChange={setShowPreview}
        pdfUrl={pdfUrl}
        onSave={() => handlePDFDownload(pdfUrl)}
      />
    </>
  );
}
