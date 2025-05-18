
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, MessageSquare, Star } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CommentsList from "@/components/CommentsList";
import CommentForm from "@/components/CommentForm";

const Comments = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="flex items-center gap-2"
          >
            <Home size={16} />
            Retour à l'accueil
          </Button>
        </div>
        
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-directiveplus-800 mb-4">
              Commentaires et avis
            </h1>
            <p className="text-gray-600 text-lg">
              Découvrez ce que pensent nos utilisateurs et partagez votre propre expérience
            </p>
          </div>
          
          {/* Affichage des commentaires */}
          <CommentsList />
          
          {/* Formulaire pour ajouter un commentaire */}
          <div className="mt-16 bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold text-directiveplus-700 mb-6 flex items-center">
              <MessageSquare className="mr-2" size={24} />
              Partagez votre expérience
            </h2>
            <CommentForm />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Comments;
