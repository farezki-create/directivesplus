
import { useEffect } from "react";
import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useMedicalData } from "@/hooks/useMedicalData";
import { useAuth } from "@/hooks/useAuth";
import { MedicalDataList } from "@/components/medical/MedicalDataList";
import { MedicalDataForm } from "@/components/medical/MedicalDataForm";

export default function MedicalData() {
  const { user } = useAuth();
  const { medicalData, isLoading, fetchMedicalData } = useMedicalData(user?.id || "");

  useEffect(() => {
    if (user) {
      fetchMedicalData();
    }
  }, [user]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Mes Données Médicales</h1>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Ajouter des données
            </Button>
          </div>
          
          <Card className="p-6">
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
        </div>
      </main>
    </div>
  );
}
