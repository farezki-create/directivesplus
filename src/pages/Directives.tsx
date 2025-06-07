
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, User, Calendar } from 'lucide-react';

const Directives = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Données simulées pour la démonstration
  const directive = {
    id: id || '1',
    title: 'Mes Directives Anticipées',
    createdAt: '15 mars 2024',
    updatedAt: '20 mars 2024',
    status: 'Actives',
    content: {
      personalInfo: {
        name: 'Jean Dupont',
        birthDate: '15/06/1970',
        address: '123 Rue de la Paix, 75001 Paris'
      },
      trustedPerson: {
        name: 'Marie Dupont',
        relationship: 'Épouse',
        phone: '06 12 34 56 78'
      },
      preferences: [
        'Je souhaite être accompagné par mes proches',
        'Je refuse l\'acharnement thérapeutique',
        'Je souhaite bénéficier de soins palliatifs si nécessaire'
      ]
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Retour
            </Button>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="h-6 w-6 text-directiveplus-600" />
                <h1 className="text-3xl font-bold text-directiveplus-800">
                  {directive.title}
                </h1>
              </div>
              
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Créé le {directive.createdAt}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Modifié le {directive.updatedAt}
                </div>
                <div className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                  {directive.status}
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Informations personnelles
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p><strong>Nom :</strong> {directive.content.personalInfo.name}</p>
                    <p><strong>Date de naissance :</strong> {directive.content.personalInfo.birthDate}</p>
                    <p><strong>Adresse :</strong> {directive.content.personalInfo.address}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Personne de confiance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p><strong>Nom :</strong> {directive.content.trustedPerson.name}</p>
                    <p><strong>Relation :</strong> {directive.content.trustedPerson.relationship}</p>
                    <p><strong>Téléphone :</strong> {directive.content.trustedPerson.phone}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Mes volontés</CardTitle>
                  <CardDescription>
                    Préférences exprimées concernant les soins et traitements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {directive.content.preferences.map((preference, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-directiveplus-600 rounded-full mt-2 flex-shrink-0"></span>
                        <span>{preference}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8 flex gap-4">
              <Button variant="outline">Modifier</Button>
              <Button variant="outline">Télécharger PDF</Button>
              <Button variant="outline">Partager</Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Directives;
