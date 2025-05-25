
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

interface InstitutionCode {
  id: string;
  institution_code: string;
  institution_name?: string;
  contact_person?: string;
  contact_email?: string;
  contact_phone?: string;
  expires_at?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface CreateInstitutionCodeData {
  institution_name?: string;
  contact_person?: string;
  contact_email?: string;
  contact_phone?: string;
  expires_at?: string;
}

export const useInstitutionCodes = () => {
  const [codes, setCodes] = useState<InstitutionCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const loadCodes = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('institution_access_codes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCodes(data || []);
    } catch (err: any) {
      console.error('Erreur lors du chargement des codes institution:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const generateCode = async (data: CreateInstitutionCodeData) => {
    if (!user) {
      toast({ title: "Erreur", description: "Vous devez être connecté", variant: "destructive" });
      return null;
    }

    try {
      // Générer un nouveau code via la fonction
      const { data: codeResult, error: codeError } = await supabase.rpc('generate_institution_code');
      
      if (codeError) throw codeError;
      
      const newCode = codeResult;
      
      // Insérer le nouveau code dans la table
      const { data: insertData, error: insertError } = await supabase
        .from('institution_access_codes')
        .insert({
          user_id: user.id,
          institution_code: newCode,
          ...data
        })
        .select()
        .single();

      if (insertError) throw insertError;

      await loadCodes(); // Recharger la liste
      
      toast({
        title: "Code généré avec succès",
        description: `Nouveau code d'accès: ${newCode}`,
      });
      
      return insertData;
    } catch (err: any) {
      console.error('Erreur lors de la génération du code:', err);
      toast({
        title: "Erreur",
        description: "Impossible de générer le code d'accès",
        variant: "destructive"
      });
      return null;
    }
  };

  const updateCode = async (id: string, updates: Partial<CreateInstitutionCodeData>) => {
    try {
      const { error } = await supabase
        .from('institution_access_codes')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      await loadCodes(); // Recharger la liste
      
      toast({
        title: "Code mis à jour",
        description: "Les informations du code ont été mises à jour",
      });
      
      return true;
    } catch (err: any) {
      console.error('Erreur lors de la mise à jour:', err);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le code",
        variant: "destructive"
      });
      return false;
    }
  };

  const toggleCodeStatus = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('institution_access_codes')
        .update({ 
          is_active: isActive,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      await loadCodes(); // Recharger la liste
      
      toast({
        title: isActive ? "Code activé" : "Code désactivé",
        description: `Le code a été ${isActive ? 'activé' : 'désactivé'}`,
      });
      
      return true;
    } catch (err: any) {
      console.error('Erreur lors du changement de statut:', err);
      toast({
        title: "Erreur",
        description: "Impossible de changer le statut du code",
        variant: "destructive"
      });
      return false;
    }
  };

  const deleteCode = async (id: string) => {
    try {
      const { error } = await supabase
        .from('institution_access_codes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await loadCodes(); // Recharger la liste
      
      toast({
        title: "Code supprimé",
        description: "Le code d'accès a été supprimé",
      });
      
      return true;
    } catch (err: any) {
      console.error('Erreur lors de la suppression:', err);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le code",
        variant: "destructive"
      });
      return false;
    }
  };

  useEffect(() => {
    loadCodes();
  }, [user]);

  return {
    codes,
    loading,
    error,
    generateCode,
    updateCode,
    toggleCodeStatus,
    deleteCode,
    refreshCodes: loadCodes
  };
};
