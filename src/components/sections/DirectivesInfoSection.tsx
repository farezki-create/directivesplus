
import { Card, CardContent } from "@/components/ui/card";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FileText, Shield, Users, Clock } from "lucide-react";

const DirectivesInfoSection = () => {
  const faqItems = [
    {
      question: "Qu'est-ce que les directives anticipées ?",
      answer: (
        <div className="space-y-3">
          <p>Ce sont des instructions écrites que donne par avance une personne majeure pour le cas où elle serait dans l'incapacité d'exprimer sa volonté.</p>
          <p>Ces directives anticipées expriment la volonté de la personne relative à sa fin de vie en ce qui concerne les conditions de la poursuite, de la limitation, de l'arrêt ou du refus de traitement ou d'actes médicaux.</p>
          <p>Ces directives doivent être respectées par l'équipe médicale le moment venu.</p>
          <p>Vous pouvez les réviser ou les annuler quand vous voulez, c'est l'écrit le plus récent qui fait foi.</p>
        </div>
      )
    },
    {
      question: "Qui peut rédiger des directives anticipées ?",
      answer: "Toute personne majeure peut rédiger ses directives anticipées. Il n'y a pas d'âge limite et aucune condition médicale particulière n'est requise. C'est un droit pour tous."
    },
    {
      question: "Les directives anticipées sont-elles obligatoires ?",
      answer: "Non, la rédaction de directives anticipées est un acte volontaire. Cependant, elles sont fortement recommandées car elles garantissent le respect de vos volontés en cas d'incapacité à vous exprimer."
    },
    {
      question: "Combien de temps sont-elles valables ?",
      answer: "Les directives anticipées sont valables sans limitation de durée. Vous pouvez les modifier ou les révoquer à tout moment. Il est recommandé de les revoir régulièrement."
    },
    {
      question: "Qui peut consulter mes directives ?",
      answer: "Vos directives peuvent être consultées par les professionnels de santé qui vous prennent en charge, vos proches désignés, et toute personne à qui vous donnez accès via un code sécurisé."
    }
  ];

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
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Comprendre les directives anticipées
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Les directives anticipées vous permettent d'exprimer vos souhaits concernant vos soins médicaux 
              pour le cas où vous ne pourriez plus vous exprimer. Découvrez comment elles fonctionnent.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Features Grid */}
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

            {/* FAQ Section */}
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                Questions fréquentes
              </h3>
              <Accordion type="single" collapsible className="w-full">
                {faqItems.map((item, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="border-directiveplus-200">
                    <AccordionTrigger className="text-left hover:text-directiveplus-600">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>

          <div className="mt-12 text-center">
            <div className="bg-directiveplus-50 rounded-lg p-6 border border-directiveplus-200">
              <h4 className="text-xl font-semibold text-directiveplus-800 mb-2">
                Prêt à commencer ?
              </h4>
              <p className="text-directiveplus-700 mb-4">
                Notre plateforme vous guide pas à pas dans la rédaction de vos directives anticipées.
              </p>
              <p className="text-sm text-directiveplus-600">
                Simple, sécurisé et conforme à la réglementation française.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DirectivesInfoSection;
