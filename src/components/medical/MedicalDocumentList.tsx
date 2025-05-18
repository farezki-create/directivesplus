
import { useState } from "react";
import DocumentCard from "@/components/documents/DocumentCard";
import EmptyDocumentsState from "@/components/documents/EmptyDocumentsState";

interface Document {
  id: string;
  file_name: string;
  file_path: string;
  created_at: string;
  description?: string;
  file_type?: string;
  user_id: string;
  is_private?: boolean; // This is for UI purposes only
}

interface MedicalDocumentListProps {
  documents: Document[];
  onDownload: (filePath: string, fileName: string) => void;
  onPrint: (filePath: string, fileType?: string) => void;
  onShare: (documentId: string) => void;
  onView: (filePath: string, fileType?: string) => void;
  onDelete: (documentId: string) => void;
  onVisibilityChange?: (documentId: string, isPrivate: boolean) => void;
}

const MedicalDocumentList = ({
  documents,
  onDownload,
  onPrint,
  onShare,
  onView,
  onDelete,
  onVisibilityChange
}: MedicalDocumentListProps) => {
  if (documents.length === 0) {
    return <EmptyDocumentsState message="Vous n'avez pas encore ajouté de données médicales" />;
  }

  return (
    <div className="grid gap-6">
      {documents.map((doc) => (
        <DocumentCard 
          key={doc.id}
          document={doc}
          onDownload={onDownload}
          onPrint={() => onPrint(doc.file_path, doc.file_type)}
          onShare={onShare}
          onView={onView}
          onDelete={onDelete}
          onVisibilityChange={onVisibilityChange}
        />
      ))}
    </div>
  );
};

export default MedicalDocumentList;
