
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card,
  CardContent,
  CardFooter
} from "@/components/ui/card";

interface DirectivesAccessFormProps {
  onSubmit: (accessCode: string, formData: any) => void;
}

const DirectivesAccessForm: React.FC<DirectivesAccessFormProps> = ({ onSubmit }) => {
  const [accessCode, setAccessCode] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!accessCode.trim() || !firstName.trim() || !lastName.trim()) {
      return;
    }
    
    setLoading(true);
    
    // Pass form data to parent component
    onSubmit(accessCode, { firstName, lastName });
    
    setLoading(false);
  };

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 pt-4">
          <div>
            <label htmlFor="accessCode" className="block mb-1 text-sm font-medium">
              Code d'accès aux directives
            </label>
            <Input 
              id="accessCode"
              type="text"
              placeholder="Entrez le code d'accès"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              required
              className="w-full"
            />
          </div>
          
          <div>
            <label htmlFor="firstName" className="block mb-1 text-sm font-medium">
              Prénom du consultant
            </label>
            <Input 
              id="firstName"
              type="text"
              placeholder="Votre prénom"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="w-full"
            />
          </div>
          
          <div>
            <label htmlFor="lastName" className="block mb-1 text-sm font-medium">
              Nom du consultant
            </label>
            <Input 
              id="lastName"
              type="text"
              placeholder="Votre nom"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="w-full"
            />
          </div>
        </CardContent>
        
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full"
            disabled={loading}
          >
            {loading ? "Vérification..." : "Accéder aux directives anticipées"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default DirectivesAccessForm;
