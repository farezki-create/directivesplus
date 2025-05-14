
import { CheckCircle } from "lucide-react";

const features = [
  {
    title: "Conformité réglementaire",
    description: "Restez à jour avec les dernières directives sanitaires et assurez votre conformité en toute simplicité.",
    icon: (
      <svg className="w-12 h-12 text-directiveplus-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
    ),
    benefits: [
      "Mises à jour automatiques des réglementations",
      "Alertes personnalisées",
      "Rapports de conformité détaillés"
    ]
  },
  {
    title: "Gestion documentaire",
    description: "Organisez et partagez facilement tous vos documents importants dans un espace sécurisé.",
    icon: (
      <svg className="w-12 h-12 text-directiveplus-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"></path>
      </svg>
    ),
    benefits: [
      "Stockage sécurisé dans le cloud",
      "Gestion des versions avancée",
      "Partage facile avec des collaborateurs"
    ]
  },
  {
    title: "Tableaux de bord personnalisés",
    description: "Visualisez vos données clés et suivez vos progrès grâce à des tableaux de bord intuitifs.",
    icon: (
      <svg className="w-12 h-12 text-directiveplus-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
      </svg>
    ),
    benefits: [
      "Indicateurs de performance clés",
      "Analyse de tendances",
      "Rapports personnalisables"
    ]
  }
];

const Features = () => {
  return (
    <section id="features" className="section-padding bg-white">
      <div className="container mx-auto container-padding">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Découvrez nos fonctionnalités principales
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            DirectivePlus offre un ensemble complet d'outils pour vous aider à gérer vos obligations réglementaires.
          </p>
        </div>
        
        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-lg card-shadow hover:border-directiveplus-300 border border-gray-100 transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="mb-5">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">{feature.title}</h3>
              <p className="text-gray-600 mb-6">{feature.description}</p>
              <ul className="space-y-2">
                {feature.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-start">
                    <CheckCircle className="text-directiveplus-500 h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        {/* Call to Action */}
        <div className="mt-16 text-center">
          <a 
            href="#" 
            className="bg-directiveplus-600 hover:bg-directiveplus-700 text-white px-8 py-3 rounded-md inline-block font-medium transition-colors duration-200"
          >
            Voir toutes les fonctionnalités
          </a>
        </div>
      </div>
    </section>
  );
};

export default Features;
