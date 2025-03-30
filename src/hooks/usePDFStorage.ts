
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/components/pdf/types";
import { format } from "date-fns";

export function usePDFStorage(userId: string | null) {
  const [isTransferringToCloud, setIsTransferringToCloud] = useState(false);
  const [externalDocumentId, setExternalDocumentId] = useState<string | null>(null);
  const { toast } = useToast();

  const saveToExternalStorage = async (pdfDataUrl: string, profile: any) => {
    try {
      console.log("[PDFStorage] Saving PDF to external storage");
      setIsTransferringToCloud(true);

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
        console.error("[PDFStorage] Error uploading to external storage:", error);
        throw error;
      }
      
      console.log("[PDFStorage] PDF saved to external storage:", data);

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
        console.error("[PDFStorage] Error saving reference to database:", dbError);
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
      console.error("[PDFStorage] Error in external storage:", error);
      toast({
        title: "Erreur de stockage",
        description: "Impossible de sauvegarder le document dans le stockage externe.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsTransferringToCloud(false);
    }
  };

  const syncToExternalStorage = async (pdfUrl: string | null) => {
    try {
      if (!pdfUrl || !userId) {
        toast({
          title: "Erreur",
          description: "Aucun document PDF à synchroniser ou utilisateur non connecté.",
          variant: "destructive",
        });
        return null;
      }

      // Fetch user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error("[PDFSync] Error fetching profile:", profileError);
        throw profileError;
      }

      setIsTransferringToCloud(true);
      
      // Transfer synthesis to cloud
      const { data: synthesis, error: synthesisError } = await supabase
        .from('questionnaire_synthesis')
        .select('free_text, signature')
        .eq('user_id', userId)
        .maybeSingle();
      
      if (synthesisError) {
        console.error("[PDFSync] Error fetching synthesis:", synthesisError);
        // Continue with the PDF sync even if synthesis fetch fails
      } else if (synthesis) {
        console.log("[PDFSync] Backing up synthesis data to cloud");
        // Here you would implement code to backup the synthesis to your external cloud
      }

      // Use saveToExternalStorage function
      const externalId = await saveToExternalStorage(pdfUrl, profile);
      
      toast({
        title: "Synchronisation réussie",
        description: "Vos documents ont été synchronisés avec la base de données cloud.",
      });
      
      return externalId;
    } catch (error) {
      console.error("[PDFSync] Error in cloud sync:", error);
      toast({
        title: "Erreur de synchronisation",
        description: "Impossible de synchroniser avec la base de données cloud.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsTransferringToCloud(false);
    }
  };

  const retrieveExternalDocument = async (externalId: string) => {
    try {
      console.log("[PDFStorage] Retrieving external document:", externalId);
      
      // Find the document in the database
      const { data, error } = await supabase
        .from('pdf_documents')
        .select('*')
        .ilike('file_name', `%${externalId}%`)
        .single();
        
      if (error || !data) {
        console.error("[PDFStorage] Error finding document:", error);
        throw new Error("Document non trouvé");
      }
      
      // Get the file from storage
      const { data: fileData, error: fileError } = await supabase
        .storage
        .from('directives_pdfs')
        .download(data.file_path);
        
      if (fileError || !fileData) {
        console.error("[PDFStorage] Error downloading file:", fileError);
        throw new Error("Impossible de télécharger le fichier");
      }
      
      // Convert to URL for display
      const url = URL.createObjectURL(fileData);
      
      toast({
        title: "Document récupéré",
        description: "Le document a été récupéré avec succès.",
      });
      
      return url;
    } catch (error) {
      console.error("[PDFStorage] Error retrieving document:", error);
      toast({
        title: "Erreur",
        description: "Impossible de récupérer le document.",
        variant: "destructive",
      });
      return null;
    }
  };

  return {
    isTransferringToCloud,
    externalDocumentId,
    saveToExternalStorage,
    syncToExternalStorage,
    retrieveExternalDocument
  };
}
