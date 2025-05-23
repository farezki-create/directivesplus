
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useDossierStore } from "@/store/dossierStore";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DatePickerField } from "./DatePickerField";
import { Loader2 } from "lucide-react";

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
      
      // Call the Edge Function endpoint
      const response = await fetch("https://kytqqjnecezkxyhmmjrz.supabase.co/functions/v1/accessSharedProfile", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          birthdate: formattedDate,
          accessCode: accessCode.trim()
        })
      });
      
      const result = await response.json();
      
      if (!response.ok || !result.success) {
        console.error("Error accessing shared profile:", result.error);
        throw new Error(result.error || "Informations incorrectes ou accès expiré");
      }
      
      // Store the dossier and navigate to dashboard
      setDossierActif(result.dossier);
      
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
        
        <div className="space-y-3">
          <div className="space-y-1">
            <label htmlFor="firstName" className="text-sm font-medium">
              Prénom
            </label>
            <Input
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Votre prénom"
              disabled={loading}
            />
          </div>
          
          <div className="space-y-1">
            <label htmlFor="lastName" className="text-sm font-medium">
              Nom
            </label>
            <Input
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Votre nom"
              disabled={loading}
            />
          </div>
          
          <DatePickerField 
            birthdate={birthdate}
            setBirthdate={setBirthdate}
            disabled={loading}
          />
          
          <div className="space-y-1">
            <label htmlFor="accessCode" className="text-sm font-medium">
              Code d'accès
            </label>
            <Input
              id="accessCode"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              placeholder="Code d'accès"
              disabled={loading}
            />
          </div>
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-800 p-3 rounded-md border border-red-200 text-sm">
            {error}
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        <Button
          className="w-full"
          onClick={handleVerify}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Vérification...
            </>
          ) : (
            "Accéder à mes directives"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AccessSharedProfile;
