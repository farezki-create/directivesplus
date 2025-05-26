
import { DocumentCardRefactored } from "@/components/documents/card/DocumentCardRefactored";
import EmptyDocumentsState from "@/components/documents/EmptyDocumentsState";
import { Document } from "@/types/documents";

interface MedicalDocumentListProps {
  documents: Document[];
  loading?: boolean;
  onDownload: (filePath: string, fileName: string) => void;
  onPrint: (filePath: string, fileType?: string) => void;
  onView: (filePath: string, fileType?: string) => void;
  onDelete: (documentId: string) => void;
  onVisibilityChange?: (documentId: string, isPrivate: boolean) => void;
  documentToDelete?: string | null;
  setDocumentToDelete?: (id: string | null) => void;
  confirmDelete?: (id: string) => void;
}

const MedicalDocumentList = ({
  documents,
  loading = false,
  onDownload,
  onPrint,
  onView,
  onDelete,
  onVisibilityChange
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
        <div key={doc.id} className="border rounded-lg p-6 bg-white">
          <DocumentCardRefactored 
            document={doc}
            onDownload={onDownload}
            onPrint={onPrint}
            onView={onView}
            onDelete={onDelete}
            onVisibilityChange={onVisibilityChange}
            showPrint={true}
            showShare={false}
          />
        </div>
      ))}
    </div>
  );
};

export default MedicalDocumentList;
