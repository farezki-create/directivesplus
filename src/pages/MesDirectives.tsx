
import React, { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { DirectivesAccessForm } from "@/components/mes-directives/DirectivesAccessForm"; 
import LoginLink from "@/components/mes-directives/LoginLink";
import Footer from "@/components/Footer";

export default function MesDirectives() {
  console.log("Rendering MesDirectives - PUBLIC PAGE");
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  
  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (isAuthenticated && user) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="max-w-md mx-auto">
          <DirectivesAccessForm />
          <LoginLink />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
