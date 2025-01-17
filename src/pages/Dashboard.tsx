import { Header } from "@/components/Header";
import { TrustedPersons } from "@/components/TrustedPersons";
import { PDFGenerator } from "@/components/PDFGenerator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MainButtons } from "@/components/home/MainButtons";
import { DialogManager } from "@/components/home/DialogManager";
import { useDialogState } from "@/hooks/useDialogState";

const Dashboard = () => {
  const dialogState = useDialogState();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Tableau de bord
        </h1>

        <Tabs defaultValue="persons" className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="persons">Personnes de confiance</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>
          
          <TabsContent value="persons" className="mt-6">
            <TrustedPersons />
          </TabsContent>
          
          <TabsContent value="documents" className="mt-6">
            <MainButtons 
              onGeneralOpinionClick={() => dialogState.setExplanationOpen(true)}
              onLifeSupportClick={() => dialogState.setLifeSupportExplanationOpen(true)}
              onAdvancedIllnessClick={() => dialogState.setAdvancedIllnessExplanationOpen(true)}
              onPreferencesClick={() => dialogState.setPreferencesExplanationOpen(true)}
            />
            <PDFGenerator />
          </TabsContent>
        </Tabs>

        <DialogManager />
      </main>
    </div>
  );
};

export default Dashboard;