
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

export default function MedicalData() {
  const { user } = useAuth();
  const { medicalData, isLoading, fetchMedicalData } = useMedicalData(user?.id || "");
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

  useEffect(() => {
    if (user) {
      fetchMedicalData();
    }
  }, [user]);

  const handleQuestionnaireToggle = () => {
    setShowQuestionnaire(!showQuestionnaire);
  };

  const handleDataSaved = () => {
    setShowQuestionnaire(false);
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
          
          {/* Security info section */}
          <div className="mt-8 text-center text-sm text-muted-foreground flex flex-col items-center">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-semibold">100% sécurisé</span>
              <FrenchFlag />
            </div>
            <p>
              Vos directives anticipées et documents de santé sont hébergés en France 
              dans le serveur Scalingo, certifiés HDS par les autorités de santé.
            </p>
          </div>
        </div>
      </main>

      <DocumentScanner 
        open={showScanner}
        onClose={() => setShowScanner(false)}
      />
    </div>
  );
}
