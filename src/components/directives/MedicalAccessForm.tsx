
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardContent, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAdvanceDirectives } from "@/hooks/useAdvanceDirectives";
import { Loader2 } from "lucide-react";

export function MedicalAccessForm() {
  const [name, setName] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [directiveId, setDirectiveId] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const { toast } = useToast();
  const { requestAccess } = useAdvanceDirectives("");
  
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !birthdate || !accessCode || !directiveId) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }
    
    setIsVerifying(true);
    try {
      const content = await requestAccess(
        directiveId,
        name,
        birthdate,
        accessCode
      );
      
      if (content) {
        toast({
          title: "Accès autorisé",
          description: "Vous pouvez maintenant consulter les directives anticipées du patient"
        });
        
        // Handle displaying the directive content
        // This would typically open a PDF or render the structured content
      }
    } catch (error) {
      console.error("Access verification failed:", error);
    } finally {
      setIsVerifying(false);
    }
  };
  
  return (
    <form onSubmit={handleFormSubmit}>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="access-code">Code d'accès</Label>
          <Input
            id="access-code"
            placeholder="XXXX-XXXX"
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value)}
            required
          />
        </div>
        
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
          <Label htmlFor="patient-name">Nom du patient</Label>
          <Input
            id="patient-name"
            placeholder="Nom du patient"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
          Vérifier l'accès
        </Button>
      </CardFooter>
    </form>
  );
}
