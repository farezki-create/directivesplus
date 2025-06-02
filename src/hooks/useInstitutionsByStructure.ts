
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Institution {
  id: string;
  nom: string;
  email: string;
  structure: string;
  telephone: string;
  est_valide: boolean;
  date_validation: string | null;
  created_at: string;
  structure_autorisee: string | null;
}

interface Structure {
  id: string;
  nom: string;
  type_structure: string;
  adresse: string;
  ville: string;
  code_postal: string;
  telephone: string;
  email: string;
}

interface Patient {
  id: string;
  name: string;
  date_of_birth: string;
  structure: string;
  access_code: string | null;
  access_code_expires_at: string | null;
}

export const useInstitutionsByStructure = () => {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [structures, setStructures] = useState<Structure[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getPatientsByStructure = async (structureName: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('structure', structureName)
        .order('name');

      if (error) {
        throw error;
      }

      setPatients(data || []);
      return data || [];
    } catch (err: any) {
      console.error('Erreur lors de la récupération des patients:', err);
      setError(err.message);
      toast({
        title: "Erreur",
        description: "Impossible de charger les patients de cette structure",
        variant: "destructive"
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getInstitutionsByStructure = async (structureName: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('abonnes_institutions')
        .select('*')
        .eq('structure_autorisee', structureName)
        .eq('est_valide', true)
        .order('nom');

      if (error) {
        throw error;
      }

      setInstitutions(data || []);
      return data || [];
    } catch (err: any) {
      console.error('Erreur lors de la récupération des institutions:', err);
      setError(err.message);
      toast({
        title: "Erreur",
        description: "Impossible de charger les institutions pour cette structure",
        variant: "destructive"
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchAllStructures = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('structures_soins')
        .select('*')
        .order('nom');

      if (error) {
        throw error;
      }

      setStructures(data || []);
      return data || [];
    } catch (err: any) {
      console.error('Erreur lors de la récupération des structures:', err);
      setError(err.message);
      toast({
        title: "Erreur",
        description: "Impossible de charger les structures",
        variant: "destructive"
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  const assignPatientToStructure = async (patientId: string, structureName: string) => {
    try {
      const { error } = await supabase
        .from('patients')
        .update({ structure: structureName })
        .eq('id', patientId);

      if (error) {
        throw error;
      }

      toast({
        title: "Succès",
        description: "Patient assigné à la structure avec succès"
      });
      
      // Recharger les patients de la structure
      await getPatientsByStructure(structureName);
    } catch (err: any) {
      console.error('Erreur lors de l\'assignation du patient:', err);
      toast({
        title: "Erreur",
        description: "Impossible d'assigner le patient à cette structure",
        variant: "destructive"
      });
    }
  };

  return {
    institutions,
    structures,
    patients,
    loading,
    error,
    getPatientsByStructure,
    getInstitutionsByStructure,
    fetchAllStructures,
    assignPatientToStructure
  };
};
