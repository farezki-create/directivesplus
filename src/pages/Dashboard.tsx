
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrustedPersonsList } from "@/components/trusted-persons/TrustedPersonsList";
import { TrustedPersonForm } from "@/components/trusted-persons/TrustedPersonForm";
import { TrustedPersonPDFGenerator } from "@/components/trusted-persons/TrustedPersonPDFGenerator";
import { PDFGenerator } from "@/components/PDFGenerator";
import { SignatureDialog } from "@/components/signature/SignatureDialog";
import { FileText, PenTool, FileUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { NewTrustedPerson, TrustedPerson } from "@/types/trusted-person";

export default function Dashboard() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [showSignatureDialog, setShowSignatureDialog] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [trustedPersons, setTrustedPersons] = useState<TrustedPerson[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          navigate("/auth");
          return;
        }
        setUserId(session.user.id);
      } catch (error) {
        console.error("Error checking auth:", error);
        navigate("/auth");
      }
    };
    checkAuth();
  }, [navigate]);

  useEffect(() => {
    if (userId) {
      fetchTrustedPersons();
    }
  }, [userId]);

  const fetchTrustedPersons = async () => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from("trusted_persons")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: true });

      if (error) {
        throw error;
      }

      setTrustedPersons(data.map(p => ({
        id: p.id,
        name: p.name,
        phone: p.phone,
        email: p.email,
        relation: p.relation || "",
        address: p.address || "",
        city: p.city || "",
        postal_code: p.postal_code || "",
      })));
    } catch (error) {
      console.error("Error loading trusted persons:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les personnes de confiance.",
        variant: "destructive",
      });
    }
  };

  const handleSaveTrustedPerson = async (person: NewTrustedPerson) => {
    if (!userId) return;

    try {
      if (trustedPersons.length > 0) {
        toast({
          title: "Erreur",
          description: "Vous ne pouvez désigner qu'une seule personne de confiance.",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase
        .from("trusted_persons")
        .insert({
          user_id: userId,
          name: person.name,
          phone: person.phone,
          email: person.email,
          relation: person.relation,
          address: person.address,
          city: person.city,
          postal_code: person.postal_code,
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      await fetchTrustedPersons();
      toast({
        title: "Succès",
        description: "La personne de confiance a été enregistrée.",
      });
    } catch (error) {
      console.error("Error saving trusted person:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer la personne de confiance.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveTrustedPerson = async (id: string) => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from("trusted_persons")
        .delete()
        .eq("id", id);

      if (error) {
        throw error;
      }

      await fetchTrustedPersons();
      toast({
        title: "Succès",
        description: "La personne de confiance a été supprimée.",
      });
    } catch (error) {
      console.error("Error removing trusted person:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la personne de confiance.",
        variant: "destructive",
      });
    }
  };

  if (!userId) {
    return (
      <div className="container mx-auto py-8">
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Tableau de bord</h2>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowSignatureDialog(true)}
              className="flex items-center gap-2"
            >
              <PenTool className="h-4 w-4" />
              Ma signature
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate('/pdf-management')}
              className="flex items-center gap-2"
            >
              <FileUp className="h-4 w-4" />
              Mes documents PDF
            </Button>
          </div>
        </div>

        <Tabs defaultValue="directives">
          <TabsList>
            <TabsTrigger value="directives">Mes directives</TabsTrigger>
            <TabsTrigger value="trusted-persons">Personnes de confiance</TabsTrigger>
          </TabsList>
          
          <TabsContent value="directives" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Mes directives anticipées</CardTitle>
                <CardDescription>
                  Générez vos directives anticipées au format PDF
                </CardDescription>
              </CardHeader>
              <CardContent>
                {userId && (
                  <div className="flex flex-col gap-4">
                    <PDFGenerator userId={userId} onPdfGenerated={setPdfUrl} />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="trusted-persons" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Personnes de confiance</CardTitle>
                <CardDescription>
                  Désignez vos personnes de confiance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {trustedPersons.length === 0 && (
                  <TrustedPersonForm onSave={handleSaveTrustedPerson} />
                )}
                <TrustedPersonsList 
                  persons={trustedPersons} 
                  onRemove={handleRemoveTrustedPerson} 
                />
              </CardContent>
              <CardFooter className="justify-between border-t pt-4">
                <p className="text-sm text-muted-foreground">
                  Vous pouvez désigner jusqu'à 5 personnes de confiance.
                </p>
                {/* TrustedPersonPDFGenerator est utilisé sans props */}
                <TrustedPersonPDFGenerator />
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {userId && (
        <SignatureDialog 
          open={showSignatureDialog} 
          onOpenChange={setShowSignatureDialog}
          userId={userId}
        />
      )}
    </div>
  );
}
