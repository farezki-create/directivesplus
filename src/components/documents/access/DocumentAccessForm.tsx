
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { FileText, Loader2 } from "lucide-react";

interface DocumentAccessFormProps {
  onSubmit: (formData: {
    firstName: string;
    lastName: string;
    birthDate: string;
    accessId: string;
  }) => Promise<void>;
  isVerifying: boolean;
}

export function DocumentAccessForm({ onSubmit, isVerifying }: DocumentAccessFormProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [accessId, setAccessId] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!firstName || !lastName || !birthDate || !accessId) {
      toast({
        title: "Formulaire incomplet",
        description: "Veuillez remplir tous les champs",
        variant: "destructive"
      });
      return;
    }

    await onSubmit({ firstName, lastName, birthDate, accessId });
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">Prénom</Label>
            <Input 
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Prénom du patient"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="lastName">Nom</Label>
            <Input
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Nom du patient"
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="birthDate">Date de naissance</Label>
          <Input
            id="birthDate"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            placeholder="JJ/MM/AAAA"
            type="date"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="accessId">Code d'accès</Label>
          <Input
            id="accessId"
            value={accessId}
            onChange={(e) => setAccessId(e.target.value)}
            placeholder="Entrez le code d'accès qui vous a été communiqué"
            required
          />
        </div>
        
        <Button type="submit" className="w-full" disabled={isVerifying}>
          {isVerifying ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Vérification en cours...
            </>
          ) : (
            <>
              <FileText className="h-4 w-4 mr-2" />
              Accéder aux documents
            </>
          )}
        </Button>
      </form>
    </Card>
  );
}
