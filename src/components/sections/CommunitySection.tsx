
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, Users, Heart, Share2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const CommunitySection = () => {
  const { isAuthenticated } = useAuth();

  return (
    <section id="community" className="py-20 bg-gradient-to-r from-purple-50 to-pink-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="bg-white/80 rounded-full p-4 shadow-lg">
              <img 
                src="/lovable-uploads/19f27f8b-f7ef-4752-bd9c-a0def22bc959.png" 
                alt="Communauté DirectivesPlus" 
                className="h-16 w-16"
              />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Rejoignez Notre Communauté
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Échangez avec d'autres utilisateurs, partagez vos expériences et trouvez du soutien 
            dans votre démarche de planification de soins.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="bg-purple-100 rounded-full p-3 w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Échanges</h3>
              <p className="text-sm text-gray-600">
                Partagez vos expériences et posez vos questions
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="bg-blue-100 rounded-full p-3 w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Discussions</h3>
              <p className="text-sm text-gray-600">
                Participez aux conversations sur les soins
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="bg-pink-100 rounded-full p-3 w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <Heart className="h-6 w-6 text-pink-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Soutien</h3>
              <p className="text-sm text-gray-600">
                Trouvez du réconfort et des conseils
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="bg-green-100 rounded-full p-3 w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <Share2 className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Partage</h3>
              <p className="text-sm text-gray-600">
                Aidez les autres avec votre expérience
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              Un espace bienveillant pour tous
            </h3>
            <p className="text-gray-600 mb-6">
              Notre communauté est un lieu sûr où vous pouvez partager vos réflexions, 
              vos préoccupations et vos expériences concernant les directives anticipées 
              et la planification de soins.
            </p>
            
            {isAuthenticated ? (
              <Link to="/community">
                <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Accéder à la Communauté
                </Button>
              </Link>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-gray-500">
                  Connectez-vous pour rejoindre la communauté
                </p>
                <Link to="/auth">
                  <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                    <Users className="mr-2 h-5 w-5" />
                    Rejoindre la Communauté
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunitySection;
