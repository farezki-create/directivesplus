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
      color: "bg-blue-50 hover:bg-blue-100 border-blue-200",
      badgeColor: "bg-blue-100 text-blue-600"
    },
    {
      title: "Maintien en vie",
      description: "Précisez vos souhaits concernant les traitements de maintien en vie.",
      icon: FileText,
      path: "/maintien-vie",
      color: "bg-green-50 hover:bg-green-100 border-green-200",
      badgeColor: "bg-green-100 text-green-600"
    },
    {
      title: "Maladie avancée",
      description: "Définissez vos préférences en cas de maladie grave ou terminale.",
      icon: Heart,
      path: "/maladie-avancee",
      color: "bg-purple-50 hover:bg-purple-100 border-purple-200",
      badgeColor: "bg-yellow-100 text-yellow-600"
    },
    {
      title: "Goûts et peurs",
      description: "Partagez vos préférences personnelles et vos craintes concernant les soins.",
      icon: Heart,
      path: "/gouts-peurs",
      color: "bg-orange-50 hover:bg-orange-100 border-orange-200",
      badgeColor: "bg-purple-100 text-purple-600"
    },
    {
      title: "Exemples de Phrases",
      description: "Inspirez-vous d'exemples pour rédiger vos directives.",
      icon: BookOpen,
      path: "/exemples-phrases",
      color: "bg-teal-50 hover:bg-teal-100 border-teal-200",
      badgeColor: "bg-teal-100 text-teal-600"
    },
    {
      title: "Personne de confiance",
      description: "Désignez une personne de confiance pour vous représenter.",
      icon: Users,
      path: "/personne-confiance",
      color: "bg-indigo-50 hover:bg-indigo-100 border-indigo-200",
      badgeColor: "bg-pink-100 text-pink-600"
    }
  ];

  const bottomCards = [
    {
      title: "Synthèse",
      description: "Consultez la synthèse, enregistrez, signez et générez le PDF.",
      icon: BookOpen,
      path: "/synthesis",
      color: "bg-emerald-50 hover:bg-emerald-100 border-emerald-200",
      badgeColor: "bg-blue-100 text-blue-600",
      badgeNumber: 7
    },
    {
      title: "Mes Directives",
      description: "Consultez mes directives, imprimez, téléchargez et partagez.",
      icon: FileText,
      path: "/mes-directives",
      color: "bg-orange-50 hover:bg-orange-100 border-orange-200",
      badgeColor: "bg-orange-100 text-orange-600",
      badgeNumber: 8
    }
  ];

  // Ajouter la carte d'accès seulement si l'utilisateur est connecté
  if (isAuthenticated) {
    bottomCards.push({
      title: "Carte d'Accès",
      description: "Carte d'accès avec QR code et code d'accès.",
      icon: CreditCard,
      path: "/carte-acces",
      color: "bg-yellow-50 hover:bg-yellow-100 border-yellow-200",
      badgeColor: "bg-yellow-100 text-yellow-600",
      badgeNumber: 9
    });
  }

  return (
    <div className="space-y-8">
      {/* Grille principale des questionnaires */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <Card 
            key={index} 
            className={`cursor-pointer transition-all duration-200 ${card.color} relative`}
            onClick={() => navigate(card.path)}
          >
            {/* Badge numéroté */}
            <div className={`absolute -top-3 -left-3 w-8 h-8 rounded-full ${card.badgeColor} flex items-center justify-center text-sm font-bold shadow-sm`}>
              {index + 1}
            </div>
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-gray-800">
                <card.icon className="h-6 w-6" />
                {card.title}
              </CardTitle>
              <CardDescription className="text-gray-600">{card.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-500">
                Cliquez sur la carte pour accéder
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Section des actions finales */}
      <div className="border-t pt-8">
        <h3 className="text-xl font-semibold mb-6 text-center text-gray-800">Actions finales</h3>
        <div className="flex justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl">
            {bottomCards.map((card, index) => (
              <Card 
                key={index} 
                className={`cursor-pointer transition-all duration-200 ${card.color} relative`}
                onClick={() => navigate(card.path)}
              >
                {/* Badge numéroté pour les actions finales */}
                <div className={`absolute -top-3 -left-3 w-8 h-8 rounded-full ${card.badgeColor} flex items-center justify-center text-sm font-bold shadow-sm`}>
                  {card.badgeNumber}
                </div>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-gray-800">
                    <card.icon className="h-6 w-6" />
                    {card.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600">{card.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-500">
                    Cliquez sur la carte pour accéder
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DirectivesGrid;
