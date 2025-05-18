
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const InfoCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-directiveplus-700">Pourquoi soutenir ?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">
            Vos dons nous permettent de maintenir la plateforme accessible gratuitement et de développer de nouvelles fonctionnalités pour améliorer l'expérience utilisateur.
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-directiveplus-700">Comment sont utilisés les dons ?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">
            Les dons servent à financer l'hébergement sécurisé des données, le développement technique de la plateforme et les actions de sensibilisation autour des directives anticipées.
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-directiveplus-700">Avantages fiscaux</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">
            Vos dons à DirectivesPlus sont déductibles des impôts à hauteur de 66% de leur montant dans la limite de 20% de votre revenu imposable.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default InfoCards;
