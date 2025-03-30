
import { supabase } from "@/integrations/supabase/client";
import { PDFDocumentGenerator } from "@/components/pdf/PDFDocumentGenerator";
import { UserProfile, TrustedPerson } from "@/components/pdf/types";
import { toast } from "@/hooks/use-toast";

/**
 * Interface pour les services de stockage cloud
 */
export interface CloudStorageProvider {
  /**
   * Télécharge un fichier vers le stockage cloud
   * @param fileData - Le contenu du fichier en format base64 ou blob
   * @param fileName - Le nom du fichier
   * @param metadata - Métadonnées associées au fichier
   * @returns Un identifiant unique du document stocké
   */
  uploadFile(fileData: string | Blob, fileName: string, metadata?: any): Promise<string | null>;
  
  /**
   * Récupère un fichier depuis le stockage cloud
   * @param documentId - L'identifiant unique du document
   * @returns L'URL ou le contenu du fichier récupéré
   */
  retrieveFile(documentId: string): Promise<string | null>;
}

/**
 * Implémentation de Supabase comme fournisseur de stockage cloud
 */
export class SupabaseStorageProvider implements CloudStorageProvider {
  async uploadFile(fileData: string | Blob, fileName: string, metadata?: any): Promise<string | null> {
    try {
      // Convertir en blob si nécessaire
      let blob: Blob;
      if (typeof fileData === 'string') {
        const response = await fetch(fileData);
        blob = await response.blob();
      } else {
        blob = fileData;
      }
      
      // Chemin de stockage
      const filePath = `external_storage/${fileName}`;
      
      // Upload vers Supabase Storage
      const { data, error } = await supabase
        .storage
        .from('directives_pdfs')
        .upload(filePath, blob, {
          contentType: 'application/pdf',
          upsert: false
        });
          
      if (error) {
        console.error("[SupabaseStorageProvider] Error uploading file:", error);
        throw error;
      }
      
      // Retourner l'identifiant du document
      return fileName.replace(".pdf", "");
    } catch (error) {
      console.error("[SupabaseStorageProvider] Upload error:", error);
      return null;
    }
  }
  
  async retrieveFile(documentId: string): Promise<string | null> {
    try {
      // Rechercher le document dans la base de données
      const { data, error } = await supabase
        .from('pdf_documents')
        .select('*')
        .ilike('file_name', `%${documentId}%`)
        .single();
          
      if (error || !data) {
        console.error("[SupabaseStorageProvider] Error finding document:", error);
        throw new Error("Document non trouvé");
      }
      
      // Récupérer le fichier depuis le stockage
      const { data: fileData, error: fileError } = await supabase
        .storage
        .from('directives_pdfs')
        .download(data.file_path);
          
      if (fileError || !fileData) {
        console.error("[SupabaseStorageProvider] Error downloading file:", fileError);
        throw new Error("Impossible de télécharger le fichier");
      }
      
      // Convertir en URL pour l'affichage
      return URL.createObjectURL(fileData);
    } catch (error) {
      console.error("[SupabaseStorageProvider] Retrieval error:", error);
      return null;
    }
  }
}

/**
 * Service responsable de la fonctionnalité principale de génération de PDF
 */
export class PDFGenerationService {
  // Instance du fournisseur de stockage actuel
  private static storageProvider: CloudStorageProvider = new SupabaseStorageProvider();
  
  /**
   * Définit le fournisseur de stockage cloud à utiliser
   * @param provider - Le fournisseur de stockage à utiliser
   */
  static setStorageProvider(provider: CloudStorageProvider): void {
    this.storageProvider = provider;
  }
  
  /**
   * Renvoie le fournisseur de stockage cloud actuel
   * @returns Le fournisseur de stockage actuel
   */
  static getStorageProvider(): CloudStorageProvider {
    return this.storageProvider;
  }

