
import React from "react";
import { Document } from "@/hooks/useDirectivesDocuments";
import DirectivesPageHeader from "@/components/documents/DirectivesPageHeader";
import DirectivesAddDocumentSection from "@/components/documents/DirectivesAddDocumentSection";
import DirectivesDocumentList from "@/components/documents/DirectivesDocumentList";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

interface DirectivesPageContentProps {
  documents: Document[];
  showAddOptions: boolean;
  setShowAddOptions: (show: boolean) => void;
  userId: string;
  onUploadComplete: (url: string, fileName: string, isPrivate: boolean) => void;
  onDownload: (filePath: string, fileName: string) => void;
  onPrint: (filePath: string, contentType?: string) => void;
  onView: (filePath: string, contentType?: string) => void;
  onDelete: (documentId: string) => void;
  accessCode?: string | null;
  profile?: {
    first_name?: string;
    last_name?: string;
    birth_date?: string;
  };
}

const DirectivesPageContent: React.FC<DirectivesPageContentProps> = ({
  documents,
  showAddOptions,
  setShowAddOptions,
  userId,
  onUploadComplete,
  onDownload,
  onPrint,
  onView,
  onDelete,
  accessCode,
  profile
}) => {
  const navigate = useNavigate();

  // Log when this component renders with its props
  React.useEffect(() => {
    console.log("DirectivesPageContent rendered:", { 
      documentsCount: documents.length, 
      hasUserId: !!userId,
      accessCode: accessCode
    });
    
    // Ne pas récupérer le code d'accès direct ici pour éviter une double redirection
    // Cela permet de s'assurer que seule la page AffichageDossier traite les codes directs
  }, [documents.length, userId, accessCode]);

  const handleAddToSharedFolder = (document: Document) => {
    console.log("Ajout au dossier partagé:", document);

    if (!accessCode) {
      toast({
        title: "Erreur",
        description: "Aucun code d'accès n'est disponible pour ce document",
        variant: "destructive"
      });
      return;
    }

    // Stocker le code d'accès dans sessionStorage pour la redirection
    sessionStorage.setItem('directAccessCode', accessCode);
    
    // Rediriger vers la page d'affichage du dossier
    navigate('/affichage-dossier', { replace: true });

    toast({
      title: "Document ajouté",
      description: "Document ajouté au dossier partagé",
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <DirectivesPageHeader 
        onAddDocument={() => setShowAddOptions(!showAddOptions)} 
      />

      {showAddOptions && userId && (
        <DirectivesAddDocumentSection 
          userId={userId}
          onUploadComplete={onUploadComplete}
        />
      )}
      
      <DirectivesDocumentList 
        documents={documents}
        onDownload={onDownload}
        onPrint={onPrint}
        onView={onView}
        onDelete={onDelete}
        onAddToSharedFolder={handleAddToSharedFolder}
        onVisibilityChange={(id, isPrivate) => {
          console.log("DirectivesPageContent - Changement de visibilité:", id, isPrivate);
          // You can implement visibility change handling here
        }}
      />
    </div>
  );
};

export default DirectivesPageContent;
