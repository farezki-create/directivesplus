
import React from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ConditionsGeneralesUtilisation = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-directiveplus-800 mb-4">
              Conditions Générales d'Utilisation
            </h1>
            <p className="text-xl text-gray-600">
              Dernière mise à jour : Mars 2024
            </p>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>1. Objet</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Les présentes conditions générales d'utilisation (CGU) ont pour objet de définir les modalités et conditions d'utilisation du service DirectivesPlus, plateforme de création et de gestion de directives anticipées.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>2. Acceptation des conditions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  L'utilisation du service DirectivesPlus implique l'acceptation pleine et entière des présentes CGU. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre service.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>3. Description du service</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  DirectivesPlus est un service numérique permettant de créer, modifier et gérer vos directives anticipées. Le service facilite également l'accès sécurisé à ces informations par les professionnels de santé autorisés.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>4. Obligations de l'utilisateur</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-gray-600 space-y-2">
                  <p>L'utilisateur s'engage à :</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Fournir des informations exactes et complètes</li>
                    <li>Maintenir la confidentialité de ses identifiants</li>
                    <li>Utiliser le service de manière conforme à la loi</li>
                    <li>Informer ses proches de l'existence de ses directives</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>5. Responsabilités</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  DirectivesPlus met tout en œuvre pour assurer la sécurité et la disponibilité du service. Cependant, l'utilisateur reste responsable du contenu de ses directives et de leur communication à ses proches et professionnels de santé.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>6. Modification des CGU</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  DirectivesPlus se réserve le droit de modifier les présentes CGU à tout moment. Les utilisateurs seront informés de toute modification par email et/ou notification sur la plateforme.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ConditionsGeneralesUtilisation;
