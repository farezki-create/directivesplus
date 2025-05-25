
import PageHeader from "@/components/layout/PageHeader";
import PageFooter from "@/components/layout/PageFooter";
import { InstitutionAccessFormComplete } from "@/components/institution-access/InstitutionAccessFormComplete";

export default function InstitutionAccess() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <PageHeader />
      
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Accès Institution
            </h1>
            <p className="text-lg text-gray-600">
              Consultation sécurisée des directives anticipées
            </p>
          </div>
          
          <InstitutionAccessFormComplete />
        </div>
      </main>
      
      <PageFooter />
    </div>
  );
}
