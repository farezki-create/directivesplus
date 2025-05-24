
import React from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/layout/PageHeader";
import PageFooter from "@/components/layout/PageFooter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PersonalDocumentsSection from "@/components/directives-access/PersonalDocumentsSection";
import SecurityAlert from "@/components/directives-access/SecurityAlert";

interface AuthenticatedViewProps {
  user: any;
  documents: any[];
  onUploadComplete: () => void;
  onDownload: (filePath: string, fileName: string) => void;
  onPrint: (filePath: string, contentType?: string) => void;
  onView: (filePath: string, contentType?: string) => void;
  onDelete: (documentId: string) => void;
}

const AuthenticatedView: React.FC<AuthenticatedViewProps> = ({
  user,
  documents,
  onUploadComplete,
  onDownload,
  onPrint,
  onView,
  onDelete
}) => {
  const navigate = useNavigate();

  const handleReturnHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <PageHeader />
      
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="max-w-4xl mx-auto space-y-6">
          
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-blue-800 mb-2">
                Mes Documents Personnels
              </h2>
              <p className="text-blue-700 mb-4">
                Vous êtes connecté. Consultez vos documents personnels ci-dessous.
              </p>
              <Button onClick={handleReturnHome} variant="outline" size="sm">
                Retour à l'accueil
              </Button>
            </CardContent>
          </Card>

          <PersonalDocumentsSection
            isAuthenticated={true}
            user={user}
            showDocuments={true}
            documents={documents}
            onShowDocuments={() => {}}
            onUploadComplete={onUploadComplete}
            onDownload={onDownload}
            onPrint={onPrint}
            onView={onView}
            onDelete={onDelete}
          />

          <SecurityAlert />
        </div>
      </main>
      
      <PageFooter />
    </div>
  );
};

export default AuthenticatedView;
