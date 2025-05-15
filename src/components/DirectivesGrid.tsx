import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, BookOpenCheck, UserCog, FileText } from "lucide-react";

const DirectivesGrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Link to="/avis-general" className="group">
        <div className="bg-white border rounded-lg p-6 shadow-sm transition-all hover:shadow-md flex flex-col items-center justify-center text-center h-full">
          <div className="bg-blue-100 p-3 rounded-full mb-4">
            <ShieldCheck className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-lg mb-2">Avis Général</h3>
          <p className="text-gray-600 text-sm">
            Exprimez vos préférences générales concernant votre santé et vos soins.
          </p>
        </div>
      </Link>

      <Link to="/maintien-vie" className="group">
        <div className="bg-white border rounded-lg p-6 shadow-sm transition-all hover:shadow-md flex flex-col items-center justify-center text-center h-full">
          <div className="bg-green-100 p-3 rounded-full mb-4">
            <BookOpenCheck className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="font-semibold text-lg mb-2">Maintien en Vie</h3>
          <p className="text-gray-600 text-sm">
            Spécifiez vos souhaits concernant les traitements de maintien en vie.
          </p>
        </div>
      </Link>

      <Link to="/maladie-avancee" className="group">
        <div className="bg-white border rounded-lg p-6 shadow-sm transition-all hover:shadow-md flex flex-col items-center justify-center text-center h-full">
          <div className="bg-yellow-100 p-3 rounded-full mb-4">
            <UserCog className="h-6 w-6 text-yellow-600" />
          </div>
          <h3 className="font-semibold text-lg mb-2">Maladie Avancée</h3>
          <p className="text-gray-600 text-sm">
            Indiquez vos préférences pour les soins en cas de maladie grave.
          </p>
        </div>
      </Link>
      
      <Link to="/gouts-peurs" className="group">
        <div className="bg-white border rounded-lg p-6 shadow-sm transition-all hover:shadow-md flex flex-col items-center justify-center text-center h-full">
          <div className="bg-indigo-100 p-3 rounded-full mb-4">
            <UserCog className="h-6 w-6 text-indigo-600" />
          </div>
          <h3 className="font-semibold text-lg mb-2">Goûts et Peurs</h3>
          <p className="text-gray-600 text-sm">
            Partagez vos préférences personnelles et vos craintes concernant les soins.
          </p>
        </div>
      </Link>

      <Link to="/personne-confiance" className="group">
        <div className="bg-white border rounded-lg p-6 shadow-sm transition-all hover:shadow-md flex flex-col items-center justify-center text-center h-full">
          <div className="bg-purple-100 p-3 rounded-full mb-4">
            <UserCog className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="font-semibold text-lg mb-2">Personne de Confiance</h3>
          <p className="text-gray-600 text-sm">
            Désignez une personne de confiance pour vous représenter.
          </p>
        </div>
      </Link>

      <Link to="/exemples-phrases" className="group">
        <div className="bg-white border rounded-lg p-6 shadow-sm transition-all hover:shadow-md flex flex-col items-center justify-center text-center h-full">
          <div className="bg-teal-100 p-3 rounded-full mb-4">
            <UserCog className="h-6 w-6 text-teal-600" />
          </div>
          <h3 className="font-semibold text-lg mb-2">Exemples de Phrases</h3>
          <p className="text-gray-600 text-sm">
            Inspirez-vous d'exemples pour rédiger vos directives.
          </p>
        </div>
      </Link>
      
      <Link to="/synthese" className="group">
        <div className="bg-white border rounded-lg p-6 shadow-sm transition-all hover:shadow-md flex flex-col items-center justify-center text-center h-full">
          <div className="bg-blue-100 p-3 rounded-full mb-4">
            <FileText className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-lg mb-2">Synthèse</h3>
          <p className="text-gray-600 text-sm">
            Générer une synthèse complète de vos directives et la télécharger au format PDF.
          </p>
        </div>
      </Link>
    </div>
  );
};

export default DirectivesGrid;
