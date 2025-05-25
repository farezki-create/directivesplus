
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Megaphone, BookOpen, Code, Palette, MessageSquare } from "lucide-react";

const VolunteerSection = () => {
  const volunteerOptions = [
    {
      icon: <Megaphone className="h-8 w-8 text-directiveplus-600" />,
      title: "Promotion et communication",
      description: "Aidez-nous à faire connaître DirectivePlus auprès du grand public",
      actions: [
        "Partager sur les réseaux sociaux",
        "Présenter l'outil dans votre entourage professionnel",
        "Écrire des articles ou témoignages"
      ]
    },
    {
      icon: <Users className="h-8 w-8 text-directiveplus-600" />,
      title: "Partenariats institutionnels",
      description: "Établir des liens avec associations, hôpitaux et institutions de santé",
      actions: [
        "Présenter l'outil à votre établissement",
        "Faciliter les contacts avec les décideurs",
        "Organiser des démonstrations"
      ]
    },
    {
      icon: <BookOpen className="h-8 w-8 text-directiveplus-600" />,
      title: "Formation et accompagnement",
      description: "Aider les utilisateurs à prendre en main la plateforme",
      actions: [
        "Créer des guides d'utilisation",
        "Animer des sessions de formation",
        "Répondre aux questions des utilisateurs"
      ]
    },
    {
      icon: <Code className="h-8 w-8 text-directiveplus-600" />,
      title: "Développement technique",
      description: "Contribuer à l'amélioration technique de la plateforme",
      actions: [
        "Développement de nouvelles fonctionnalités",
        "Tests et rapports de bugs",
        "Amélioration de l'interface utilisateur"
      ]
    },
    {
      icon: <Palette className="h-8 w-8 text-directiveplus-600" />,
      title: "Design et expérience utilisateur",
      description: "Améliorer l'ergonomie et l'accessibilité de l'application",
      actions: [
        "Optimisation de l'interface",
        "Création de supports visuels",
        "Tests d'utilisabilité"
      ]
    },
    {
      icon: <MessageSquare className="h-8 w-8 text-directiveplus-600" />,
      title: "Support et accompagnement",
      description: "Aider les utilisateurs dans leur parcours",
      actions: [
        "Répondre aux questions",
        "Accompagner les nouveaux utilisateurs",
        "Améliorer la documentation"
      ]
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-directiveplus-800 mb-4">
            Bénévolat et promotion
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Rejoignez notre communauté de bénévoles et aidez-nous à promouvoir DirectivePlus. 
            Votre expertise et votre réseau peuvent faire la différence.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {volunteerOptions.map((option, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  {option.icon}
                  <CardTitle className="text-lg">{option.title}</CardTitle>
                </div>
                <CardDescription>{option.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {option.actions.map((action, actionIndex) => (
                    <li key={actionIndex} className="flex items-start">
                      <span className="text-directiveplus-600 mr-2">•</span>
                      <span className="text-sm text-gray-600">{action}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center">
          <Button 
            size="lg" 
            className="bg-directiveplus-600 hover:bg-directiveplus-700"
            onClick={() => window.open('mailto:contact@directiveplus.fr?subject=Bénévolat DirectivePlus', '_blank')}
          >
            Rejoindre l'équipe bénévole
          </Button>
          <p className="text-sm text-gray-500 mt-2">
            Contactez-nous pour discuter de votre contribution
          </p>
        </div>
      </div>
    </section>
  );
};

export default VolunteerSection;
