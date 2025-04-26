
import { Button } from "@/components/ui/button";

interface DocumentActionsProps {
  onAddMedicalDocument?: () => void;
}

export function DocumentActions({ onAddMedicalDocument }: DocumentActionsProps) {
  return (
    <div className="space-y-4 mb-6">
      {onAddMedicalDocument && (
        <Button onClick={onAddMedicalDocument} variant="outline">
          Ajouter un document médical
        </Button>
      )}
    </div>
  );
}
