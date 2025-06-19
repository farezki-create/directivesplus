
import { Shield, FileText, Users } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      title: "Facile à utiliser",
      description:
        "Interface intuitive pour créer et gérer vos directives anticipées sans complexité.",
      icon: FileText,
      hasFlag: false,
    },
    {
      title: "Sécurité maximale",
      description: "Vos données sont chiffrées et protégées par les plus hauts standards de sécurité.",
      extendedDescription: "Hébergement en France Scalingo, Certifié HDS | Certifié Données Médicales",
      icon: Shield,
      hasFlag: true,
    },
    {
      title: "Partage sécurisé",
      description:
        "Partagez vos directives avec vos proches et professionnels de santé en toute confiance.",
      icon: Users,
      hasFlag: false,
    },
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Pourquoi choisir DirectivesPlus ?
        </h3>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center p-6">
              <div className="w-16 h-16 bg-directiveplus-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <feature.icon className="w-8 h-8 text-directiveplus-600" />
              </div>
              <h4 className="text-xl font-semibold mb-3">{feature.title}</h4>
              <p className="text-gray-600 mb-3">{feature.description}</p>
              
              {feature.hasFlag && (
                <div className="flex flex-col items-center space-y-3">
                  <div className="flex items-center justify-center">
                    <div className="h-8 w-16 flex overflow-hidden rounded shadow-md border">
                      <div className="bg-blue-700 w-1/3 h-full animate-pulse"></div>
                      <div className="bg-white w-1/3 h-full"></div>
                      <div className="bg-red-600 w-1/3 h-full animate-pulse"></div>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-directiveplus-700">
                    {feature.extendedDescription}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
