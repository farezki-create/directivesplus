
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface MedicalHeaderProps {
  onAddDocument: () => void;
}

const MedicalHeader = ({ onAddDocument }: MedicalHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold">Données Médicales</h1>
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

export default MedicalHeader;
