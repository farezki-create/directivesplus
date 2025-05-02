
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardContent, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAdvanceDirectives } from "@/hooks/useAdvanceDirectives";
import { Loader2 } from "lucide-react";

interface MedicalAccessFormProps {
  type?: "directive" | "medical";
}

export function MedicalAccessForm({ type = "directive" }: MedicalAccessFormProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [directiveId, setDirectiveId] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const { toast } = useToast();
  const { requestAccess } = useAdvanceDirectives("");
  
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!firstName || !lastName || !birthdate || !directiveId) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }
    
    setIsVerifying(true);
    try {
      if (type === "directive") {
        const content = await requestAccess(
          directiveId,
          `${firstName} ${lastName}`,
          birthdate,
          "AUTO" // Le code d'accès n'est plus requis par l'utilisateur
        );
        
        if (content) {
          toast({
            title: "Accès autorisé",
            description: "Vous pouvez maintenant consulter les directives anticipées du patient"
          });
        }
      } else {
        // Handle medical data access here
        // TODO: Implement medical data access verification
        toast({
          title: "Accès médical",
          description: "Cette fonctionnalité sera bientôt disponible"
        });
      }
    } catch (error) {
      console.error("Access verification failed:", error);
    } finally {
      setIsVerifying(false);
    }
  };
  
  const formTitle = type === "directive" ? "directives anticipées" : "données médicales";
  
  return (
    <form onSubmit={handleFormSubmit}>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="directive-id">Identifiant du document</Label>
          <Input
            id="directive-id"
            placeholder="Identifiant du document"
            value={directiveId}
            onChange={(e) => setDirectiveId(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="patient-firstname">Prénom du patient</Label>
          <Input
            id="patient-firstname"
            placeholder="Prénom du patient"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="patient-name">Nom du patient</Label>
          <Input
            id="patient-name"
            placeholder="Nom du patient"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="birthdate">Date de naissance</Label>
          <Input
            id="birthdate"
            type="date"
            value={birthdate}
            onChange={(e) => setBirthdate(e.target.value)}
            required
          />
        </div>
      </CardContent>
      
      <CardFooter>
        <Button type="submit" disabled={isVerifying} className="w-full">
          {isVerifying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Accéder aux {formTitle}
        </Button>
      </CardFooter>
    </form>
  );
}
