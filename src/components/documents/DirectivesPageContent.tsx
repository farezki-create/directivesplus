
import React, { useState } from "react";
import { Document } from "@/hooks/useDirectivesDocuments";
import DirectivesPageHeader from "@/components/documents/DirectivesPageHeader";
import DirectivesAddDocumentSection from "@/components/documents/DirectivesAddDocumentSection";
import DirectivesDocumentList from "@/components/documents/DirectivesDocumentList";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useDossierStore } from "@/store/dossierStore";
import { useAuth } from "@/contexts/AuthContext";

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
  const { user, isAuthenticated } = useAuth();

  // Log when this component renders with its props
  React.useEffect(() => {
    console.log("DirectivesPageContent rendered:", { 
      documentsCount: documents.length, 
      hasUserId: !!userId,
      accessCode: accessCode,
      isAuthenticated
    });
  }, [documents.length, userId, accessCode, isAuthenticated]);

  const handleAddToSharedFolder = async (document: Document) => {
    try {
      console.log("Ajout au dossier partagé:", document);
      setIsAdding(true);

      // MÉTHODE SIMPLIFIÉE: Créer un dossier directement avec le document sélectionné
      // Cette approche est plus directe et évite plusieurs couches d'appels API
      
      toast({
        title: "Traitement en cours",
        description: "Préparation du document pour le dossier partagé...",
      });
      
      // Création d'un dossier minimal avec le document sélectionné
      const minimalDossier = {
        id: `manual-${Date.now()}`,
        userId: isAuthenticated ? (user?.id || userId) : "anonymous",
        isFullAccess: true,
        isDirectivesOnly: true,
        isMedicalOnly: false,
        profileData: profile || {
          first_name: user?.user_metadata?.first_name || "Utilisateur",
          last_name: user?.user_metadata?.last_name || "Anonyme",
          birth_date: user?.user_metadata?.birth_date || new Date().toISOString().split('T')[0],
        },
        contenu: {
          patient: {
            nom: (user?.user_metadata?.last_name || profile?.last_name || "Anonyme"),
            prenom: (user?.user_metadata?.first_name || profile?.first_name || "Utilisateur"),
            date_naissance: (user?.user_metadata?.birth_date || profile?.birth_date || new Date().toISOString().split('T')[0]),
          },
          document_url: document.file_path,
          document_name: document.file_name
        }
      };
      
      // Stockage du dossier dans le store pour accès global
      console.log("Stockage du dossier dans le store:", minimalDossier);
      setDossierActif(minimalDossier);
      
      // Pour utilisateurs authentifiés, stockage du code pour la redirection
      if (!isAuthenticated && accessCode) {
        sessionStorage.setItem('directAccessCode', accessCode);
        console.log("Code d'accès stocké pour utilisateur non authentifié:", accessCode);
      }
      
      // Attendre un moment pour s'assurer que le state est mis à jour
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Redirection vers la page d'affichage du dossier
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
