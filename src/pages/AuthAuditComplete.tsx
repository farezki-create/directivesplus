
import React from 'react';
import Header from '@/components/Header';
import { ComprehensiveAuthAudit } from '@/features/auth/audit/ComprehensiveAuthAudit';
import { BackButton } from '@/features/auth/components/BackButton';

const AuthAuditComplete = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <BackButton />
          
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Audit Complet d'Authentification
            </h1>
            <p className="text-gray-600">
              Analyse approfondie de tous les aspects de votre système d'authentification
            </p>
          </div>
          
          <ComprehensiveAuthAudit />
        </div>
      </main>
    </div>
  );
};

export default AuthAuditComplete;
