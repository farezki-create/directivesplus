
import PageHeader from "@/components/layout/PageHeader";
import PageFooter from "@/components/layout/PageFooter";
import { InstitutionAccessFormComplete } from "@/components/institution-access/InstitutionAccessFormComplete";

export default function InstitutionAccess() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <PageHeader />
      
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="max-w-2xl mx-auto">
          <InstitutionAccessFormComplete />
        </div>
      </main>
      
      <PageFooter />
    </div>
  );
}
