import React, { useState, useEffect } from "react";
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
  useEffect(() => {
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

      // Prepare a documents list for the dossier with complete document information
      const documentsList = [{
        id: document.id,
        file_name: document.file_name,
        file_path: document.file_path,
        created_at: document.created_at || new Date().toISOString(),
        description: document.description || "",
        content_type: document.content_type || "application/pdf",
        is_shared: true
      }];

      console.log("Document prepared for storage:", documentsList[0]);

      // Pour les utilisateurs authentifiés, on peut ignorer la vérification de code
      if (isAuthenticated && user) {
        // Afficher un toast de chargement
        toast({
          title: "Traitement en cours",
          description: "Préparation du document pour le dossier partagé...",
        });
        
        // Créer un dossier minimal avec les infos utilisateur et le document sélectionné
        const minimalDossier = {
          id: `auth-${Date.now()}`,
          userId: user.id || "",
          isFullAccess: true,
          isDirectivesOnly: true,
          isMedicalOnly: false,
          profileData: profile || {
            first_name: user?.user_metadata?.first_name,
            last_name: user?.user_metadata?.last_name,
            birth_date: user?.user_metadata?.birth_date,
          },
          contenu: {
            patient: {
              nom: user?.user_metadata?.last_name || profile?.last_name || "Inconnu",
              prenom: user?.user_metadata?.first_name || profile?.first_name || "Inconnu",
              date_naissance: user?.user_metadata?.birth_date || profile?.birth_date || null,
            },
            documents: documentsList // Use the documents list format
          }
        };
        
        console.log("Dossier créé:", minimalDossier);
        
        // Stocker les informations dans le store
        setDossierActif(minimalDossier);
        
        // Attendre un moment pour laisser le temps au state de se mettre à jour
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Rediriger vers la page d'affichage du dossier
        console.log("Redirection vers affichage-dossier pour utilisateur connecté avec document:", document.file_name);
        navigate('/affichage-dossier');

        toast({
          title: "Document ajouté",
          description: "Document ajouté au dossier partagé avec succès",
        });
        return;
      }

      // Pour les utilisateurs non authentifiés, on garde le comportement existant
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
      
      // Stocker le code d'accès et les documents dans sessionStorage pour la redirection
      sessionStorage.setItem('directAccessCode', accessCode);
      sessionStorage.setItem('documentData', JSON.stringify(documentsList));
      
      console.log("Code d'accès stocké:", accessCode);
      console.log("Documents stockés:", documentsList);
      
      // Réinitialiser l'état du dossier actif pour forcer un nouveau chargement
      setDossierActif(null);
      
      // Attendre un moment pour laisser le temps au state de se mettre à jour
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Rediriger vers la page d'affichage du dossier
      console.log("Redirection vers affichage-dossier");
      navigate('/affichage-dossier');

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
        }}
        isAdding={isAdding}
      />
    </div>
  );
};

export default DirectivesPageContent;
