
import React from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PolitiqueConfidentialite = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-directiveplus-800 mb-4">
              Politique de Confidentialité
            </h1>
            <p className="text-xl text-gray-600">
              Dernière mise à jour : Mars 2024
            </p>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>1. Collecte des données</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Nous collectons uniquement les données nécessaires au fonctionnement de notre service et à la création de vos directives anticipées. Ces données incluent vos informations personnelles, vos préférences médicales et les coordonnées de vos personnes de confiance.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>2. Utilisation des données</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Vos données sont utilisées exclusivement pour générer vos directives anticipées, faciliter l'accès aux professionnels de santé autorisés et améliorer notre service. Nous ne vendons ni ne partageons vos données avec des tiers non autorisés.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>3. Sécurité</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Nous mettons en place des mesures de sécurité techniques et organisationnelles appropriées pour protéger vos données contre tout accès non autorisé, altération, divulgation ou destruction.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>4. Vos droits</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, d'effacement et de portabilité de vos données. Vous pouvez exercer ces droits en nous contactant à l'adresse : privacy@directivesplus.fr
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>5. Conservation des données</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Vos données sont conservées aussi longtemps que nécessaire pour fournir nos services et respecter nos obligations légales. Vous pouvez demander la suppression de vos données à tout moment.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PolitiqueConfidentialite;
