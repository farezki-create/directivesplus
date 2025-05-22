
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Hero from "../components/Hero";
import Footer from "../components/Footer";
import { MessageSquare } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Hero />
        
        {/* Bouton Voir commentaires en bas de page */}
        <div className="container mx-auto py-8 text-center mb-8">
          <Button 
            onClick={() => navigate('/commentaires')}
            variant="outline"
            className="border-directiveplus-600 text-directiveplus-700 hover:bg-directiveplus-50 text-lg py-6 px-8"
          >
            <MessageSquare className="mr-2" size={20} />
            Voir les commentaires
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
