
import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PDFDocumentGenerator } from "@/components/pdf/PDFDocumentGenerator";
import { useQuestionnairesResponses } from "@/hooks/useQuestionnairesResponses";
import { useSynthesis } from "@/hooks/useSynthesis";
import { format } from "date-fns";

export function usePDFGeneration(userId: string | null, text?: string) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [externalDocumentId, setExternalDocumentId] = useState<string | null>(null);
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

      // Save to external storage
      if (pdfDataUrl && profile) {
        await saveToExternalStorage(pdfDataUrl, profile);
      }

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

  const saveToExternalStorage = async (pdfDataUrl: string, profile: any) => {
    try {
      console.log("[PDFGeneration] Saving PDF to external storage");

      // Convert data URL to blob
      const response = await fetch(pdfDataUrl);
      const blob = await response.blob();

      // Generate a unique identifier based on user details
      const firstName = profile.first_name || 'unknown';
      const lastName = profile.last_name || 'unknown';
      const birthDate = profile.birth_date ? format(new Date(profile.birth_date), 'yyyy-MM-dd') : 'unknown';
      const timestamp = format(new Date(), 'yyyyMMdd_HHmmss');
      
      // Create a unique external ID 
      const externalId = `${lastName}_${firstName}_${birthDate}_${timestamp}`;
      const sanitizedExternalId = externalId.replace(/[^a-zA-Z0-9_-]/g, '_');
      
      // File path in storage
      const filePath = `external_storage/${sanitizedExternalId}.pdf`;
      
      // Upload to Supabase Storage
      const { data, error } = await supabase
        .storage
        .from('directives_pdfs')
        .upload(filePath, blob, {
          contentType: 'application/pdf',
          upsert: false
        });
        
      if (error) {
        console.error("[PDFGeneration] Error uploading to external storage:", error);
        throw error;
      }
      
      console.log("[PDFGeneration] PDF saved to external storage:", data);

      // Save reference in database for retrieval
      const { error: dbError } = await supabase
        .from('pdf_documents')
        .insert({
          user_id: userId,
          file_name: `${sanitizedExternalId}.pdf`,
          file_path: filePath,
          content_type: 'application/pdf',
          description: `Directives anticipées de ${firstName} ${lastName}`,
          created_at: new Date().toISOString()
        });
        
      if (dbError) {
        console.error("[PDFGeneration] Error saving reference to database:", dbError);
        throw dbError;
      }

      // Store the external ID for later reference
      setExternalDocumentId(sanitizedExternalId);
      
      toast({
        title: "Stockage externe réussi",
        description: `Document sauvegardé avec l'identifiant: ${sanitizedExternalId}`,
      });
      
      return sanitizedExternalId;
    } catch (error) {
      console.error("[PDFGeneration] Error in external storage:", error);
      toast({
        title: "Erreur de stockage",
        description: "Impossible de sauvegarder le document dans le stockage externe.",
        variant: "destructive",
      });
      return null;
    }
  };

  const retrieveExternalDocument = useCallback(async (externalId: string) => {
    try {
      console.log("[PDFGeneration] Retrieving external document:", externalId);
      
      // Find the document in the database
      const { data, error } = await supabase
        .from('pdf_documents')
        .select('*')
        .ilike('file_name', `%${externalId}%`)
        .single();
        
      if (error || !data) {
        console.error("[PDFGeneration] Error finding document:", error);
        throw new Error("Document non trouvé");
      }
      
      // Get the file from storage
      const { data: fileData, error: fileError } = await supabase
        .storage
        .from('directives_pdfs')
        .download(data.file_path);
        
      if (fileError || !fileData) {
        console.error("[PDFGeneration] Error downloading file:", fileError);
        throw new Error("Impossible de télécharger le fichier");
      }
      
      // Convert to URL for display
      const url = URL.createObjectURL(fileData);
      setPdfUrl(url);
      setShowPreview(true);
      
      toast({
        title: "Document récupéré",
        description: "Le document a été récupéré avec succès.",
      });
      
      return url;
    } catch (error) {
      console.error("[PDFGeneration] Error retrieving document:", error);
      toast({
        title: "Erreur",
        description: "Impossible de récupérer le document.",
        variant: "destructive",
      });
      return null;
    }
  }, [toast]);

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

  return {
    pdfUrl,
    showPreview,
    setShowPreview,
    generatePDF,
    handlePrint,
    handleEmail,
    handleDownload,
    externalDocumentId,
    retrieveExternalDocument
  };
}
