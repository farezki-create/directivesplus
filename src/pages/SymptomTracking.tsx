
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import AppNavigation from "@/components/AppNavigation";
import SymptomForm from "@/components/symptom/SymptomForm";
import SymptomHistory from "@/components/symptom/SymptomHistory";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SymptomTracking = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    navigate("/auth");
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <AppNavigation />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="outline"
            onClick={() => navigate("/donnees-medicales")}
            className="flex items-center gap-2 mb-6"
          >
            <ArrowLeft size={16} />
            Retour aux données médicales
          </Button>
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-directiveplus-800 mb-4">
              Suivi en Soins Palliatifs/HAD
            </h1>
            <p className="text-lg text-gray-600">
              Suivez vos symptômes au quotidien pour améliorer votre prise en charge
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <SymptomForm />
            </div>
            <div>
              <SymptomHistory />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SymptomTracking;
