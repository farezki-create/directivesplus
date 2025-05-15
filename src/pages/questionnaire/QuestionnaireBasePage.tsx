
import React from "react";
import { useParams } from "react-router-dom";
import AppNavigation from "@/components/AppNavigation";
import QuestionnaireSection from "@/components/QuestionnaireSection";
import ProtectedRoute from "@/components/ProtectedRoute";

const QuestionnaireBasePage = () => {
  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <AppNavigation />
        
        <main className="flex-grow container mx-auto px-4 py-8">
          <QuestionnaireSection />
        </main>
        
        <footer className="bg-white py-6 border-t">
          <div className="container mx-auto px-4 text-center text-gray-500">
            <p>© 2025 DirectivesPlus. Tous droits réservés.</p>
          </div>
        </footer>
      </div>
    </ProtectedRoute>
  );
};

export default QuestionnaireBasePage;
