
import React, { useState } from "react";
import { Document } from "@/hooks/useDirectivesDocuments";
import DirectivesPageHeader from "@/components/documents/DirectivesPageHeader";
import DirectivesAddDocumentSection from "@/components/documents/DirectivesAddDocumentSection";
import DirectivesDocumentList from "@/components/documents/DirectivesDocumentList";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useDossierStore } from "@/store/dossierStore";

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
  const [isAdding, setIsAdding] = useState(false);
  const { setDossierActif } = useDossierStore();

  // Log when this component renders with its props
  React.useEffect(() => {
    console.log("DirectivesPageContent rendered:", { 
      documentsCount: documents.length, 
      hasUserId: !!userId,
      accessCode: accessCode
    });
  }, [documents.length, userId, accessCode]);

  const handleAddToSharedFolder = async (document: Document) => {
    try {
      console.log("Ajout au dossier partagé:", document);
      setIsAdding(true);

      if (!accessCode) {
        toast({
          title: "Erreur",
          description: "Aucun code d'accès n'est disponible pour ce document",
          variant: "destructive"
        });
        return;
      }

      // Afficher un toast de chargement
      toast({
        title: "Traitement en cours",
        description: "Préparation du document pour le dossier partagé...",
      });
      
      // Attendre un moment pour laisser le temps au state de se mettre à jour
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Stocker le code d'accès dans sessionStorage pour la redirection
      sessionStorage.setItem('directAccessCode', accessCode);
      
      console.log("Code d'accès stocké:", accessCode);
      
      // Réinitialiser l'état du dossier actif pour forcer un nouveau chargement
      setDossierActif(null);
      
      // Attendre un moment pour laisser le temps au state de se mettre à jour
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Rediriger vers la page d'affichage du dossier
      console.log("Redirection vers affichage-dossier");
      navigate('/affichage-dossier', { replace: true });

      toast({
        title: "Document ajouté",
        description: "Document ajouté au dossier partagé avec succès",
      });
    } catch (error) {
      console.error("Erreur lors de l'ajout au dossier partagé:", error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'ajout au dossier partagé",
        variant: "destructive"
      });
    } finally {
      setIsAdding(false);
    }
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
        isAdding={isAdding}
      />
    </div>
  );
};

export default DirectivesPageContent;
