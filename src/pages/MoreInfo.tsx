
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, ExternalLink } from "lucide-react";

export default function MoreInfo() {
  // URL du document PDF de la HAS sur les directives anticipées
  const hasPdfUrl = "https://www.has-sante.fr/upload/docs/application/pdf/2016-03/directives_anticipees_concernant_les_situations_de_fin_de_vie_v16.pdf";

  return (
    <div className="container mx-auto py-8">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Document officiel - Directives anticipées</h2>
        </div>
        
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Les directives anticipées concernant les situations de fin de vie</CardTitle>
            <CardDescription>
              Document officiel de la Haute Autorité de Santé (HAS)
            </CardDescription>
            <div className="flex gap-2 mt-2">
              <Button 
                variant="outline" 
                size="sm"
                asChild
              >
                <a href={hasPdfUrl} download="directives_anticipees_has.pdf">
                  <Download className="mr-2 h-4 w-4" />
                  Télécharger
                </a>
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                asChild
              >
                <a 
                  href="https://www.has-sante.fr/jcms/c_2619437/fr/les-directives-anticipees-concernant-les-situations-de-fin-de-vie" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Site officiel de la HAS
                </a>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative w-full aspect-[4/5] border rounded-md overflow-hidden">
              <iframe 
                src={hasPdfUrl}
                className="absolute inset-0 w-full h-full"
                title="Document HAS sur les directives anticipées"
              />
            </div>
          </CardContent>
        </Card>

        <div className="max-w-4xl mx-auto mt-8">
          <h3 className="text-xl font-medium mb-4">À propos des directives anticipées</h3>
          <p className="text-muted-foreground">
            Les directives anticipées sont les instructions écrites que vous donnez concernant votre fin de vie dans l'hypothèse 
            où vous seriez dans l'incapacité d'exprimer votre volonté. Cette possibilité est ouverte par la loi du 22 avril 2005 
            relative aux droits des malades et à la fin de vie, et renforcée par la loi du 2 février 2016 créant de nouveaux droits 
            en faveur des malades et des personnes en fin de vie.
          </p>
        </div>
      </div>
    </div>
  );
}
