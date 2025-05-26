
import { Shield, FileText, Users } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      title: "Sécurité maximale",
      description: "Vos données sont chiffrées et protégées par les plus hauts standards de sécurité.",
      icon: Shield,
    },
    {
      title: "Facile à utiliser",
      description:
        "Interface intuitive pour créer et gérer vos directives anticipées sans complexité.",
      icon: FileText,
    },
    {
      title: "Partage sécurisé",
      description:
        "Partagez vos directives avec vos proches et professionnels de santé en toute confiance.",
      icon: Users,
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
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
