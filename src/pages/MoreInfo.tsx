
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MoreInfo = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
          
          <h1 className="text-3xl font-bold mb-6">
            Les directives anticipées
          </h1>
          
          <div className="border rounded-lg overflow-hidden shadow-md">
            <iframe 
              src="/assets/documents/directives_anticipees.pdf" 
              className="w-full h-[800px]"
              title="Directives anticipées"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default MoreInfo;
