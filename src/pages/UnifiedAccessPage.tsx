
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { UnifiedAccessForm } from "@/components/access/UnifiedAccessForm";

const UnifiedAccessPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <UnifiedAccessForm
          title="Accès aux directives anticipées"
          description="Veuillez entrer vos informations et le code d'accès fourni pour accéder aux directives anticipées"
          accessOptions={{
            accessType: 'directives',
            redirectPath: '/directives-docs'
          }}
        />
      </main>
      <Footer />
    </div>
  );
};

export default UnifiedAccessPage;
