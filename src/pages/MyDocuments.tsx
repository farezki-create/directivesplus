
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
    
    // Check if we have a direct document URL from external access
    if (accessData?.documentUrl) {
      console.log("Setting up direct preview with URL:", accessData.documentUrl);
      setDirectPreviewUrl(accessData.documentUrl);
      setDirectExternalId(accessData.externalDocumentId || null);
      setShowDirectPreview(true);
    }
  }, [navigate, accessData]);

  const handleAddMedicalDocument = () => {
    navigate("/document-viewer");
  };

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
          <h1 className="text-2xl font-bold">
            {accessData ? "Documents Partagés" : "Mes Documents"}
          </h1>
          
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
                      restrictedAccess={accessData}
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
