
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import DocumentImporter from "./DocumentImporter";

interface FreeTextSectionProps {
  freeText: string;
  setFreeText: (text: string) => void;
}

const FreeTextSection = ({ freeText, setFreeText }: FreeTextSectionProps) => {
  const handleContentImported = (importedContent: string) => {
    if (freeText.trim()) {
      // Si il y a déjà du texte, ajouter le contenu importé à la fin
      setFreeText(freeText + "\n\n" + importedContent);
    } else {
      // Si pas de texte existant, remplacer
      setFreeText(importedContent);
    }
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
          onChange={(e) => setFreeText(e.target.value)}
          className="min-h-32 p-3"
          placeholder="Ajoutez des précisions complémentaires ici..."
        />
      </CardContent>
    </Card>
  );
};

export default FreeTextSection;
