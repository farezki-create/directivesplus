
import { useState } from "react";
import { DocumentScanner } from "@/components/DocumentScanner";
import { DocumentActions } from "./DocumentActions";

export function DocumentList({ userId }: { userId: string }) {
  const [showDocumentScanner, setShowDocumentScanner] = useState(false);

  const handleAddMedicalDocument = () => {
    setShowDocumentScanner(true);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Vos documents médicaux</h2>
      
      <DocumentActions 
        onAddMedicalDocument={handleAddMedicalDocument}
      />

      <DocumentScanner 
        open={showDocumentScanner} 
        onClose={() => setShowDocumentScanner(false)}
      />
    </div>
  );
}

function navigate(path: string) {
  window.location.href = path;
}
