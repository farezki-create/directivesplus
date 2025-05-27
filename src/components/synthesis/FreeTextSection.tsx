
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import DocumentImporter from "./DocumentImporter";

interface FreeTextSectionProps {
  freeText: string;
  setFreeText: (text: string) => void;
}

const FreeTextSection = ({ freeText, setFreeText }: FreeTextSectionProps) => {
  const handleContentImported = (importedContent: string) => {
    console.log("=== CONTENU IMPORTÉ DANS FREETEXTSECTION ===");
    console.log("Contenu importé:", importedContent.substring(0, 200) + "...");
    console.log("Texte existant:", freeText.substring(0, 100) + "...");
    
    if (freeText.trim()) {
      // Si il y a déjà du texte, ajouter le contenu importé à la fin
      const newText = freeText + "\n\n" + importedContent;
      console.log("Ajout du contenu au texte existant");
      setFreeText(newText);
    } else {
      // Si pas de texte existant, remplacer
      console.log("Remplacement du texte vide par le contenu importé");
      setFreeText(importedContent);
    }
    
    console.log("=== FIN TRAITEMENT CONTENU IMPORTÉ ===");
  };

  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <CardTitle>Précisions complémentaires</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <DocumentImporter onContentExtracted={handleContentImported} />
        
        <Textarea
          value={freeText}
          onChange={(e) => {
            console.log("Modification directe du textarea:", e.target.value.length, "caractères");
            setFreeText(e.target.value);
          }}
          className="min-h-32 p-3"
          placeholder="Ajoutez des précisions complémentaires ici..."
        />
      </CardContent>
    </Card>
  );
};

export default FreeTextSection;
