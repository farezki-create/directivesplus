
import React, { useEffect } from 'react';
import { useDossierStore } from '@/store/dossierStore';
import { toast } from '@/hooks/use-toast';

interface DirectAccessCodeHandlerProps {
  onLoad: (data: any) => void;
}

const DirectAccessCodeHandler: React.FC<DirectAccessCodeHandlerProps> = ({ onLoad }) => {
  const { setDossierActif } = useDossierStore();

  useEffect(() => {
    // Check for direct access code in sessionStorage
    const accessCode = sessionStorage.getItem('directAccessCode');
    const documentData = sessionStorage.getItem('documentData');
    
    if (accessCode && documentData) {
      try {
        // Parse the document data
        const documents = JSON.parse(documentData);
        
        // Create a minimal dossier with the access code and documents
        const minimalDossier = {
          id: `direct-${Date.now()}`,
          userId: "",
          isFullAccess: false,
          isDirectivesOnly: true,
          isMedicalOnly: false,
          profileData: {
            first_name: "Patient",
            last_name: "",
            birth_date: null
          },
          contenu: {
            documents: documents
          }
        };
        
        // Set the dossier in the store
        setDossierActif(minimalDossier);
        onLoad(minimalDossier);
        
        // Clear the sessionStorage
        sessionStorage.removeItem('directAccessCode');
        sessionStorage.removeItem('documentData');
        
        toast({
          title: "Document chargé",
          description: "Le document a été chargé avec succès",
        });
      } catch (error) {
        console.error("Error loading direct access document:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger le document direct",
          variant: "destructive"
        });
      }
    }
  }, [setDossierActif, onLoad]);

  return null; // This component doesn't render anything
};

export default DirectAccessCodeHandler;
