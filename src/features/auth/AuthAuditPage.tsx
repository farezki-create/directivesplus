
import React from 'react';
import Header from '@/components/Header';
import { BackButton } from './components/BackButton';
import { SupabaseEmailAudit } from './audit/SupabaseEmailAudit';

const AuthAuditPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <BackButton />
          
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Audit Email Supabase
            </h1>
            <p className="text-gray-600">
              Diagnostic complet pour identifier les problèmes d'envoi d'emails de confirmation
            </p>
          </div>
          
          <SupabaseEmailAudit />
        </div>
      </main>
    </div>
  );
};

export default AuthAuditPage;
