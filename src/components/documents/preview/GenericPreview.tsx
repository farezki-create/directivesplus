
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface GenericPreviewProps {
  filePath: string;
  onOpenExternal: () => void;
}

const GenericPreview = ({ filePath, onOpenExternal }: GenericPreviewProps) => {
  return (
    <div className="py-4 text-center">
      <p className="mb-4">Ce type de document ne peut pas être prévisualisé directement.</p>
      <Button onClick={onOpenExternal} variant="outline">
        <ExternalLink className="h-4 w-4 mr-2" />
        Ouvrir dans un nouvel onglet
      </Button>
    </div>
  );
};

export default GenericPreview;