  /**
   * Génère un document PDF avec les données fournies
   * @param userId - L'ID de l'utilisateur
   * @param profile - Les informations du profil de l'utilisateur
   * @param responses - Les réponses au questionnaire
   * @param trustedPersons - Les personnes de confiance
   * @param synthesisText - Substitution facultative du texte de synthèse
   * @returns Le PDF généré sous forme d'URL de données
   */
  static async generatePDF(
    userId: string,
    profile: UserProfile,
    responses: any,
    trustedPersons: TrustedPerson[],
    synthesisText?: string
  ): Promise<string | null> {
    try {
      console.log("[PDFGenerationService] Generating PDF");
      
      if (!userId) {
        console.error("[PDFGenerationService] No user ID provided");
        throw new Error("User ID is required");
      }

      // Get user email from auth session if not provided in the profile
      if (!profile.email) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          profile.email = session.user.email;
        }
      }

      // Ensure unique_identifier is set
      if (!profile.unique_identifier) {
        profile.unique_identifier = userId;
      }

      // Use the passed text parameter if provided, otherwise use the synthesis text from database
      const finalSynthesisText = synthesisText || responses.synthesis?.free_text || "";

      // Generate PDF with all responses
      const pdfDataUrl = await PDFDocumentGenerator.generate(
        {
          ...profile,
          unique_identifier: userId,
          email: profile.email
        },
        {
          ...responses,
          synthesis: { free_text: finalSynthesisText }
        },
        trustedPersons || []
      );
      
      console.log("[PDFGenerationService] PDF generated successfully");
      return pdfDataUrl;
    } catch (error) {
      console.error("[PDFGenerationService] Error generating PDF:", error);
      throw error;
    }
  }

  /**
   * Télécharge un PDF vers le stockage cloud
   * @param pdfDataUrl - L'URL des données du PDF
   * @param userId - L'ID de l'utilisateur
   * @param profile - Les informations du profil
   * @returns L'identifiant externe du document
   */
  static async uploadToCloud(
    pdfDataUrl: string, 
    userId: string, 
    profile: any
  ): Promise<string | null> {
    try {
      // Générer un identifiant unique basé sur les détails de l'utilisateur
      const firstName = profile.first_name || 'unknown';
      const lastName = profile.last_name || 'unknown';
      const birthDate = profile.birth_date 
        ? new Date(profile.birth_date).toISOString().split('T')[0]
        : 'unknown';
      const timestamp = new Date().toISOString().replace(/[-:.]/g, '').substring(0, 14);
      
      // Créer un ID externe unique 
      const externalId = `${lastName}_${firstName}_${birthDate}_${timestamp}`;
      const sanitizedExternalId = externalId.replace(/[^a-zA-Z0-9_-]/g, '_');
      const fileName = `${sanitizedExternalId}.pdf`;
      
      // Télécharger via le fournisseur de stockage configuré
      const documentId = await this.storageProvider.uploadFile(
        pdfDataUrl,
        fileName,
        {
          userId,
          profileName: `${firstName} ${lastName}`,
          documentType: 'directives_anticipees'
        }
      );
      
      return documentId;
    } catch (error) {
      console.error("[PDFGenerationService] Cloud upload error:", error);
      return null;
    }
  }
  
  /**
   * Récupère un PDF depuis le stockage cloud
   * @param documentId - L'identifiant externe du document
   * @returns L'URL du PDF récupéré
   */
  static async retrieveFromCloud(documentId: string): Promise<string | null> {
    try {
      return await this.storageProvider.retrieveFile(documentId);
    } catch (error) {
      console.error("[PDFGenerationService] Cloud retrieval error:", error);
      return null;
    }
  }

  /**
   * Imprime le document PDF dans une nouvelle fenêtre
   * @param pdfUrl - L'URL des données du PDF
   */
  static handlePrint(pdfUrl: string | null): void {
    if (pdfUrl) {
      const printWindow = window.open(pdfUrl);
      printWindow?.print();
    } else {
      toast({
        title: "Erreur",
        description: "Aucun document PDF à imprimer.",
        variant: "destructive",
      });
    }
  }
}
