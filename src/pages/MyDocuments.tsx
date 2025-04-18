
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { DocumentList } from "@/components/documents/DocumentList";
import { DocumentAccess } from "@/components/documents/DocumentAccess";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function MyDocuments() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        navigate("/auth");
        return;
      }
      setUserId(session.user.id);
      setIsLoading(false);
    };
    checkAuth();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="container mx-auto py-8 px-4 flex-1 flex items-center justify-center">
          <div className="h-8 w-8 border-b-2 border-primary rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-2xl font-bold">Mes Documents</h1>
          
          {user ? (
            <Tabs defaultValue="documents">
              <TabsList className="grid w-full grid-cols-1">
                <TabsTrigger value="documents">Tous mes documents</TabsTrigger>
              </TabsList>
              
              <TabsContent value="documents" className="mt-4">
                <Card className="p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="space-y-1">
                      <h2 className="text-lg font-medium">Documents stockés</h2>
                      <p className="text-sm text-muted-foreground">
                        Vos documents PDF, Excel, texte, images et autres fichiers supportés.
                      </p>
                    </div>
                    <Button 
                      onClick={() => navigate("/document-viewer")}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <FileText className="h-4 w-4" />
                      Voir tous les documents
                    </Button>
                  </div>
                  {userId && <DocumentList userId={userId} />}
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <Tabs defaultValue="access">
              <TabsList className="grid w-full grid-cols-1">
                <TabsTrigger value="access">Accéder à un document partagé</TabsTrigger>
              </TabsList>
              
              <TabsContent value="access" className="mt-4">
                <Card className="p-6">
                  <DocumentAccess userId={userId || ""} />
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </main>
    </div>
  );
}
