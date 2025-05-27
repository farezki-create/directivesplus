
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Shield, Users, Clock } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: FileText,
      title: "Documentation claire",
      description: "Exprimez vos volontés de manière précise et documentée"
    },
    {
      icon: Shield,
      title: "Sécurité garantie",
      description: "Vos données sont protégées selon les normes HDS"
    },
    {
      icon: Users,
      title: "Partage contrôlé",
      description: "Décidez qui peut accéder à vos directives"
    },
    {
      icon: Clock,
      title: "Disponible 24h/24",
      description: "Accessible à tout moment par les soignants"
    }
  ];

  return (
    <div>
      <h3 className="text-2xl font-semibold text-gray-900 mb-6">
        Pourquoi c'est important ?
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {features.map((feature, index) => (
          <Card key={index} className="border-directiveplus-200 hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center mb-3">
                <div className="bg-directiveplus-100 p-2 rounded-lg mr-3">
                  <feature.icon className="h-5 w-5 text-directiveplus-600" />
                </div>
                <h4 className="font-semibold text-gray-900">{feature.title}</h4>
              </div>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FeaturesSection;
