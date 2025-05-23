
import React, { useEffect } from 'react';
import { useDossierStore } from '@/store/dossierStore';
import { decryptDossierContent } from '@/utils/dossier/contentDecrypt';

interface DossierContentProviderProps {
  children: React.ReactNode;
  rawContent?: any;
}

/**
 * Provider component that handles decryption of dossier content
 * and updates the store with the decrypted content
 */
const DossierContentProvider: React.FC<DossierContentProviderProps> = ({ 
  children, 
  rawContent 
}) => {
  const dossierActif = useDossierStore(state => state.dossierActif);
  const setDecryptedContent = useDossierStore(state => state.setDecryptedContent);
  
  useEffect(() => {
    // If we have a dossier and raw content, decrypt it
    if (dossierActif && rawContent) {
      try {
        const decrypted = decryptDossierContent(rawContent);
        setDecryptedContent(decrypted);
        console.log("Content decrypted and stored in dossier store");
      } catch (error) {
        console.error("Error decrypting dossier content:", error);
        setDecryptedContent(null);
      }
    } else if (dossierActif && dossierActif.contenu) {
      // If we have a dossier with content directly on it
      try {
        const decrypted = decryptDossierContent(dossierActif.contenu);
        setDecryptedContent(decrypted);
        console.log("Content from dossier decrypted and stored");
      } catch (error) {
        console.error("Error decrypting content from dossier:", error);
        setDecryptedContent(null);
      }
    } else {
      // Clear decrypted content if no dossier or content
      setDecryptedContent(null);
    }
  }, [dossierActif, rawContent, setDecryptedContent]);

  return <>{children}</>;
};

export default DossierContentProvider;
