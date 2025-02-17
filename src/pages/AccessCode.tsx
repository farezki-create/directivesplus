
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export default function AccessCode() {
  const [code, setCode] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!code) {
      toast({
        variant: "destructive",
        title: "Code requis",
        description: "Veuillez entrer un code d'accès",
      });
      return;
    }

    // Here you would normally validate the code
    navigate("/dashboard");
  };

  return (
    <div className="container flex items-center justify-center min-h-screen py-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Code d'accès</CardTitle>
          <CardDescription>
            Entrez votre code d'accès pour consulter les directives
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Entrez votre code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full">
              Accéder aux directives
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
