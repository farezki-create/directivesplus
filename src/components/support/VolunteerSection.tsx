
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Code, MessageSquare, Globe, Mail } from "lucide-react";

const VolunteerSection = () => {
  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Contribuer bénévolement
            </h2>
            <p className="text-lg text-gray-600">
              Rejoignez notre communauté de bénévoles et aidez-nous à améliorer DirectivesPlus
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5 text-blue-600" />
                  Développement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Contribuez au développement de nouvelles fonctionnalités, 
                  améliorations de l'interface utilisateur, ou corrections de bugs.
                </p>
                <ul className="text-sm text-gray-600 space-y-1 mb-4">
                  <li>• React / TypeScript</li>
                  <li>• Interface utilisateur</li>
                  <li>• Tests et qualité</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-green-600" />
                  Support utilisateur
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Aidez les utilisateurs à naviguer sur la plateforme et 
                  répondez à leurs questions sur les directives anticipées.
                </p>
                <ul className="text-sm text-gray-600 space-y-1 mb-4">
                  <li>• Accompagnement des utilisateurs</li>
                  <li>• Documentation</li>
                  <li>• Formation</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-purple-600" />
                  Communication
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Participez à la sensibilisation et à la communication 
                  autour de l'importance des directives anticipées.
                </p>
                <ul className="text-sm text-gray-600 space-y-1 mb-4">
                  <li>• Réseaux sociaux</li>
                  <li>• Rédaction d'articles</li>
                  <li>• Événements</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-orange-600" />
                  Expertise médicale
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Apportez votre expertise médicale pour améliorer le contenu 
                  et s'assurer de la justesse des informations.
                </p>
                <ul className="text-sm text-gray-600 space-y-1 mb-4">
                  <li>• Révision du contenu médical</li>
                  <li>• Conseils d'experts</li>
                  <li>• Formation des équipes</li>
                </ul>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center mt-12">
            <Card className="bg-directiveplus-50 border-directiveplus-200">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold text-directiveplus-800 mb-4">
                  Intéressé pour contribuer ?
                </h3>
                <p className="text-directiveplus-700 mb-6">
                  Contactez-nous pour discuter de comment vous pouvez aider DirectivesPlus
                </p>
                <Button 
                  className="bg-directiveplus-600 hover:bg-directiveplus-700"
                  onClick={() => window.location.href = 'mailto:mesdirectives@directivesplus.fr?subject=Bénévolat DirectivesPlus'}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Nous contacter
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolunteerSection;
