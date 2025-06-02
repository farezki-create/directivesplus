
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface InstitutionSubscription {
  id: string;
  nom: string;
  email: string;
  structure: string;
  telephone: string;
  est_valide: boolean;
  date_validation: string | null;
  created_at: string;
}

interface AccessRight {
  id: string;
  patient_nom: string;
  patient_prenom: string;
  patient_naissance: string;
  date_autorisation: string;
  notes: string | null;
}

export const useInstitutionSubscription = () => {
  const [subscriptions, setSubscriptions] = useState<InstitutionSubscription[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('abonnes_institutions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setSubscriptions(data || []);
    } catch (err: any) {
      console.error('Erreur lors de la récupération des abonnements:', err);
      setError(err.message);
      toast({
        title: "Erreur",
        description: "Impossible de charger les abonnements institutions",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const validateSubscription = async (subscriptionId: string) => {
    try {
      const { error } = await supabase
        .from('abonnes_institutions')
        .update({
          est_valide: true,
          date_validation: new Date().toISOString()
        })
        .eq('id', subscriptionId);

      if (error) {
        throw error;
      }

      await fetchSubscriptions();
      toast({
        title: "Succès",
        description: "L'abonnement a été validé avec succès"
      });
    } catch (err: any) {
      console.error('Erreur lors de la validation:', err);
      toast({
        title: "Erreur",
        description: "Impossible de valider l'abonnement",
        variant: "destructive"
      });
    }
  };

  const revokeSubscription = async (subscriptionId: string) => {
    try {
      const { error } = await supabase
        .from('abonnes_institutions')
        .update({
          est_valide: false,
          date_validation: null
        })
        .eq('id', subscriptionId);

      if (error) {
        throw error;
      }

      await fetchSubscriptions();
      toast({
        title: "Succès",
        description: "L'abonnement a été révoqué"
      });
    } catch (err: any) {
      console.error('Erreur lors de la révocation:', err);
      toast({
        title: "Erreur",
        description: "Impossible de révoquer l'abonnement",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  return {
    subscriptions,
    loading,
    error,
    fetchSubscriptions,
    validateSubscription,
    revokeSubscription
  };
};
