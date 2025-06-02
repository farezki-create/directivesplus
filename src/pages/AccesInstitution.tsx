
import React from "react";
import AppNavigation from "@/components/AppNavigation";
import ChatAssistant from "@/components/ChatAssistant";
import { PageHeader } from "@/components/acces-institution/PageHeader";
import { EmrIntegrationSection } from "@/components/acces-institution/EmrIntegrationSection";
import { InstitutionalSubscriptionSection } from "@/components/acces-institution/InstitutionalSubscriptionSection";
import { DirectivesAccessSection } from "@/components/acces-institution/DirectivesAccessSection";
import { PalliativeCareSection } from "@/components/acces-institution/PalliativeCareSection";
import { FeedbackSection } from "@/components/acces-institution/FeedbackSection";
import { SecurityInfoSection } from "@/components/acces-institution/SecurityInfoSection";

const AccesInstitution = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <AppNavigation hideEditingFeatures={true} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <PageHeader />
          <EmrIntegrationSection />
          <InstitutionalSubscriptionSection />
          <DirectivesAccessSection />
          <PalliativeCareSection />
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
