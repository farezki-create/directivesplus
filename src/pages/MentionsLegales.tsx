
import React from 'react';
import Header from "@/components/Header";

const MentionsLegales = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-center mb-8">Mentions Légales</h1>
          
          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3">Éditeur du site</h2>
              <p className="text-gray-700">
                DirectivesPlus<br />
                Société en cours de constitution<br />
                Email : contact@directivesplus.fr
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">Hébergement</h2>
              <p className="text-gray-700">
                Ce site est hébergé par Supabase Inc.<br />
                970 Toa Payoh North #07-04<br />
                Singapore 318992
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">Propriété intellectuelle</h2>
              <p className="text-gray-700">
                L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">Données personnelles</h2>
              <p className="text-gray-700">
                Conformément à la loi "Informatique et Libertés" du 6 janvier 1978 modifiée et au Règlement Général sur la Protection des Données (RGPD), vous disposez d'un droit d'accès, de rectification et de suppression des données vous concernant.
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MentionsLegales;
