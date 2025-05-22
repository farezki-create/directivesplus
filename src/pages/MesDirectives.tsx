import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Loader2, CalendarIcon } from "lucide-react";
import { useDossierStore } from "@/store/dossierStore";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import Header from "@/components/Header";

export default function MesDirectives() {
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
      
      // First, check the shared_profiles table
      const { data, error: queryError } = await supabase
        .from("shared_profiles")
        .select("*, medical_profile_id")
        .eq("first_name", firstName.trim())
        .eq("last_name", lastName.trim())
        .eq("birthdate", formattedDate)
        .eq("access_code", accessCode.trim())
        .maybeSingle();

      if (queryError) {
        console.error("Error verifying access code:", queryError);
        throw new Error("Une erreur est survenue lors de la vérification du code d'accès");
      }

      if (!data) {
        // If not found in shared_profiles, try using the edge function
        const response = await fetch("https://kytqqjnecezkxyhmmjrz.supabase.co/functions/v1/verifierCodeAcces", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            accessCode: accessCode,
            bruteForceIdentifier: `directives_public_${firstName}_${lastName}`
          })
        });
        
        const result = await response.json();
        
        if (!result.success || !result.dossier) {
          setError("Informations incorrectes ou accès expiré");
          return;
        }
        
        // Store the dossier and navigate to dashboard
        setDossierActif(result.dossier);
        
        toast({
          title: "Accès autorisé",
          description: "Vous avez accès aux directives anticipées",
        });
        
        navigate("/dashboard", { replace: true });
      } else {
        // Shared profile found, create a dossier object
        const dossier = {
          id: data.id,
          userId: data.user_id,
          medical_profile_id: data.medical_profile_id,
          isFullAccess: true,
          isDirectivesOnly: true,
          isMedicalOnly: false, // Add the missing required property
          profileData: {
            first_name: data.first_name,
            last_name: data.last_name,
            birth_date: data.birthdate
          },
          contenu: {
            patient: {
              nom: data.last_name,
              prenom: data.first_name,
              date_naissance: data.birthdate
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
      }
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
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
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
                
                <div className="space-y-1">
                  <label htmlFor="birthdate" className="text-sm font-medium">
                    Date de naissance
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !birthdate && "text-muted-foreground"
                        )}
                        disabled={loading}
                      >
                        {birthdate ? (
                          format(birthdate, "P", { locale: fr })
                        ) : (
                          <span>Sélectionnez une date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={birthdate}
                        onSelect={setBirthdate}
                        disabled={(date) => date > new Date() || loading}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
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

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Si vous avez un compte, vous pouvez également{" "}
              <a href="/auth" className="text-directiveplus-600 hover:underline">
                vous connecter
              </a>
              {" "}pour accéder à vos directives.
            </p>
          </div>
        </div>
      </main>
      
      <footer className="bg-white py-6 border-t mt-auto">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>© 2025 DirectivesPlus. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}
