
import React, { memo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Users, Heart, Brain, Stethoscope, FileSignature, Eye, Lock } from "lucide-react";

interface DirectivesGridProps {
  readOnly?: boolean;
}

// Memoize les sections pour éviter les recréations
const sections = [
  {
    title: "Avis général",
    description: "Vos préférences générales de fin de vie",
    icon: FileText,
    href: "/avis-general",
    color: "bg-blue-50 border-blue-200",
    iconColor: "text-blue-600"
  },
  {
    title: "Goûts et peurs",
    description: "Vos préférences personnelles et appréhensions",
    icon: Heart,
    href: "/gouts-peurs",
    color: "bg-rose-50 border-rose-200",
    iconColor: "text-rose-600"
  },
  {
    title: "Maintien en vie",
    description: "Vos souhaits concernant les soins de maintien en vie",
    icon: Brain,
    href: "/maintien-vie",
    color: "bg-green-50 border-green-200",
    iconColor: "text-green-600"
  },
  {
    title: "Maladie avancée",
    description: "Vos directives en cas de maladie grave",
    icon: Stethoscope,
    href: "/maladie-avancee",
    color: "bg-purple-50 border-purple-200",
    iconColor: "text-purple-600"
  },
  {
    title: "Personne de confiance",
    description: "Désignez votre personne de confiance",
    icon: Users,
    href: "/personne-confiance",
    color: "bg-orange-50 border-orange-200",
    iconColor: "text-orange-600"
  },
  {
    title: "Synthèse",
    description: "Votre document final de directives anticipées",
    icon: FileSignature,
    href: "/synthese",
    color: "bg-indigo-50 border-indigo-200",
    iconColor: "text-indigo-600"
  }
];

const DirectivesGrid = memo(({ readOnly = false }: DirectivesGridProps) => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {sections.map((section) => {
        const Icon = section.icon;
        
        return (
          <Card key={section.title} className={`transition-all hover:shadow-lg ${section.color}`}>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-white ${section.iconColor}`}>
                  <Icon size={24} />
                </div>
                {readOnly && (
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    {section.href === "/synthese" ? <Eye size={12} /> : <Lock size={12} />}
                    {section.href === "/synthese" ? "Consultation" : "Lecture seule"}
                  </div>
                )}
              </div>
              <CardTitle className="text-lg">{section.title}</CardTitle>
              <CardDescription className="text-sm">
                {section.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Button asChild variant="outline" className="w-full">
                <Link to={section.href}>
                  {readOnly 
                    ? (section.href === "/synthese" ? "Consulter" : "Voir") 
                    : "Commencer"
                  }
                </Link>
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
});

DirectivesGrid.displayName = "DirectivesGrid";

export default DirectivesGrid;
