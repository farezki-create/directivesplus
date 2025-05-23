
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useDossierStore } from "@/store/dossierStore";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DatePickerField } from "./DatePickerField";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import FormFields from "./FormFields";
import ErrorDisplay from "./ErrorDisplay";
import SubmitButton from "./SubmitButton";

export const AccessSharedProfile = () => {
  const navigate = useNavigate();
  const { setDossierActif } = useDossierStore();
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthdate, setBirthdate] = useState<Date | undefined>(undefined);
  const [accessCode, setAccessCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async () => {
    if (!firstName || !lastName || !birthdate || !accessCode) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      // Convert birthdate to ISO format for database comparison
      const formattedDate = birthdate.toISOString().split('T')[0];
      
      // Use the RPC function to verify identity
      const { data, error: rpcError } = await supabase.rpc('verify_access_identity', {
        input_firstname: firstName.trim(),
        input_lastname: lastName.trim(),
        input_birthdate: formattedDate,
        input_access_code: accessCode.trim()
      });
      
      if (rpcError || !data || data.length === 0) {
        console.error("Error verifying identity:", rpcError);
        throw new Error("Informations incorrectes ou accès expiré");
      }
      
      const sharedProfile = data[0];
      
      // Log access for audit purposes
      await supabase.from("document_access_logs").insert({
        user_id: sharedProfile.user_id || null,
        access_code_id: sharedProfile.id,
        nom_consultant: lastName,
        prenom_consultant: firstName,
        ip_address: null, // No IP in browser context
        user_agent: navigator.userAgent || null
      });
      
      // Create dossier object from shared profile
      const dossier = {
        id: sharedProfile.id,
        userId: sharedProfile.user_id || null,
        medical_profile_id: sharedProfile.medical_profile_id,
        isFullAccess: true,
        isDirectivesOnly: true,
        isMedicalOnly: false,
        profileData: {
          first_name: sharedProfile.first_name,
          last_name: sharedProfile.last_name,
          birth_date: sharedProfile.birthdate
        },
        contenu: {
          patient: {
            nom: sharedProfile.last_name,
            prenom: sharedProfile.first_name,
            date_naissance: sharedProfile.birthdate
          }
        }
      };
      
      // Store the dossier and navigate to dashboard
      setDossierActif(dossier);
      
      toast({
        title: "Accès autorisé",
        description: "Vous avez accès aux directives anticipées",
      });
      
      navigate("/dashboard", { replace: true });
    } catch (err: any) {
      console.error("Error during verification:", err);
      setError(err.message || "Une erreur est survenue lors de la vérification");
      
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de vérifier votre accès aux directives",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-xl text-center text-directiveplus-700">
          Accès à mes directives anticipées
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="text-sm text-gray-600 mb-3 p-3 bg-blue-50 rounded-md border border-blue-100">
          Veuillez saisir vos informations personnelles et le code d'accès qui vous a été fourni.
        </div>
        
        <FormFields
          firstName={firstName}
          setFirstName={setFirstName}
          lastName={lastName}
          setLastName={setLastName}
          birthdate={birthdate}
          setBirthdate={setBirthdate}
          accessCode={accessCode}
          setAccessCode={setAccessCode}
          loading={loading}
        />
        
        <ErrorDisplay error={error} />
      </CardContent>
      
      <CardFooter>
        <SubmitButton 
          loading={loading} 
          onClick={handleVerify} 
        />
      </CardFooter>
    </Card>
  );
};

export default AccessSharedProfile;
