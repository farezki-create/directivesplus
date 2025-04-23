
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { DocumentList } from "@/components/documents/DocumentList";
import { DocumentAccess } from "@/components/documents/DocumentAccess";
import { DocumentActions } from "@/components/documents/DocumentActions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { PDFPreviewDialog } from "@/components/pdf/PDFPreviewDialog";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

export default function MyDocuments() {
  const navigate = useNavigate();
  const location = useLocation();
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const accessData = location.state?.accessData;
  
  // For direct document preview from external access
  const [showDirectPreview, setShowDirectPreview] = useState(false);
  const [directPreviewUrl, setDirectPreviewUrl] = useState<string | null>(null);
  const [directExternalId, setDirectExternalId] = useState<string | null>(null);
  
  console.log("Access data from location:", accessData);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user && !accessData) {
        navigate("/auth");
        return;
      }
      setUserId(session?.user?.id || null);
      setIsLoading(false);
    };
    checkAuth();
    
    // Store document URL from external access but don't show preview automatically
    if (accessData?.documentUrl) {
      console.log("Setting up direct preview with URL:", accessData.documentUrl);
      setDirectPreviewUrl(accessData.documentUrl);
      setDirectExternalId(accessData.externalDocumentId || null);
      // Don't automatically open the preview
      // setShowDirectPreview(true);
    }
  }, [navigate, accessData]);

  const handleAddMedicalDocument = () => {
    navigate("/document-viewer");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-2xl font-bold">
            {accessData ? "Documents Partagés" : "Mes Documents"}
          </h1>
          
          {accessData?.documentUrl && (
            <Card className="p-4 border-2 border-blue-200 bg-blue-50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-blue-800">Document partagé disponible</h3>
                  <p className="text-sm text-gray-600">
                    Un document a été partagé avec vous. Cliquez sur le bouton pour le visualiser.
                  </p>
                </div>
                <Button 
                  onClick={() => setShowDirectPreview(true)}
                  className="flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Voir le document
                </Button>
              </div>
            </Card>
          )}
          
          {user || accessData ? (
            <Tabs defaultValue="documents">
              <TabsList className="grid w-full grid-cols-1">
                <TabsTrigger value="documents">
                  {accessData ? "Documents partagés" : "Tous mes documents"}
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="documents" className="mt-4">
                <Card className="p-6">
                  {!accessData && (
                    <DocumentActions onAddMedicalDocument={handleAddMedicalDocument} />
                  )}
                  {userId && (
                    <DocumentList 
                      userId={userId} 
                      initialDocuments={accessData?.documents}
                    />
                  )}
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
      
      {showDirectPreview && directPreviewUrl && (
        <PDFPreviewDialog
          open={showDirectPreview}
          onOpenChange={setShowDirectPreview}
          pdfUrl={directPreviewUrl}
          externalDocumentId={directExternalId}
        />
      )}
    </div>
  );
}
