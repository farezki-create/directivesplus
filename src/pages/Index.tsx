
import React from 'react';
import IndexHeader from "@/components/sections/IndexHeader";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen">
      <IndexHeader />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-directiveplus-800 mb-6">
            Vos directives anticipées en toute simplicité
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Rédigez vos directives anticipées et désignez vos personnes de confiance en quelques étapes simples et sécurisées.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!isAuthenticated ? (
              <>
                <Link to="/auth">
                  <Button size="lg" className="bg-directiveplus-600 hover:bg-directiveplus-700 text-white px-8 py-3">
                    Commencer maintenant
                  </Button>
                </Link>
                <Link to="/otp-auth">
                  <Button variant="outline" size="lg" className="px-8 py-3">
                    Connexion par email
                  </Button>
                </Link>
              </>
            ) : (
              <Link to="/rediger">
                <Button size="lg" className="bg-directiveplus-600 hover:bg-directiveplus-700 text-white px-8 py-3">
                  Accéder à mes directives
                </Button>
              </Link>
            )}
          </div>
        </div>
        
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-directiveplus-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-directiveplus-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Simple et Rapide</h3>
            <p className="text-gray-600">Rédigez vos directives en quelques minutes grâce à notre interface intuitive</p>
          </div>
          
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-directiveplus-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-directiveplus-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Sécurisé</h3>
            <p className="text-gray-600">Vos données sont protégées par un chiffrement de niveau bancaire</p>
          </div>
          
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-directiveplus-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-directiveplus-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Accessible</h3>
            <p className="text-gray-600">Vos proches et professionnels de santé peuvent y accéder facilement</p>
          </div>
        </div>
      </main>
      
      <footer className="bg-directiveplus-50 py-8 border-t">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-4">
            <img 
              src="/lovable-uploads/d5255c41-98e6-44a5-82fd-dac019e499ef.png" 
              alt="DirectivesPlus" 
              className="h-12 w-auto"
            />
          </div>
          <p className="text-gray-600">© 2025 DirectivesPlus. Tous droits réservés.</p>
          <div className="flex justify-center space-x-6 mt-4">
            <Link to="/mentions-legales" className="text-gray-500 hover:text-directiveplus-600">
              Mentions légales
            </Link>
            <Link to="/politique-confidentialite" className="text-gray-500 hover:text-directiveplus-600">
              Politique de confidentialité
            </Link>
            <Link to="/conditions-generales-utilisation" className="text-gray-500 hover:text-directiveplus-600">
              CGU
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
