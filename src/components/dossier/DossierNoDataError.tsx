
import React from "react";
import DossierErrorState from "./DossierErrorState";
import { useNavigate } from "react-router-dom";

interface DossierNoDataErrorProps {
  dossierActif: any;
  decryptedContent: any;
  decryptionError: string | null;
  loading: boolean;
}

const DossierNoDataError: React.FC<DossierNoDataErrorProps> = ({
  dossierActif,
  decryptedContent,
  decryptionError,
  loading
}) => {
  const navigate = useNavigate();
  
  // Si pas de dossier actif après le chargement, afficher message d'erreur
  if (!dossierActif && !loading) {
    return (
      <DossierErrorState 
        title="Aucun dossier disponible"
        description="Nous n'avons pas pu trouver ou charger le dossier demandé. Veuillez réessayer avec un code d'accès valide."
      />
    );
  }
  
  // Si le contenu du dossier est vide ou invalide
  if (!decryptedContent && !loading) {
    return (
      <DossierErrorState 
        title="Problème de chargement du dossier"
        description="Le dossier a bien été trouvé, mais son contenu est vide ou ne peut pas être affiché."
        showRetry={true}
        decryptionError={decryptionError}
      />
    );
  }
  
  return null;
};

export default DossierNoDataError;
