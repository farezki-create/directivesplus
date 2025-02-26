
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function HASPDFViewer() {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchHASDocument() {
      try {
        setIsLoading(true);
        
        // On récupère la session utilisateur
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          // Si l'utilisateur n'est pas connecté, on utilise l'URL directe
          setPdfUrl("https://www.has-sante.fr/upload/docs/application/pdf/2016-03/directives_anticipees_concernant_les_situations_de_fin_de_vie_v16.pdf");
          return;
        }
        
        // On cherche le document HAS dans la base de données
        const { data, error } = await supabase
          .from("pdf_documents")
          .select("file_path, file_name")
          .eq("user_id", session.user.id)
          .ilike("description", "%HAS%")
          .limit(1);
        
        if (error) {
          throw error;
        }
        
        if (data && data.length > 0) {
          // On récupère l'URL du document
          const { data: urlData } = supabase.storage
            .from("pdf_documents")
            .getPublicUrl(data[0].file_path);
          
          setPdfUrl(urlData.publicUrl);
        } else {
          // Si le document n'existe pas, on utilise l'URL directe
          setPdfUrl("https://www.has-sante.fr/upload/docs/application/pdf/2016-03/directives_anticipees_concernant_les_situations_de_fin_de_vie_v16.pdf");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération du document HAS:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger le document HAS.",
          variant: "destructive",
        });
        // En cas d'erreur, on utilise l'URL directe
        setPdfUrl("https://www.has-sante.fr/upload/docs/application/pdf/2016-03/directives_anticipees_concernant_les_situations_de_fin_de_vie_v16.pdf");
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchHASDocument();
  }, [toast]);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Document officiel - Directives anticipées</CardTitle>
          <CardDescription>
            Document de la Haute Autorité de Santé (HAS) concernant les directives anticipées
          </CardDescription>
          {pdfUrl && (
            <div className="flex gap-2 mt-2">
              <Button 
                variant="outline" 
                size="sm"
                asChild
              >
                <a href={pdfUrl} download="directives_anticipees_has.pdf">
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
                  Site de la HAS
                </a>
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : pdfUrl ? (
            <div className="relative w-full aspect-[4/5] border rounded-md overflow-hidden">
              <iframe 
                src={`${pdfUrl}#toolbar=0`}
                className="absolute inset-0 w-full h-full"
                title="Document HAS sur les directives anticipées"
              />
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              Document non disponible
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
