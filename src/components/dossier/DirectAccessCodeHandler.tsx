
import React, { useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useDossierStore } from "@/store/dossierStore";

interface DirectAccessCodeHandlerProps {
  logDossierEvent: (event: string, success: boolean) => void;
  setInitialLoading: (loading: boolean) => void;
}

const DirectAccessCodeHandler: React.FC<DirectAccessCodeHandlerProps> = ({ 
  logDossierEvent,
  setInitialLoading
}) => {
  const navigate = useNavigate();
  const { dossierActif, setDossierActif } = useDossierStore();
  
  useEffect(() => {
    const checkDirectAccessCode = async () => {
      try {
        // Récupérer le code d'accès de sessionStorage
        const directAccessCode = sessionStorage.getItem('directAccessCode');
        
        // Si on a un code d'accès direct et pas de dossier actif, charger le dossier
        if (directAccessCode && !dossierActif) {
          console.log("Code d'accès direct trouvé:", directAccessCode);
          
          // Charger le dossier à partir du code d'accès
          const { data: dossierData, error } = await supabase
            .from("dossiers_medicaux")
            .select("*")
            .eq("code_acces", directAccessCode)
            .single();
            
          if (error) {
            console.error("Erreur lors du chargement du dossier:", error);
            toast({
              title: "Erreur",
              description: "Impossible de charger le dossier avec le code fourni",
              variant: "destructive"
            });
            navigate('/acces-document', { replace: true });
            return;
          }
          
          if (dossierData) {
            // Définir le dossier comme actif
            setDossierActif({
              id: dossierData.id,
              userId: "direct-access", // ID temporaire pour l'accès direct
              isFullAccess: false,
              isDirectivesOnly: true,
              isMedicalOnly: false,
              contenu: dossierData.contenu_dossier
            });
            
            console.log("Dossier chargé avec succès à partir du code d'accès direct");
            
            // Nettoyer le code d'accès de session après utilisation
            sessionStorage.removeItem('directAccessCode');
            
            logDossierEvent("direct_access_view", true);
          }
        }
      } catch (error) {
        console.error("Erreur lors du chargement direct du dossier:", error);
      } finally {
        setInitialLoading(false);
      }
    };
    
    checkDirectAccessCode();
  }, [dossierActif, navigate, setDossierActif, logDossierEvent, setInitialLoading]);
  
  return null; // Ce composant ne rend rien, il gère seulement la logique
};

export default DirectAccessCodeHandler;
