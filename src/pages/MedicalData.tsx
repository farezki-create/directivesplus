
import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, X, UploadCloud, FileText } from "lucide-react";
import { useMedicalData } from "@/hooks/useMedicalData";
import { useAuth } from "@/hooks/useAuth";
import { MedicalDataList } from "@/components/medical/MedicalDataList";
import { MedicalDataForm } from "@/components/medical/MedicalDataForm";
import { MedicalQuestionnaire } from "@/components/medical/MedicalQuestionnaire";
import { DocumentScanner } from "@/components/DocumentScanner";

export default function MedicalData() {
  const { user } = useAuth();
  const { medicalData, isLoading, fetchMedicalData } = useMedicalData(user?.id || "");
  const [activeTab, setActiveTab] = useState("data");
  const [showForm, setShowForm] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

  useEffect(() => {
    if (user) {
      fetchMedicalData();
    }
  }, [user]);

  const handleFormToggle = () => {
    setShowForm(!showForm);
    setActiveTab("data");
  };

  const handleDataSaved = () => {
    setShowForm(false);
    fetchMedicalData();
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
                onClick={handleFormToggle}
              >
                {showForm ? (
                  <>
                    <X className="h-4 w-4" />
                    Annuler
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    Ajouter des données
                  </>
                )}
              </Button>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="data">Données médicales</TabsTrigger>
              <TabsTrigger value="questionnaire">
                <span className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Questionnaire médical
                </span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="data">
              {showForm && (
                <MedicalDataForm onDataSaved={handleDataSaved} />
              )}
              
              <Card className="p-6 mt-4">
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
              </Card>
            </TabsContent>
            
            <TabsContent value="questionnaire">
              <MedicalQuestionnaire />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <DocumentScanner 
        open={showScanner}
        onClose={() => setShowScanner(false)}
      />
    </div>
  );
}
