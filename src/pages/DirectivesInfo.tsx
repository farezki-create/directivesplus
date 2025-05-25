
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import PageFooter from "@/components/layout/PageFooter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FileText, Users, Shield, Clock, Check } from "lucide-react";

const DirectivesInfo = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Retour à l'accueil
          </Button>
        </div>
        
        <div className="max-w-4xl mx-auto">
          {/* Hero Section with Image */}
          <div className="text-center mb-12">
            <div className="mb-8 flex justify-center">
              <img 
                src="/lovable-uploads/86bce663-cca0-4ea4-bc23-6aefb0b92745.png" 
                alt="Directives Anticipées - Document et stylo" 
                className="w-64 h-auto rounded-lg shadow-sm"
              />
            </div>
            <h1 className="text-4xl font-bold mb-4 text-directiveplus-800">
              Les Directives Anticipées
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tout ce que vous devez savoir sur les directives anticipées et leur importance 
              pour faire respecter vos volontés en matière de soins de fin de vie.
            </p>
          </div>

          {/* Définition */}
          <Card className="mb-8 border-directiveplus-200">
            <CardHeader className="bg-directiveplus-50">
              <CardTitle className="flex items-center gap-3 text-directiveplus-800">
                <FileText className="h-6 w-6" />
                Qu'est-ce que les directives anticipées ?
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-gray-700 leading-relaxed mb-4">
                Les « directives anticipées » sont une déclaration écrite que vous rédigez préalablement 
                pour faire connaître votre volonté sur les conditions de prise en charge médicale de votre fin de vie. 
                Dans l'hypothèse où vous êtes hors d'état d'exprimer votre volonté (suite à un coma, en cas de troubles 
                cognitifs profonds, à la suite d'un accident, du fait de l'évolution d'une maladie ou encore du fait 
                du grand âge…), ces directives permettent au médecin et à l'équipe médicale qui vous prennent en charge, 
                de connaître vos volontés.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Confronté à un patient en situation de fin de vie, quelle qu'en soit la cause et dans l'incapacité 
                d'exprimer sa volonté, le médecin a l'obligation de s'enquérir en priorité de l'existence de directives 
                anticipées et de les respecter, dès lors qu'elles sont appropriées et conformes à la situation médicale.
              </p>
            </CardContent>
          </Card>

          {/* Questions fréquentes */}
          <div className="grid gap-6 mb-8">
            <Card className="border-blue-200">
              <CardHeader className="bg-blue-50">
                <CardTitle className="flex items-center gap-3 text-blue-800">
                  <Users className="h-5 w-5" />
                  Qui peut rédiger des directives anticipées ?
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-gray-700">
                  Toute personne majeure peut, si elle le souhaite, rédiger ses directives anticipées. 
                  Si vous bénéficiez d'un régime de protection légale (vous êtes par exemple sous tutelle), 
                  vous devez demander l'autorisation du juge ou, le cas échéant, du conseil de famille.
                </p>
              </CardContent>
            </Card>

            <Card className="border-green-200">
              <CardHeader className="bg-green-50">
                <CardTitle className="flex items-center gap-3 text-green-800">
                  <FileText className="h-5 w-5" />
                  Quelle est la forme des directives anticipées ?
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-gray-700 mb-3">
                  Il s'agit d'un document écrit qui doit être daté et signé avec vos noms, prénoms, 
                  date et lieu de naissance.
                </p>
                <p className="text-gray-700">
                  Si vous êtes dans l'impossibilité physique d'écrire vos directives anticipées, 
                  on peut le faire à votre place, mais le document n'est valide que si deux témoins 
                  attestent par écrit, en précisant leurs noms et qualités, que ce document est bien 
                  l'expression de votre volonté libre et éclairée.
                </p>
              </CardContent>
            </Card>

            <Card className="border-purple-200">
              <CardHeader className="bg-purple-50">
                <CardTitle className="flex items-center gap-3 text-purple-800">
                  <Check className="h-5 w-5" />
                  Quel est le contenu des directives anticipées ?
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-gray-700">
                  Vous pouvez exprimer, par avance, votre volonté de refuser ou de poursuivre, 
                  de limiter ou d'arrêter des traitements, y compris de maintien artificiel de la vie, 
                  ou de bénéficier d'une sédation profonde et continue. Ces décisions ne seront mises 
                  en œuvre qu'à l'issue d'une procédure collégiale permettant de vérifier que votre 
                  situation les autorise et que telle était bien votre volonté.
                </p>
              </CardContent>
            </Card>

            <Card className="border-orange-200">
              <CardHeader className="bg-orange-50">
                <CardTitle className="flex items-center gap-3 text-orange-800">
                  <Clock className="h-5 w-5" />
                  Puis-je changer d'avis après avoir rédigé des directives anticipées ?
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-gray-700">
                  Vous pouvez modifier totalement ou partiellement, voire annuler vos directives 
                  anticipées à tout moment et sans formalité. Les directives anticipées sont valables 
                  indéfiniment, tant que vous ne les modifiez vous-même.
                </p>
              </CardContent>
            </Card>

            <Card className="border-red-200">
              <CardHeader className="bg-red-50">
                <CardTitle className="flex items-center gap-3 text-red-800">
                  <Shield className="h-5 w-5" />
                  Comment m'assurer que mes directives anticipées seront suivies d'effet ?
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-gray-700 mb-3">
                  Afin de vous assurer que les directives et leurs modifications éventuelles 
                  seront bien prises en compte et exécutées, vous êtes invité à :
                </p>
                <ul className="text-gray-700 space-y-2">
                  <li>• Garder l'original de vos directives anticipées sur vous</li>
                  <li>• Le conserver chez votre médecin, dans votre dossier médical</li>
                  <li>• Le confier à une personne de confiance désignée comme telle ou à un tiers</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Portée des directives */}
          <Card className="mb-8 border-gray-300">
            <CardHeader className="bg-gray-50">
              <CardTitle className="text-gray-800">
                Quelle est la portée de mes directives anticipées dans la décision médicale ?
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-gray-700 mb-3">
                Si vous avez rédigé des directives anticipées, le médecin doit les appliquer. 
                Leur contenu prime sur les avis et témoignages (personne de confiance, famille, proches) 
                et elles s'imposent au médecin, qui ne peut refuser de les appliquer que dans deux situations :
              </p>
              <ul className="text-gray-700 space-y-2">
                <li>• En cas d'urgence vitale, le temps d'évaluer la situation</li>
                <li>• Lorsque les directives anticipées lui apparaissent inappropriées ou non conformes à la situation médicale</li>
              </ul>
            </CardContent>
          </Card>

          {/* Anagramme DIRECTIVES */}
          <Card className="mb-8 border-directiveplus-300 bg-gradient-to-br from-directiveplus-50 to-blue-50">
            <CardHeader>
              <CardTitle className="text-center text-directiveplus-800">
                D.I.R.E.C.T.I.V.E.S - L'essentiel à retenir
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-directiveplus-600 text-white rounded-full flex items-center justify-center font-bold">D</span>
                    <div>
                      <span className="font-semibold">Décision</span> - Un choix personnel
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-directiveplus-600 text-white rounded-full flex items-center justify-center font-bold">I</span>
                    <div>
                      <span className="font-semibold">Individuelle</span> - Chaque directive est propre à la personne
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-directiveplus-600 text-white rounded-full flex items-center justify-center font-bold">R</span>
                    <div>
                      <span className="font-semibold">Réfléchie</span> - Prise après mûre réflexion
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-directiveplus-600 text-white rounded-full flex items-center justify-center font-bold">E</span>
                    <div>
                      <span className="font-semibold">Écrite</span> - Doit être formalisée sur papier
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-directiveplus-600 text-white rounded-full flex items-center justify-center font-bold">C</span>
                    <div>
                      <span className="font-semibold">Consciente</span> - Elle doit être libre et éclairée
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-directiveplus-600 text-white rounded-full flex items-center justify-center font-bold">T</span>
                    <div>
                      <span className="font-semibold">Témoins</span> - Requis si la personne ne peut pas écrire elle-même
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-directiveplus-600 text-white rounded-full flex items-center justify-center font-bold">I</span>
                    <div>
                      <span className="font-semibold">Inaliénable</span> - Ce droit ne peut pas être retiré
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-directiveplus-600 text-white rounded-full flex items-center justify-center font-bold">V</span>
                    <div>
                      <span className="font-semibold">Volonté</span> - L'expression de ce que je veux
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-directiveplus-600 text-white rounded-full flex items-center justify-center font-bold">E</span>
                    <div>
                      <span className="font-semibold">Éthique</span> - Respecte la dignité et les valeurs humaines
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-directiveplus-600 text-white rounded-full flex items-center justify-center font-bold">S</span>
                    <div>
                      <span className="font-semibold">Sédation</span> - Possibilité de demander une sédation profonde et continue
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Call to action */}
          <div className="text-center bg-gradient-to-r from-directiveplus-600 to-blue-600 text-white rounded-lg p-8">
            <h3 className="text-2xl font-bold mb-4">Prêt à rédiger vos directives anticipées ?</h3>
            <p className="text-lg mb-6 opacity-90">
              DirectivesPlus vous accompagne dans cette démarche importante avec un processus simple et sécurisé.
            </p>
            <Button 
              onClick={() => navigate("/auth")}
              className="bg-white text-directiveplus-600 hover:bg-gray-100 text-lg py-3 px-8"
            >
              Commencer maintenant
            </Button>
          </div>
        </div>
      </main>
      
      <PageFooter />
    </div>
  );
};

export default DirectivesInfo;
