import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DirectivesForm } from "@/components/DirectivesForm";
import { TrustedPersons } from "@/components/TrustedPersons";
import { PDFGenerator } from "@/components/PDFGenerator";

export const DashboardTabs = () => {
  return (
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
  );
};