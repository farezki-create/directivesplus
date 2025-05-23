

import { ShareIcon } from "lucide-react";
import ShareInstitutionCodeButton from "./ShareInstitutionCodeButton";

interface DocumentHeaderProps {
  title: string;
  showActions?: boolean;
  documentId?: string;
}

export function DocumentHeader({ title, showActions = true, documentId }: DocumentHeaderProps) {
  return (
    <div className="flex flex-wrap justify-between items-center gap-2 mb-6">
      <h1 className="text-2xl font-bold">{title}</h1>
      
      {showActions && documentId && (
        <div className="flex items-center gap-3">
          <ShareInstitutionCodeButton directiveId={documentId} />
        </div>
      )}
    </div>
  );
}

