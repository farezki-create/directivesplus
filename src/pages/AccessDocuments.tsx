
import AccessDocumentForm from "@/components/access/AccessDocumentForm";
import PageHeader from "@/components/layout/PageHeader";
import PageFooter from "@/components/layout/PageFooter";

const AccessDocuments = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <PageHeader />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <AccessDocumentForm />
      </main>
      
      <PageFooter />
    </div>
  );
};

export default AccessDocuments;
