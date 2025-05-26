
import { useState, useEffect } from "react";
import { useDossierStore } from "@/store/dossierStore";
import { Document } from "@/types/documents";
import { toast } from "@/hooks/use-toast";

export const useDossierDocuments = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddOptions, setShowAddOptions] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<Document | null>(null);
  const { dossierActif } = useDossierStore();

  useEffect(() => {
    const loadDocuments = () => {
      console.log("useDossierDocuments - Chargement des documents...");
      console.log("Dossier actif:", dossierActif);
      
      if (dossierActif?.contenu?.documents && Array.isArray(dossierActif.contenu.documents)) {
        console.log("Documents du dossier:", dossierActif.contenu.documents);
        
        // Transform documents to match the Document interface
        const transformedDocuments: Document[] = dossierActif.contenu.documents.map((doc: any, index: number) => {
          const transformedDoc = {
            id: doc.id || `doc-${index}`,
            file_name: doc.file_name || doc.fileName || `Document ${index + 1}`,
            file_path: doc.file_path || doc.filePath || '',
            file_type: doc.file_type || doc.fileType || 'pdf',
            content_type: doc.content_type || doc.contentType,
            user_id: doc.user_id || doc.userId || '',
            created_at: doc.created_at || doc.createdAt || new Date().toISOString(),
            description: doc.description,
            content: doc.content,
            file_size: doc.file_size || doc.fileSize,
            updated_at: doc.updated_at || doc.updatedAt,
            external_id: doc.external_id || doc.externalId
          };
          
          console.log("Document transformé:", transformedDoc);
          return transformedDoc;
        });
        
        setDocuments(transformedDocuments);
        console.log("Documents transformés:", transformedDocuments);
      } else {
        console.log("Aucun document dans le dossier actif ou structure invalide");
        setDocuments([]);
      }
      setIsLoading(false);
    };

    loadDocuments();
  }, [dossierActif]);

  // Handlers pour maintenir la compatibilité avec useDirectivesDocuments
  const handleUploadComplete = () => {
    // Pour les dossiers institution, on ne peut pas uploader
    console.log("Upload non disponible pour les dossiers institution");
    toast({
      title: "Information",
      description: "L'ajout de documents n'est pas disponible en mode consultation",
      variant: "default"
    });
  };

  const handleDownload = (filePath: string, fileName: string) => {
    try {
      console.log("useDossierDocuments - handleDownload:", filePath, fileName);
      
      const link = document.createElement('a');
      link.href = filePath;
      link.download = fileName;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Téléchargement commencé",
        description: `${fileName} est en cours de téléchargement`,
      });
    } catch (error) {
      console.error("Erreur lors du téléchargement:", error);
      toast({
        title: "Erreur",
        description: "Impossible de télécharger le document",
        variant: "destructive"
      });
    }
  };

  const handlePrint = (filePath: string, fileType?: string) => {
    console.log("useDossierDocuments - handlePrint:", filePath, fileType);
    
    const printWindow = window.open(filePath, '_blank');
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.print();
      };
    } else {
      toast({
        title: "Erreur",
        description: "Impossible d'ouvrir la fenêtre d'impression. Vérifiez que les popups sont autorisés.",
        variant: "destructive"
      });
    }
  };

  const handleView = (filePath: string, fileType?: string) => {
    console.log("useDossierDocuments - handleView:", filePath, fileType);
    
    // Pour les PDFs et autres documents, ouvrir dans un nouvel onglet
    window.open(filePath, '_blank');
  };

  const handleDelete = async (documentId: string) => {
    // Pour les dossiers institution, on ne peut pas supprimer
    console.log("Suppression non disponible pour les dossiers institution");
    toast({
      title: "Information",
      description: "La suppression de documents n'est pas disponible en mode consultation",
      variant: "default"
    });
  };

  return {
    user: null, // Pas d'utilisateur spécifique pour les dossiers
    isAuthenticated: false, // Mode consultation
    documents,
    isLoading,
    showAddOptions,
    setShowAddOptions,
    documentToDelete,
    setDocumentToDelete,
    handleDownload,
    handlePrint,
    handleView,
    handleDelete,
    handleUploadComplete
  };
};
