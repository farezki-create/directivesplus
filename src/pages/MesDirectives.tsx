
import React from "react";
import Header from "@/components/Header";
import { DirectivesAccessForm } from "@/components/mes-directives/DirectivesAccessForm"; 
import LoginLink from "@/components/mes-directives/LoginLink";
import Footer from "@/components/mes-directives/Footer";

export default function MesDirectives() {
  console.log("Rendering MesDirectives - PUBLIC PAGE");

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <DirectivesAccessForm />
          <LoginLink />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
