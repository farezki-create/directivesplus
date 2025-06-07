
import React from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, Building, Users, FileText } from 'lucide-react';

const AccessInstitution = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-directiveplus-800 mb-4">
              Accès Institution
            </h1>
            <p className="text-xl text-gray-600">
              Accès sécurisé pour les professionnels de santé et établissements
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Connexion Institution
                </CardTitle>
                <CardDescription>
                  Accédez aux directives de vos patients de manière sécurisée
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="institution-code">Code Institution</Label>
                  <Input id="institution-code" placeholder="Entrez votre code d'accès" />
                </div>
                <div>
                  <Label htmlFor="professional-id">Identifiant Professionnel</Label>
                  <Input id="professional-id" placeholder="Votre identifiant" />
                </div>
                <Button className="w-full">Se connecter</Button>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    Établissements partenaires
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Plus de 200 établissements de santé nous font confiance
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Accès sécurisé
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Système d'authentification à double facteur pour protéger les données
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Conformité RGPD
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Respect strict des réglementations en matière de protection des données
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AccessInstitution;
