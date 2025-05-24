
import React from "react";
import { useNavigate } from "react-router-dom";
import { useDossierStore } from "@/store/dossierStore";
import PageHeader from "@/components/layout/PageHeader";
import PageFooter from "@/components/layout/PageFooter";
import { extractPatientInfo } from "@/utils/patient/patientInfoExtractor";
import PatientHeader from "@/components/directives-access/PatientHeader";
import StatisticsCards from "@/components/directives-access/StatisticsCards";
import DirectivesContent from "@/components/directives-access/DirectivesContent";
import SecurityAlert from "@/components/directives-access/SecurityAlert";
import PersonalDocumentsSection from "@/components/directives-access/PersonalDocumentsSection";

interface DossierViewProps {
  isAuthenticated: boolean;
  user: any;
  showDocuments: boolean;
  documents: any[];
  onUploadComplete: () => void;
  onDownload: (filePath: string, fileName: string) => void;
  onPrint: (filePath: string, contentType?: string) => void;
  onView: (filePath: string, contentType?: string) => void;
  onDelete: (documentId: string) => void;
  onShowDocuments: () => void;
}

const DossierView: React.FC<DossierViewProps> = ({
  isAuthenticated,
  user,
  showDocuments,
  documents,
  onUploadComplete,
  onDownload,
  onPrint,
  onView,
  onDelete,
  onShowDocuments
}) => {
  const navigate = useNavigate();
  const { dossierActif, clearDossierActif } = useDossierStore();

  const handleReturnHome = () => {
    clearDossierActif();
    navigate("/");
  };

  if (!dossierActif) {
    return null;
  }

  const patientInfo = extractPatientInfo(dossierActif);
  const directives = dossierActif.contenu?.documents || [];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <PageHeader />
      
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="max-w-4xl mx-auto space-y-6">
          
          <PatientHeader 
            patientInfo={patientInfo}
            onReturnHome={handleReturnHome}
          />

          <StatisticsCards directivesCount={directives.length} />

          <DirectivesContent directives={directives} />

          {isAuthenticated && (
            <PersonalDocumentsSection
              isAuthenticated={isAuthenticated}
              user={user}
              showDocuments={showDocuments}
              documents={documents}
              onShowDocuments={onShowDocuments}
              onUploadComplete={onUploadComplete}
              onDownload={onDownload}
              onPrint={onPrint}
              onView={onView}
              onDelete={onDelete}
            />
          )}

          <SecurityAlert />
        </div>
      </main>
      
      <PageFooter />
    </div>
  );
};

export default DossierView;
