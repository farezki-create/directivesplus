
import React, { useState } from "react";
import AppNavigation from "@/components/AppNavigation";
import ChatAssistant from "@/components/ChatAssistant";
import { PageHeader } from "@/components/acces-institution/PageHeader";
import { InstitutionalSubscriptionSection } from "@/components/acces-institution/InstitutionalSubscriptionSection";
import { DirectivesAccessSection } from "@/components/acces-institution/DirectivesAccessSection";
import { PalliativeCareSection } from "@/components/acces-institution/PalliativeCareSection";
import { FeedbackSection } from "@/components/acces-institution/FeedbackSection";
import { SecurityInfoSection } from "@/components/acces-institution/SecurityInfoSection";
import { ProfessionalFieldsSection } from "@/components/institution-access/ProfessionalFieldsSection";

const AccesInstitution = () => {
  const [professionalData, setProfessionalData] = useState({
    rpps: '',
    finess: '',
    adeli: '',
    prosanteConnect: false
  });

  const handleProfessionalFieldChange = (field: string, value: string | boolean) => {
    setProfessionalData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleProsanteConnect = () => {
    // Logique de connexion ProSanté Connect
    console.log('Redirection vers ProSanté Connect...');
    // Ici, on redirigerait vers l'authentification ProSanté Connect
    toast({
      title: "Redirection",
      description: "Redirection vers ProSanté Connect en cours...",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AppNavigation hideEditingFeatures={true} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <PageHeader />
          
          {/* Section d'identification professionnelle */}
          <div className="mb-8">
            <ProfessionalFieldsSection 
              formData={professionalData}
              onChange={handleProfessionalFieldChange}
              onProsanteConnect={handleProsanteConnect}
            />
          </div>
          
          {/* 1. Demande d'accès avec code patient */}
          <DirectivesAccessSection />
          
          {/* 2. Dossier soins palliatifs */}
          <PalliativeCareSection />
          
          {/* 3. Abonnement Institutionnel */}
          <InstitutionalSubscriptionSection />
          
          {/* 4. Votre avis nous intéresse */}
          <FeedbackSection />
          
          <SecurityInfoSection />
        </div>
      </main>
      
      <footer className="bg-white py-6 border-t mt-auto">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>© 2025 DirectivesPlus. Tous droits réservés.</p>
        </div>
      </footer>
      
      <ChatAssistant />
    </div>
  );
};

export default AccesInstitution;
