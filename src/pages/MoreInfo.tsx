
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { ArrowLeft, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const MoreInfo = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/")}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à l'accueil
          </Button>
          
          <h1 className="text-3xl font-bold mb-6">
            POURQUOI ET COMMENT RÉDIGER MES DIRECTIVES ANTICIPÉES ?
          </h1>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Qu'est-ce que les directives anticipées ?</CardTitle>
              <CardDescription>
                Informations importantes sur les directives anticipées
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Les directives anticipées sont des instructions écrites que vous donnez, concernant votre fin de vie, dans le cas où vous ne seriez plus en mesure d'exprimer votre volonté.
              </p>
              
              <p>
                Dans ces directives, vous pouvez expliquer si vous souhaitez que les traitements ou les actes médicaux soient arrêtés, limités ou prolongés. 
                Elles permettent aux médecins de connaître vos volontés sur la fin de votre vie.
              </p>
              
              <h3 className="text-lg font-medium mt-4">Qui peut rédiger des directives anticipées ?</h3>
              <p>
                Toute personne majeure peut rédiger ses directives anticipées. Ce n'est pas obligatoire, mais c'est recommandé.
              </p>
              
              <h3 className="text-lg font-medium mt-4">Comment rédiger ses directives anticipées ?</h3>
              <p>
                Le document doit être écrit et authentifiable. Vous devez préciser votre nom, prénom, date et lieu de naissance. 
                Le document doit être daté et signé par vous-même.
              </p>
              
              <h3 className="text-lg font-medium mt-4">Comment les modifier ou les annuler ?</h3>
              <p>
                Les directives anticipées sont valables sans limite de temps mais vous pouvez les modifier ou les annuler à tout moment.
              </p>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-xl">Notre outil vous aide à les rédiger facilement</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Notre application vous permet de rédiger vos directives anticipées de manière simple et guidée, en respectant les exigences légales.
              </p>
              <Button onClick={() => navigate("/")}>
                Commencer ma rédaction
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default MoreInfo;
