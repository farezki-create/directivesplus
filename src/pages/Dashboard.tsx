
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [userId, setUserId] = useState<string | null>(null);
  const [showSignatureDialog, setShowSignatureDialog] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  
  // Determine which tab should be active based on URL query params
  const searchParams = new URLSearchParams(location.search);
  const defaultTab = searchParams.get('tab') === 'persons' ? 'trusted-persons' : 'directives';

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        navigate("/auth");
        return;
      }
      setUserId(session.user.id);
    };
    checkAuth();
  }, [navigate]);

  if (!userId) {
    return null;
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

        <Tabs defaultValue={defaultTab}>
          <TabsList>
            <TabsTrigger value="directives">Mes directives</TabsTrigger>
            <TabsTrigger value="trusted-persons">Mes personnes de confiance</TabsTrigger>
          </TabsList>
          <TabsContent value="directives" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Mes directives anticipées</CardTitle>
                <CardDescription>
                  Générez et visualisez vos directives anticipées.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <PDFGenerator userId={userId} onPdfGenerated={setPdfUrl} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="trusted-persons" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Mes personnes de confiance</CardTitle>
                <CardDescription>
                  Ajoutez et gérez vos personnes de confiance.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TrustedPersonForm onSave={() => console.log("Personne de confiance enregistrée")} />
                <TrustedPersonsList 
                  persons={[]} 
                  onRemove={() => console.log("Personne de confiance supprimée")} 
                />
              </CardContent>
              <CardFooter>
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
