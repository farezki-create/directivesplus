
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Testimonials from "../components/Testimonials";
import Footer from "../components/Footer";

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
          <Button 
            onClick={handleAccessDocuments}
            className="bg-blue-600 hover:bg-blue-700 text-lg py-6 px-8"
          >
            Accès documents sans connexion
          </Button>
          <p className="mt-3 text-sm text-gray-600">
            Accédez aux directives anticipées ou aux données médicales avec un code d'accès
          </p>
        </div>
        <Features />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
