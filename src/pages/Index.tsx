import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Shield, FileText, Users, CheckCircle, Star, Building2 } from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "@/components/Footer";

const Index = () => {
  const { isAuthenticated } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

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

  const howItWorksSteps = [
    {
      step: 1,
      title: "Créez votre compte",
      description:
        "Inscrivez-vous gratuitement et accédez à votre espace personnel sécurisé.",
    },
    {
      step: 2,
      title: "Rédigez vos directives",
      description:
        "Utilisez notre questionnaire guidé pour exprimer clairement vos volontés.",
    },
    {
      step: 3,
      title: "Partagez en sécurité",
      description:
        "Donnez accès à vos proches et professionnels avec des codes sécurisés.",
    },
  ];

  const testimonials = [
    {
      stars: 5,
      comment:
        "Enfin une solution simple et sécurisée pour mes directives anticipées. Je me sens rassuré de savoir que mes volontés seront respectées.",
      author: "Marie D., 65 ans",
    },
    {
      stars: 5,
      comment:
        "Interface très intuitive. J'ai pu créer mes directives en quelques minutes et les partager facilement avec ma famille.",
      author: "Jean-Pierre M., 58 ans",
    },
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <img 
                src="/lovable-uploads/d5255c41-98e6-44a5-82fd-dac019e499ef.png" 
                alt="DirectivesPlus" 
                className="h-12 w-auto"
              />
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#features" className="text-gray-600 hover:text-directiveplus-600 transition-colors">
                Fonctionnalités
              </a>
              <a href="#how-it-works" className="text-gray-600 hover:text-directiveplus-600 transition-colors">
                Comment ça marche
              </a>
              <a href="#testimonials" className="text-gray-600 hover:text-directiveplus-600 transition-colors">
                Témoignages
              </a>
              <Link to="/acces-institution" className="text-directiveplus-600 hover:text-directiveplus-700 font-medium transition-colors">
                Accès Institution
              </Link>
              {!isAuthenticated ? (
                <Link to="/auth">
                  <Button className="bg-directiveplus-600 hover:bg-directiveplus-700">
                    Connexion
                  </Button>
                </Link>
              ) : (
                <Link to="/rediger">
                  <Button className="bg-directiveplus-600 hover:bg-directiveplus-700">
                    Mes Directives
                  </Button>
                </Link>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          {/* Logo au-dessus du titre */}
          <div className="flex justify-center mb-8">
            <img 
              src="/lovable-uploads/d5255c41-98e6-44a5-82fd-dac019e499ef.png" 
              alt="DirectivesPlus" 
              className="h-80 w-auto opacity-60"
            />
          </div>
          
          <h3 className="text-5xl font-bold text-gray-900 mb-6">
            Vos volontés, <span className="text-directiveplus-600">protégées</span> et accessibles
          </h3>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Créez, stockez et partagez vos directives anticipées en toute sécurité. 
            Assurez-vous que vos souhaits soient respectés, même quand vous ne pouvez plus les exprimer.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!isAuthenticated ? (
              <>
                <Link to="/auth">
                  <Button size="lg" className="bg-directiveplus-600 hover:bg-directiveplus-700">
                    Commencer gratuitement
                  </Button>
                </Link>
                <Link to="/en-savoir-plus">
                  <Button size="lg" variant="outline" className="border-directiveplus-600 text-directiveplus-600 hover:bg-directiveplus-50">
                    En savoir plus
                  </Button>
                </Link>
              </>
            ) : (
              <Link to="/rediger">
                <Button size="lg" className="bg-directiveplus-600 hover:bg-directiveplus-700">
                  Accéder à mes directives
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
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

      {/* How it works */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Comment ça marche ?
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {howItWorksSteps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-directiveplus-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  {step.step}
                </div>
                <h4 className="text-xl font-semibold mb-3">{step.title}</h4>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Accès Institutionnel Section - Déplacé après Comment ça marche */}
      <section className="py-16 bg-directiveplus-50 border-y-2 border-directiveplus-200">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-directiveplus-600 rounded-full flex items-center justify-center">
                <Building2 className="w-10 h-10 text-white" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Accès Institutionnel
            </h3>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Professionnels de santé et établissements : accédez rapidement et en toute sécurité 
              aux directives anticipées de vos patients grâce à notre système d'accès institutionnel.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/acces-institution">
                <Button size="lg" className="bg-directiveplus-600 hover:bg-directiveplus-700">
                  <Building2 className="mr-2 h-5 w-5" />
                  Accès Institutionnel
                </Button>
              </Link>
              <Link to="/en-savoir-plus">
                <Button size="lg" variant="outline" className="border-directiveplus-600 text-directiveplus-600 hover:bg-directiveplus-100">
                  En savoir plus
                </Button>
              </Link>
            </div>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div className="flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                Accès sécurisé par code
              </div>
              <div className="flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                Conforme RGPD
              </div>
              <div className="flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                Support 24/7
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Ce que disent nos utilisateurs
          </h3>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.stars)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">{testimonial.comment}</p>
                <div className="font-semibold">{testimonial.author}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-directiveplus-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-4">
            Prêt à protéger vos volontés ?
          </h3>
          <p className="text-xl mb-8 opacity-90">
            Rejoignez les milliers de personnes qui ont déjà sécurisé leurs directives anticipées.
          </p>
          {!isAuthenticated ? (
            <Link to="/auth">
              <Button size="lg" className="bg-white text-directiveplus-600 hover:bg-gray-100">
                Commencer maintenant
              </Button>
            </Link>
          ) : (
            <Link to="/rediger">
              <Button size="lg" className="bg-white text-directiveplus-600 hover:bg-gray-100">
                Accéder à mes directives
              </Button>
            </Link>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
