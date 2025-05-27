
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SocialFeed from "@/components/social/SocialFeed";
import ChatAssistant from "@/components/ChatAssistant";
import { Users, MessageSquare, Heart, Share2 } from "lucide-react";

const Community = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-white/20 rounded-full p-4">
              <img 
                src="/lovable-uploads/19f27f8b-f7ef-4752-bd9c-a0def22bc959.png" 
                alt="Communauté DirectivesPlus" 
                className="h-16 w-16"
              />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Communauté DirectivesPlus
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
            Connectez-vous avec d'autres personnes, partagez vos expériences et trouvez du soutien 
            dans votre démarche de planification de soins de santé.
          </p>
        </div>
      </div>

      {/* Features */}
      <div className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-purple-50 rounded-lg">
              <div className="bg-purple-100 rounded-full p-3 w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Échanges</h3>
              <p className="text-sm text-gray-600">
                Partagez vos expériences avec la communauté
              </p>
            </div>

            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <div className="bg-blue-100 rounded-full p-3 w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Discussions</h3>
              <p className="text-sm text-gray-600">
                Posez vos questions et obtenez des réponses
              </p>
            </div>

            <div className="text-center p-6 bg-pink-50 rounded-lg">
              <div className="bg-pink-100 rounded-full p-3 w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <Heart className="h-6 w-6 text-pink-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Soutien</h3>
              <p className="text-sm text-gray-600">
                Trouvez du réconfort et de l'encouragement
              </p>
            </div>

            <div className="text-center p-6 bg-green-50 rounded-lg">
              <div className="bg-green-100 rounded-full p-3 w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <Share2 className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Partage</h3>
              <p className="text-sm text-gray-600">
                Aidez les autres avec votre expérience
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto py-8 px-4">        
        <SocialFeed />
      </main>
      
      <Footer />
      <ChatAssistant />
    </div>
  );
};

export default Community;
