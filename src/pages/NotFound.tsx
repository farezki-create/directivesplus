
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-6xl font-bold text-directiveplus-600 mb-4">404</h1>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Page non trouvée</h2>
            <p className="text-gray-600">
              La page que vous cherchez n'existe pas ou a été déplacée.
            </p>
          </div>
          
          <div className="space-y-4">
            <Link to="/">
              <Button className="w-full bg-directiveplus-600 hover:bg-directiveplus-700">
                Retour à l'accueil
              </Button>
            </Link>
            <Link to="/rediger">
              <Button variant="outline" className="w-full">
                Mes directives
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NotFound;
