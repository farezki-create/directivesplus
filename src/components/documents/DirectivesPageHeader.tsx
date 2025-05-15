
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DirectivesPageHeaderProps {
  onAddDocument: () => void;
}

const DirectivesPageHeader = ({ onAddDocument }: DirectivesPageHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold">Mes Directives</h1>
      <Button
        onClick={onAddDocument}
        className="flex items-center gap-2"
      >
        <Plus size={16} />
        Ajouter un document
      </Button>
    </div>
  );
};

export default DirectivesPageHeader;
