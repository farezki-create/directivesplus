import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const AccessCode = () => {
  const [accessCode, setAccessCode] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    console.log("[AccessCode] Validating access code:", accessCode);

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id")
        .eq("unique_identifier", accessCode)
        .single();

      if (error || !data) {
        console.error("[AccessCode] Invalid access code:", error);
        toast({
          title: "Code d'accès invalide",
          description: "Veuillez vérifier votre code d'accès et réessayer.",
          variant: "destructive",
        });
        return;
      }

      console.log("[AccessCode] Valid access code, navigating to documents");
      navigate(`/documents/${data.id}`);
    } catch (error) {
      console.error("[AccessCode] Error validating access code:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md p-6 space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">Accès aux documents</h1>
          <p className="text-muted-foreground">
            Entrez votre code d'accès pour consulter les documents
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Code d'accès"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              disabled={loading}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Vérification..." : "Accéder aux documents"}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default AccessCode;