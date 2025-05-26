
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
      
      let foundDocuments: Document[] = [];
      
      if (dossierActif?.contenu) {
        console.log("Structure du contenu dossier:", dossierActif.contenu);
        
        // Vérifier s'il y a des documents dans le dossier
        if (dossierActif.contenu.documents && Array.isArray(dossierActif.contenu.documents)) {
          console.log("Documents trouvés dans dossierActif.contenu.documents:", dossierActif.contenu.documents);
          
          foundDocuments = dossierActif.contenu.documents.map((doc: any, index: number) => {
            const transformedDoc: Document = {
              id: doc.id || `doc-${index}`,
              file_name: doc.file_name || doc.fileName || `Document ${index + 1}`,
              file_path: doc.file_path || doc.filePath || '',
              file_type: doc.file_type || doc.fileType || doc.content_type || 'application/pdf',
              content_type: doc.content_type || doc.contentType || 'application/pdf',
              user_id: doc.user_id || doc.userId || dossierActif.userId || '',
              created_at: doc.created_at || doc.createdAt || new Date().toISOString(),
              description: doc.description,
              file_size: doc.file_size || doc.fileSize,
              updated_at: doc.updated_at || doc.updatedAt,
              external_id: doc.external_id || doc.externalId
            };
            
            console.log("Document transformé:", transformedDoc);
            return transformedDoc;
          });
        }
        
        // Vérifier s'il y a des directives avec documents intégrés
        else if (dossierActif.contenu.directives && Array.isArray(dossierActif.contenu.directives)) {
          console.log("Directives trouvées dans dossierActif.contenu.directives:", dossierActif.contenu.directives);
          
          foundDocuments = dossierActif.contenu.directives
            .filter((item: any) => item.type === 'document' || item.file_path || item.filePath)
            .map((item: any, index: number): Document => {
              const transformedDoc: Document = {
                id: item.id || `directive-doc-${index}`,
                file_name: item.file_name || item.fileName || `Document directive ${index + 1}`,
                file_path: item.file_path || item.filePath || '',
                file_type: item.file_type || item.fileType || item.content_type || 'application/pdf',
                content_type: item.content_type || item.contentType || 'application/pdf',
                user_id: item.user_id || item.userId || dossierActif.userId || '',
                created_at: item.created_at || item.createdAt || new Date().toISOString(),
                description: item.description,
                file_size: item.file_size || item.fileSize,
                updated_at: item.updated_at || item.updatedAt,
                external_id: item.external_id || item.externalId
              };
              
              console.log("Document directive transformé:", transformedDoc);
              return transformedDoc;
            });
        }
        
        // Vérifier d'autres structures possibles
        else if (dossierActif.contenu.pdf_documents && Array.isArray(dossierActif.contenu.pdf_documents)) {
          console.log("PDF documents trouvés dans dossierActif.contenu.pdf_documents:", dossierActif.contenu.pdf_documents);
          
          foundDocuments = dossierActif.contenu.pdf_documents.map((doc: any, index: number): Document => ({
            id: doc.id || `pdf-doc-${index}`,
            file_name: doc.file_name || doc.fileName || `Document PDF ${index + 1}`,
            file_path: doc.file_path || doc.filePath || '',
            file_type: doc.file_type || doc.fileType || 'application/pdf',
            content_type: doc.content_type || doc.contentType || 'application/pdf',
            user_id: doc.user_id || doc.userId || dossierActif.userId || '',
            created_at: doc.created_at || doc.createdAt || new Date().toISOString(),
            description: doc.description,
            file_size: doc.file_size || doc.fileSize,
            updated_at: doc.updated_at || doc.updatedAt,
            external_id: doc.external_id || doc.externalId
          }));
        }
        
        // Cas où le contenu lui-même pourrait être un document
        else if (dossierActif.contenu.file_path || dossierActif.contenu.filePath) {
          console.log("Document unique trouvé dans le contenu principal");
          
          foundDocuments = [{
            id: dossierActif.contenu.id || 'main-doc',
            file_name: dossierActif.contenu.file_name || dossierActif.contenu.fileName || 'Document principal',
            file_path: dossierActif.contenu.file_path || dossierActif.contenu.filePath,
            file_type: dossierActif.contenu.file_type || dossierActif.contenu.fileType || 'application/pdf',
            content_type: dossierActif.contenu.content_type || dossierActif.contenu.contentType || 'application/pdf',
            user_id: dossierActif.userId || '',
            created_at: dossierActif.contenu.created_at || dossierActif.contenu.createdAt || new Date().toISOString(),
            description: dossierActif.contenu.description,
            file_size: dossierActif.contenu.file_size || dossierActif.contenu.fileSize,
            updated_at: dossierActif.contenu.updated_at || dossierActif.contenu.updatedAt,
            external_id: dossierActif.contenu.external_id || dossierActif.contenu.externalId
          }];
        }
      }
      
      console.log("Documents finaux trouvés:", foundDocuments.length, foundDocuments);
      setDocuments(foundDocuments);
      
      if (foundDocuments.length === 0) {
        console.log("Aucun document trouvé - structure du dossier:", JSON.stringify(dossierActif, null, 2));
      }
      
      setIsLoading(false);
    };

    loadDocuments();
  }, [dossierActif]);

  // Handlers pour maintenir la compatibilité avec useDirectivesDocuments
  const handleUploadComplete = () => {
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
    
    window.open(filePath, '_blank');
  };

  const handleDelete = async (documentId: string) => {
    console.log("Suppression non disponible pour les dossiers institution");
    toast({
      title: "Information",
      description: "La suppression de documents n'est pas disponible en mode consultation",
      variant: "default"
    });
  };

  return {
    user: null,
    isAuthenticated: false,
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
