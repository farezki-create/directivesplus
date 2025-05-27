
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface FreeTextSectionProps {
  freeText: string;
  setFreeText: (text: string) => void;
}

const FreeTextSection = ({ freeText, setFreeText }: FreeTextSectionProps) => {
  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <CardTitle>Précisions complémentaires</CardTitle>
      </CardHeader>
      <CardContent>
        <textarea
          value={freeText}
          onChange={(e) => setFreeText(e.target.value)}
          className="w-full h-32 p-3 border rounded-md"
          placeholder="Ajoutez des précisions complémentaires ici..."
        />
      </CardContent>
    </Card>
  );
};

export default FreeTextSection;
