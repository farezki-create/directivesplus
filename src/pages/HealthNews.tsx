
import React from 'react';
import PageHeader from '@/components/layout/PageHeader';
import PageFooter from '@/components/layout/PageFooter';
import { Construction } from 'lucide-react';

const HealthNews = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center py-20">
          <div className="text-center max-w-2xl mx-auto">
            <img 
              src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
              alt="Page en construction" 
              className="w-full max-w-md mx-auto mb-8 rounded-lg shadow-lg"
            />
            
            <div className="flex items-center justify-center gap-3 mb-6">
              <Construction className="h-8 w-8 text-directiveplus-600" />
              <h1 className="text-3xl font-bold text-gray-900">
                Page en construction
              </h1>
            </div>
            
            <p className="text-xl text-gray-600 mb-4">
              La section Actualités Santé est en cours de développement
            </p>
            
            <p className="text-gray-500">
              Cette page sera bientôt disponible avec les dernières informations et conseils santé.
            </p>
          </div>
        </div>
      </div>

      <PageFooter />
    </div>
  );
};

export default HealthNews;
