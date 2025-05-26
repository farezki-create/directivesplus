
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SocialFeed from "@/components/social/SocialFeed";
import ChatAssistant from "@/components/ChatAssistant";

const Community = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Communauté DirectivesPlus
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Partagez vos expériences, posez vos questions et échangez avec d'autres utilisateurs 
            sur les directives anticipées et la planification de soins.
          </p>
        </div>
        
        <SocialFeed />
      </main>
      <Footer />
      <ChatAssistant />
    </div>
  );
};

export default Community;
