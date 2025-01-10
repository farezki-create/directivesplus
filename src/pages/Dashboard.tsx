import { Header } from "@/components/Header";
import { DirectivesForm } from "@/components/DirectivesForm";
import { TrustedPersons } from "@/components/TrustedPersons";
import { PDFGenerator } from "@/components/PDFGenerator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Dashboard = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Tableau de bord
        </h1>

        <Tabs defaultValue="directives" className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="directives">Directives anticipées</TabsTrigger>
            <TabsTrigger value="persons">Personnes de confiance</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>
          
          <TabsContent value="directives" className="mt-6">
            <DirectivesForm />
          </TabsContent>
          
          <TabsContent value="persons" className="mt-6">
            <TrustedPersons />
          </TabsContent>
          
          <TabsContent value="documents" className="mt-6">
            <PDFGenerator />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;