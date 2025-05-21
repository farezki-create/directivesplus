
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
  loading?: boolean; // Add loading prop
  onDownload: (filePath: string, fileName: string) => void;
  onPrint: (filePath: string, fileType?: string) => void;
  onView: (filePath: string, fileType?: string) => void;
  onDelete: (documentId: string) => void;
  onVisibilityChange?: (documentId: string, isPrivate: boolean) => void;
  documentToDelete?: string | null; // Make optional
  setDocumentToDelete?: (id: string | null) => void; // Make optional
  confirmDelete?: (id: string) => void; // Make optional
}

const MedicalDocumentList = ({
  documents,
  loading = false,
  onDownload,
  onPrint,
  onView,
  onDelete,
  onVisibilityChange,
  documentToDelete,
  setDocumentToDelete,
  confirmDelete
}: MedicalDocumentListProps) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-directiveplus-600"></div>
      </div>
    );
  }

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
          onPrint={onPrint}
          onView={onView}
          onDelete={onDelete}
          onVisibilityChange={onVisibilityChange}
        />
      ))}
    </div>
  );
};

export default MedicalDocumentList;
