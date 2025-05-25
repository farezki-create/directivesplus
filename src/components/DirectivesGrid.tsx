
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Users, Heart, BookOpen, CreditCard } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const DirectivesGrid = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const cards = [
    {
      title: "Avis général",
      description: "Exprimez vos valeurs et préférences générales concernant vos soins de santé.",
      icon: Heart,
      path: "/avis-general",
      color: "bg-blue-50 hover:bg-blue-100 border-blue-200"
    },
    {
      title: "Maintien en vie",
      description: "Précisez vos souhaits concernant les traitements de maintien en vie.",
      icon: FileText,
      path: "/maintien-vie",
      color: "bg-green-50 hover:bg-green-100 border-green-200"
    },
    {
      title: "Maladie avancée",
      description: "Définissez vos préférences en cas de maladie grave ou terminale.",
      icon: Heart,
      path: "/maladie-avancee",
      color: "bg-purple-50 hover:bg-purple-100 border-purple-200"
    },
    {
      title: "Goûts et peurs",
      description: "Partagez vos préférences personnelles et vos craintes concernant les soins.",
      icon: Heart,
      path: "/gouts-peurs",
      color: "bg-orange-50 hover:bg-orange-100 border-orange-200"
    },
    {
      title: "Personne de confiance",
      description: "Désignez une personne de confiance pour vous représenter.",
      icon: Users,
      path: "/personne-confiance",
      color: "bg-indigo-50 hover:bg-indigo-100 border-indigo-200"
    }
  ];

  const bottomCards = [
    {
      title: "Synthèse",
      description: "Consultez et finalisez l'ensemble de vos directives anticipées.",
      icon: BookOpen,
      path: "/synthesis",
      color: "bg-emerald-50 hover:bg-emerald-100 border-emerald-200",
      buttonText: "Voir la synthèse"
    }
  ];

  // Ajouter la carte d'accès seulement si l'utilisateur est connecté
  if (isAuthenticated) {
    bottomCards.push({
      title: "Accès Carte",
      description: "Générez votre carte d'accès professionnelle avec QR code et informations d'urgence.",
      icon: CreditCard,
      path: "/carte-acces",
      color: "bg-yellow-50 hover:bg-yellow-100 border-yellow-200",
      buttonText: "Générer la carte"
    });
  }

  return (
    <div className="space-y-8">
      {/* Grille principale des questionnaires */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <Card key={index} className={`cursor-pointer transition-all duration-200 ${card.color}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <card.icon className="h-6 w-6" />
                {card.title}
              </CardTitle>
              <CardDescription>{card.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => navigate(card.path)}
                className="w-full"
                variant="default"
              >
                Commencer
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Section des actions finales */}
      <div className="border-t pt-8">
        <h3 className="text-xl font-semibold mb-6 text-center">Actions finales</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {bottomCards.map((card, index) => (
            <Card key={index} className={`cursor-pointer transition-all duration-200 ${card.color}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <card.icon className="h-6 w-6" />
                  {card.title}
                </CardTitle>
                <CardDescription>{card.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => navigate(card.path)}
                  className="w-full"
                  variant="default"
                >
                  {card.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DirectivesGrid;
