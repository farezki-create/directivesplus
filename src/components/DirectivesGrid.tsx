
import { Link } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type DirectiveOption = {
  title: string;
  route: string;
  description: string;
  icon?: React.ReactNode;
};

const directiveOptions: DirectiveOption[] = [
  {
    title: "Avis général",
    route: "/avis-general",
    description: "Exprimez vos souhaits concernant vos soins médicaux généraux",
  },
  {
    title: "Maintien de la vie",
    route: "/maintien-vie",
    description: "Précisez vos volontés concernant les traitements de maintien en vie",
  },
  {
    title: "Maladie avancée",
    route: "/maladie-avancee",
    description: "Indiquez vos préférences en cas de maladie grave ou avancée",
  },
  {
    title: "Mes goûts et mes peurs",
    route: "/gouts-peurs",
    description: "Partagez vos préférences personnelles et vos craintes",
  },
  {
    title: "Personne de confiance",
    route: "/personne-confiance",
    description: "Désignez les personnes à consulter pour vos décisions médicales",
  },
  {
    title: "Exemples de phrases",
    route: "/exemples-phrases",
    description: "Inspirez-vous d'exemples pour rédiger vos directives",
  },
];

const DirectivesGrid = () => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {directiveOptions.map((option) => (
          <Link to={option.route} key={option.route}>
            <Card className="h-full transition-all hover:shadow-md hover:border-directiveplus-300">
              <CardContent className="p-6">
                <div className="flex flex-col space-y-2">
                  <h3 className="text-lg font-semibold text-directiveplus-700">
                    {option.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {option.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      
      <div className="flex justify-center pt-6">
        <Button 
          className="bg-directiveplus-600 hover:bg-directiveplus-700 px-8 py-6 text-lg"
          asChild
        >
          <Link to="/synthese">
            Synthèse
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default DirectivesGrid;
