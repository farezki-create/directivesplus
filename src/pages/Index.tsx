
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Footer from "../components/Footer";
import DirectivesInfo from "../components/DirectivesInfo";
import { FileText, MessageSquare } from "lucide-react";
import Testimonials from "../components/Testimonials";

const Index = () => {
  const navigate = useNavigate();

  const handleAccessDocuments = () => {
    navigate("/acces-document");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Hero />
        {/* Bouton d'accès aux documents */}
        <div className="container mx-auto py-8 text-center">
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Button 
              onClick={handleAccessDocuments}
              className="bg-directiveplus-600 hover:bg-directiveplus-700 text-lg py-6 px-8"
            >
              <FileText className="mr-2" size={20} />
              Accès documents sans connexion
            </Button>
            
            <Button 
              onClick={() => navigate('/temoignages')}
              variant="outline"
              className="border-directiveplus-600 text-directiveplus-700 hover:bg-directiveplus-50 text-lg py-6 px-8"
            >
              <MessageSquare className="mr-2" size={20} />
              Voir les témoignages
            </Button>
          </div>
          <p className="mt-3 text-sm text-gray-600">
            Accédez aux directives anticipées ou aux données médicales avec un code d'accès
          </p>
        </div>
        <section id="en-savoir-plus" className="bg-gray-50 py-16">
          <DirectivesInfo />
        </section>
        <Features />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
