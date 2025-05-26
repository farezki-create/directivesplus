
import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import DirectivesLoadingState from "@/components/documents/DirectivesLoadingState";
import AuthenticatedDirectivesView from "@/components/directives/AuthenticatedDirectivesView";
import PublicDirectivesView from "@/components/directives/PublicDirectivesView";
import { Document } from "@/types/documents";
import { User } from "@supabase/supabase-js";

interface DirectivesAccessManagerProps {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: User | null;
  profile: any;
  documents: Document[];
  dossierActif: any;
  publicAccessVerified: boolean;
  urlParams: any;
  institutionAccess: any;
  showAddOptions: boolean;
  setShowAddOptions: (show: boolean) => void;
  showAddOptionsPublic: boolean;
  setShowAddOptionsPublic: (show: boolean) => void;
  documentToDelete: Document | null;
  setDocumentToDelete: (doc: Document | null) => void;
  previewDocument: string | null;
  setPreviewDocument: (filePath: string | null) => void;
  handleUploadCompleteWrapper: () => void;
  handleDownload: (filePath: string, fileName: string) => void;
  handlePrint: (filePath: string, fileType?: string) => void;
  handleViewDocument: (filePath: string, fileType?: string) => void;
  handleDelete: (document: Document) => Promise<void>;
  handlePreviewDownload: (filePath: string) => void;
  handlePreviewPrint: (filePath: string, fileType?: string) => void;
}

export const DirectivesAccessManager: React.FC<DirectivesAccessManagerProps> = ({
  isLoading,
  isAuthenticated,
  user,
  profile,
  documents,
  dossierActif,
  publicAccessVerified,
  urlParams,
  institutionAccess,
  showAddOptions,
  setShowAddOptions,
  showAddOptionsPublic,
  setShowAddOptionsPublic,
  documentToDelete,
  setDocumentToDelete,
  previewDocument,
  setPreviewDocument,
  handleUploadCompleteWrapper,
  handleDownload,
  handlePrint,
  handleViewDocument,
  handleDelete,
  handlePreviewDownload,
  handlePreviewPrint
}) => {
  // Loading state
  if (isLoading) {
    return <DirectivesLoadingState />;
  }

  // Institution access error
  if (urlParams?.hasAllParams && institutionAccess?.error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto p-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {institutionAccess.error}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  // Authenticated user view
  if (isAuthenticated && user) {
    return (
      <AuthenticatedDirectivesView
        user={user}
        profile={profile}
        documents={documents}
        showAddOptions={showAddOptions}
        setShowAddOptions={setShowAddOptions}
        onUploadComplete={handleUploadCompleteWrapper}
        onDownload={handleDownload}
        onPrint={handlePrint}
        onView={handleViewDocument}
        documentToDelete={documentToDelete}
        setDocumentToDelete={setDocumentToDelete}
        handleDelete={handleDelete}
        previewDocument={previewDocument}
        setPreviewDocument={setPreviewDocument}
        handlePreviewDownload={handlePreviewDownload}
        handlePreviewPrint={handlePreviewPrint}
      />
    );
  }

  // Public access view with proper document transformation
  if (!isAuthenticated && (publicAccessVerified || dossierActif)) {
    let documentsToDisplay = documents;
    
    // Transform dossier documents if available
    if (dossierActif?.contenu?.documents) {
      documentsToDisplay = dossierActif.contenu.documents.map((doc: any, index: number): Document => ({
        id: doc.id || `doc-${index}`,
        file_name: doc.file_name || doc.fileName || `Document ${index + 1}`,
        file_path: doc.file_path || doc.filePath || '',
        file_type: doc.file_type || doc.fileType || 'application/pdf',
        content_type: doc.content_type || doc.contentType || 'application/pdf',
        user_id: doc.user_id || doc.userId || '',
        created_at: doc.created_at || doc.createdAt || new Date().toISOString(),
        description: doc.description,
        file_size: doc.file_size || doc.fileSize,
        updated_at: doc.updated_at || doc.updatedAt,
        external_id: doc.external_id || doc.externalId
      }));
    }

    console.log("DirectivesAccessManager - Documents à afficher:", documentsToDisplay);

    return (
      <PublicDirectivesView
        dossierActif={dossierActif}
        profile={profile}
        documents={documentsToDisplay}
        onDownload={handleDownload}
        onPrint={handlePrint}
        onView={handleViewDocument}
        previewDocument={previewDocument}
        setPreviewDocument={setPreviewDocument}
        handlePreviewDownload={handlePreviewDownload}
        handlePreviewPrint={handlePreviewPrint}
        showAddOptions={showAddOptionsPublic}
        setShowAddOptions={setShowAddOptionsPublic}
        onUploadComplete={handleUploadCompleteWrapper}
      />
    );
  }

  // No access view
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md mx-auto p-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Accès non autorisé. Veuillez vous authentifier pour accéder aux directives.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
};
