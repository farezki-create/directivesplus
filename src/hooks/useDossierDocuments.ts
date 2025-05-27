
import { useState, useEffect } from "react";
import { useDossierStore } from "@/store/dossierStore";
import { toast } from "@/hooks/use-toast";
import type { Document } from "@/types/documents";

/**
 * Hook pour gérer les documents depuis un dossier actif (accès institution)
 */
export const useDossierDocuments = () => {
  const { dossierActif, decryptedContent } = useDossierStore();
  const [isLoading, setIsLoading] = useState(true);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [showAddOptions, setShowAddOptions] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<Document | null>(null);

  // Extraire les documents du dossier actif
  useEffect(() => {
    const extractDocumentsFromDossier = () => {
      console.log("extractDocumentsFromDossier - Chargement des documents...");
      console.log("Dossier actif:", dossierActif);
      console.log("Contenu décrypté:", decryptedContent);
      
      setIsLoading(true);
      
      if (!dossierActif?.contenu) {
        console.log("Aucun contenu dans le dossier");
        setDocuments([]);
        setIsLoading(false);
        return;
      }

      const extractedDocuments: Document[] = [];
      
      // Extraire les directives (format textuel/JSON)
      if (dossierActif.contenu.directives && Array.isArray(dossierActif.contenu.directives)) {
        dossierActif.contenu.directives.forEach((directive: any, index: number) => {
          if (directive.type === 'document' && directive.file_path) {
            // Document PDF
            extractedDocuments.push({
              id: directive.id || `doc-${index}`,
              file_name: directive.file_name || `Document ${index + 1}`,
              file_path: directive.file_path,
              file_type: directive.content_type || 'application/pdf',
              content_type: directive.content_type || 'application/pdf',
              file_size: directive.file_size || 0,
              user_id: dossierActif.userId,
              created_at: directive.created_at || new Date().toISOString(),
              description: directive.description || 'Document partagé via accès institution'
            });
          } else if (directive.type === 'directive' && directive.content) {
            // Directive textuelle - créer un document virtuel
            extractedDocuments.push({
              id: directive.id || `directive-${index}`,
              file_name: `Directive ${index + 1}`,
              file_path: `data:application/json;base64,${btoa(JSON.stringify(directive.content))}`,
              file_type: 'application/json',
              content_type: 'application/json',
              file_size: JSON.stringify(directive.content).length,
              user_id: dossierActif.userId,
              created_at: directive.created_at || new Date().toISOString(),
              description: 'Directive anticipée textuelle'
            });
          }
        });
      }

      console.log("Documents extraits du dossier:", extractedDocuments);
      setDocuments(extractedDocuments);
      setIsLoading(false);

      // Si on a des documents, ouvrir automatiquement le premier PDF
      if (extractedDocuments.length > 0) {
        const firstPdf = extractedDocuments.find(doc => 
          doc.content_type === 'application/pdf' || 
          doc.file_name.toLowerCase().endsWith('.pdf')
        );
        
        if (firstPdf) {
          console.log("Ouverture automatique du premier document PDF:", firstPdf);
          setTimeout(() => {
            window.open(firstPdf.file_path, '_blank');
          }, 500);
        }
      }
    };

    extractDocumentsFromDossier();
  }, [dossierActif, decryptedContent]);

  // Handlers pour les opérations (désactivées en mode dossier)
  const handleDownload = (filePath: string, fileName: string) => {
    console.log("handleDownload:", filePath, fileName);
    
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
  };

  const handlePrint = (filePath: string, fileType?: string) => {
    console.log("handlePrint:", filePath, fileType);
    
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

  const handleView = (filePath: string) => {
    console.log("handleView:", filePath);
    window.open(filePath, '_blank');
  };

  const handleUploadComplete = () => {
    console.log("Upload non disponible pour les dossiers institution");
    toast({
      title: "Information",
      description: "L'ajout de documents n'est pas disponible en mode consultation",
      variant: "default"
    });
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
    isLoading,
    documents,
    showAddOptions,
    setShowAddOptions,
    documentToDelete,
    setDocumentToDelete,
    handleDownload,
    handlePrint,
    handleView,
    handleDelete,
    handleUploadComplete,
  };
};
