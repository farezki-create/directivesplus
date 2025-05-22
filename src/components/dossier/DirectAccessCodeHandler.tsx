
import React, { useEffect } from 'react';
import { useDossierStore } from '@/store/dossierStore';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface DirectAccessCodeHandlerProps {
  onLoad: (data: any) => void;
  logDossierEvent?: (action: string, success: boolean) => void;
  setInitialLoading?: (loading: boolean) => void;
}

const DirectAccessCodeHandler: React.FC<DirectAccessCodeHandlerProps> = ({ 
  onLoad, 
  logDossierEvent,
  setInitialLoading 
}) => {
  const { setDossierActif } = useDossierStore();
  const navigate = useNavigate();

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
        
        // Log the event if the function is provided
        if (logDossierEvent) {
          logDossierEvent("direct_access_document_loaded", true);
        }
        
        // Update loading state if the function is provided
        if (setInitialLoading) {
          setInitialLoading(false);
        }
        
        // Redirect to dashboard
        navigate('/dashboard');
        
        toast({
          title: "Document chargé",
          description: "Le document a été chargé avec succès",
        });
      } catch (error) {
        console.error("Error loading direct access document:", error);
        
        // Log the error if the function is provided
        if (logDossierEvent) {
          logDossierEvent("direct_access_document_load_error", false);
        }
        
        toast({
          title: "Erreur",
          description: "Impossible de charger le document direct",
          variant: "destructive"
        });
      }
    }
  }, [setDossierActif, onLoad, logDossierEvent, setInitialLoading, navigate]);

  return null; // This component doesn't render anything
};

export default DirectAccessCodeHandler;
