
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Users, Shield, Download } from 'lucide-react';

const DirectivesGrid = () => {
  const directives = [
    {
      id: 1,
      title: "Directives de soins",
      description: "Définissez vos souhaits concernant les soins médicaux",
      icon: FileText,
      status: "À compléter",
      color: "bg-blue-100 text-blue-600"
    },
    {
      id: 2,
      title: "Personne de confiance",
      description: "Désignez votre personne de confiance",
      icon: Users,
      status: "À compléter",
      color: "bg-green-100 text-green-600"
    },
    {
      id: 3,
      title: "Directives anticipées",
      description: "Rédigez vos directives anticipées complètes",
      icon: Shield,
      status: "À compléter",
      color: "bg-purple-100 text-purple-600"
    }
  ];

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
      {directives.map((directive) => {
        const IconComponent = directive.icon;
        
        return (
          <Card key={directive.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className={`w-12 h-12 rounded-lg ${directive.color} flex items-center justify-center mb-3`}>
                <IconComponent className="w-6 h-6" />
              </div>
              <CardTitle className="text-lg">{directive.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{directive.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-orange-600 font-medium">
                  {directive.status}
                </span>
                <Button size="sm" className="bg-directiveplus-600 hover:bg-directiveplus-700">
                  Commencer
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default DirectivesGrid;
