import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useDossierStore } from "@/store/dossierStore";

interface AccessSharedProfileProps {
  onSuccess?: (dossier: any) => void;
}

export const AccessSharedProfile = ({ onSuccess }: AccessSharedProfileProps) => {
  const navigate = useNavigate();
  const { setDossierActif } = useDossierStore();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    birthdate: "",
    accessCode: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Form validation
      if (!form.firstName || !form.lastName || !form.birthdate || !form.accessCode) {
        toast({
          variant: "destructive",
          title: "Erreur de validation",
          description: "Veuillez remplir tous les champs"
        });
        setLoading(false);
        return;
      }

      console.log("AccessSharedProfile - Submitting form:", form);

      // First try the RPC function approach
      const { data, error } = await supabase.rpc("verify_access_identity", {
        input_lastname: form.lastName,
        input_firstname: form.firstName,
        input_birthdate: form.birthdate,
        input_access_code: form.accessCode
      });

      console.log("RPC verification result:", data, error);

      // If RPC fails or returns no data, try edge function
      if (error || !data || data.length === 0) {
        console.log("RPC failed, trying edge function...");
        
        // Call the edge function as fallback
        const response = await fetch("https://kytqqjnecezkxyhmmjrz.supabase.co/functions/v1/verifierCodeAcces", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            accessCode: form.accessCode,
            patientName: `${form.firstName} ${form.lastName}`,
            patientBirthDate: form.birthdate,
            bruteForceIdentifier: `directive_access_${form.firstName}_${form.lastName}`
          })
        });
        
        const result = await response.json();
        
        if (!result.success) {
          console.error("Edge function verification failed:", result.error);
          toast({
            variant: "destructive",
            title: "Échec de l'accès",
            description: "Informations incorrectes ou accès expiré"
          });
          setLoading(false);
          return;
        }
        
        // Create dossier from edge function result
        const dossier = result.dossier;
        
        // Store in localStorage for access across the app
        localStorage.setItem("shared_dossier", JSON.stringify(dossier));
        
        // Store in the global state
        setDossierActif(dossier);
        
        toast({
          title: "Accès validé",
          description: "Redirection vers le dossier..."
        });
        
        // Call the onSuccess callback if provided
        if (onSuccess) {
          onSuccess(dossier);
        } else {
          // Otherwise navigate directly
          navigate("/dashboard");
        }
        
        return;
      }

      // If RPC was successful
      // Log access for auditing
      await supabase.from("document_access_logs").insert({
        user_id: data[0].user_id || null,
        access_code_id: data[0].id,
        nom_consultant: form.lastName,
        prenom_consultant: form.firstName,
        ip_address: null,
        user_agent: navigator.userAgent || null
      });

      // Store dossier in local storage or state management
      const dossier = {
        id: data[0].id,
        userId: data[0].user_id || null,
        medical_profile_id: data[0].medical_profile_id,
        isFullAccess: true,
        isDirectivesOnly: true,
        isMedicalOnly: false,
        profileData: {
          first_name: data[0].first_name,
          last_name: data[0].last_name,
          birth_date: data[0].birthdate
        },
        contenu: {
          patient: {
            nom: data[0].last_name,
            prenom: data[0].first_name,
            date_naissance: data[0].birthdate
          }
        }
      };

      // Store in localStorage for access across the app
      localStorage.setItem("shared_dossier", JSON.stringify(dossier));
      
      // Store in the global state
      setDossierActif(dossier);

      toast({
        title: "Accès validé",
        description: "Redirection vers le dossier..."
      });

      // Call the onSuccess callback if provided
      if (onSuccess) {
        onSuccess(dossier);
      } else {
        // Otherwise navigate directly
        navigate("/dashboard");
      }

    } catch (err) {
      console.error("Erreur lors de la vérification:", err);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de vérifier les informations"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="lastName">Nom</Label>
        <Input
          id="lastName"
          name="lastName"
          placeholder="Nom de famille"
          value={form.lastName}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="firstName">Prénom</Label>
        <Input
          id="firstName"
          name="firstName"
          placeholder="Prénom"
          value={form.firstName}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="birthdate">Date de naissance</Label>
        <Input
          id="birthdate"
          name="birthdate"
          type="date"
          value={form.birthdate}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="accessCode">Code d'accès</Label>
        <Input
          id="accessCode"
          name="accessCode"
          placeholder="Code d'accès"
          value={form.accessCode}
          onChange={handleChange}
          required
        />
      </div>
      
      <Button 
        type="submit" 
        className="w-full"
        disabled={loading}
      >
        {loading ? "Vérification..." : "Accéder à mon dossier"}
      </Button>
    </form>
  );
};
