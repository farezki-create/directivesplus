
import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, X, UploadCloud } from "lucide-react";
import { useMedicalData } from "@/hooks/useMedicalData";
import { useAuth } from "@/hooks/useAuth";
import { MedicalDataList } from "@/components/medical/MedicalDataList";
import { MedicalQuestionnaire } from "@/components/medical/MedicalQuestionnaire";
import { DocumentScanner } from "@/components/DocumentScanner";
import { FrenchFlag } from "@/components/ui/FrenchFlag";
import { useMedicalDocuments } from "@/hooks/useMedicalDocuments";
import { MedicalDocumentsList } from "@/components/medical/MedicalDocumentsList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MedicalCardGenerator } from "@/components/medical/MedicalCardGenerator";

export default function MedicalData() {
  const { user } = useAuth();
  const { medicalData, isLoading, fetchMedicalData } = useMedicalData(user?.id || "");
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("data");
  
  const { 
    documents, 
    loading: documentsLoading, 
    previewUrl,
    previewOpen,
    setPreviewOpen,
    fetchDocuments,
    previewDocument,
    deleteDocument
  } = useMedicalDocuments(user?.id || "");

  useEffect(() => {
    if (user) {
      console.log("Loading medical data for user:", user.id);
      fetchMedicalData();
      fetchDocuments();
    }
  }, [user]);

  const handleQuestionnaireToggle = () => {
    setShowQuestionnaire(!showQuestionnaire);
  };

  const handleDataSaved = () => {
    console.log("Data saved, refreshing...");
    setShowQuestionnaire(false);
    fetchMedicalData();
    fetchDocuments();
  };
  
  const handleDocumentAdded = () => {
    console.log("Document added, refreshing documents...");
    fetchDocuments();
    setActiveTab("documents");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex justify-between items-center flex-wrap gap-3">
            <h1 className="text-2xl font-bold">Mes Données Médicales</h1>
            <div className="flex gap-3">
              <Button 
                className="flex items-center gap-2"
                variant="outline"
                onClick={() => setShowScanner(true)}
              >
                <UploadCloud className="h-4 w-4" />
                Ajouter un document médical
              </Button>
              <Button 
                className="flex items-center gap-2"
                onClick={handleQuestionnaireToggle}
              >
                {showQuestionnaire ? (
                  <>
                    <X className="h-4 w-4" />
                    Annuler
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    Questionnaire médical
                  </>
                )}
              </Button>
            </div>
          </div>
          
          {showQuestionnaire && (
            <MedicalQuestionnaire onDataSaved={handleDataSaved} />
          )}
          
          <Card className="p-6 mt-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Actions</h2>
              <MedicalCardGenerator medicalData={medicalData} />
            </div>
            
            <Tabs
              defaultValue="data"
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="data">Questionnaire médical</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
              </TabsList>
              
              <TabsContent value="data">
                {isLoading ? (
                  <div className="text-center">Chargement...</div>
                ) : (
                  <>
                    {medicalData.length > 0 ? (
                      <MedicalDataList data={medicalData} />
                    ) : (
                      <div className="text-center text-muted-foreground">
                        Aucune donnée médicale enregistrée
                      </div>
                    )}
                  </>
                )}
              </TabsContent>
              
              <TabsContent value="documents">
                {documentsLoading ? (
                  <div className="text-center">Chargement...</div>
                ) : (
                  <MedicalDocumentsList
                    documents={documents}
                    previewUrl={previewUrl}
                    previewOpen={previewOpen}
                    setPreviewOpen={setPreviewOpen}
                    onPreview={previewDocument}
                    onDelete={deleteDocument}
                  />
                )}
              </TabsContent>
            </Tabs>
          </Card>
          
          {/* Security info section */}
          <div className="mt-8 text-center text-sm text-muted-foreground flex flex-col items-center">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-semibold">100% sécurisé</span>
              <FrenchFlag />
            </div>
            <p>
              Vos données médicales sont hébergées en France 
              dans le serveur Scalingo, certifiés HDS par les autorités de santé.
            </p>
          </div>
        </div>
      </main>

      <DocumentScanner 
        open={showScanner}
        onClose={() => setShowScanner(false)}
        onDocumentAdded={handleDocumentAdded}
      />
    </div>
  );
}
