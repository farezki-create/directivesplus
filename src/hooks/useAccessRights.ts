
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface AccessRight {
  id: string;
  abonne_id: string;
  patient_nom: string;
  patient_prenom: string;
  patient_naissance: string;
  date_autorisation: string;
  notes: string | null;
  institution_nom?: string;
  institution_structure?: string;
}

interface CreateAccessRightData {
  abonne_id: string;
  patient_nom: string;
  patient_prenom: string;
  patient_naissance: string;
  notes?: string;
}

export const useAccessRights = () => {
  const [accessRights, setAccessRights] = useState<AccessRight[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAccessRights = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('droits_acces_nominal')
        .select(`
          *,
          abonnes_institutions (
            nom,
            structure
          )
        `)
        .order('date_autorisation', { ascending: false });

      if (error) {
        throw error;
      }

      const formattedData = data?.map(item => ({
        ...item,
        institution_nom: item.abonnes_institutions?.nom,
        institution_structure: item.abonnes_institutions?.structure
      })) || [];

      setAccessRights(formattedData);
    } catch (err: any) {
      console.error('Erreur lors de la récupération des droits d\'accès:', err);
      setError(err.message);
      toast({
        title: "Erreur",
        description: "Impossible de charger les droits d'accès",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createAccessRight = async (accessRightData: CreateAccessRightData) => {
    try {
      const { error } = await supabase
        .from('droits_acces_nominal')
        .insert([accessRightData]);

      if (error) {
        throw error;
      }

      await fetchAccessRights();
      toast({
        title: "Succès",
        description: "Droit d'accès créé avec succès"
      });
    } catch (err: any) {
      console.error('Erreur lors de la création du droit d\'accès:', err);
      toast({
        title: "Erreur",
        description: err.message.includes('duplicate') 
          ? "Ce droit d'accès existe déjà pour cette institution"
          : "Impossible de créer le droit d'accès",
        variant: "destructive"
      });
      throw err;
    }
  };

  const deleteAccessRight = async (accessRightId: string) => {
    try {
      const { error } = await supabase
        .from('droits_acces_nominal')
        .delete()
        .eq('id', accessRightId);

      if (error) {
        throw error;
      }

      await fetchAccessRights();
      toast({
        title: "Succès",
        description: "Droit d'accès supprimé avec succès"
      });
    } catch (err: any) {
      console.error('Erreur lors de la suppression du droit d\'accès:', err);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le droit d'accès",
        variant: "destructive"
      });
    }
  };

  const checkInstitutionAccess = async (
    institutionEmail: string,
    patientNom: string,
    patientPrenom: string,
    patientNaissance: string
  ): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .rpc('institution_has_patient_access', {
          p_institution_email: institutionEmail,
          p_patient_nom: patientNom,
          p_patient_prenom: patientPrenom,
          p_patient_naissance: patientNaissance
        });

      if (error) {
        throw error;
      }

      return data || false;
    } catch (err: any) {
      console.error('Erreur lors de la vérification d\'accès:', err);
      return false;
    }
  };

  useEffect(() => {
    fetchAccessRights();
  }, []);

  return {
    accessRights,
    loading,
    error,
    fetchAccessRights,
    createAccessRight,
    deleteAccessRight,
    checkInstitutionAccess
  };
};
