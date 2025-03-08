
import { Button } from "@/components/ui/button";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { PDFDocument } from "@/components/pdf/PDFDocumentGenerator";
import { useLanguage } from "@/hooks/useLanguage";

interface ExportButtonProps {
  data: {
    responses: {
      general: any[];
      lifeSupport: any[];
      advancedIllness: any[];
      preferences: any[];
    };
    synthesis?: {
      free_text: string;
    } | null;
    userId: string;
  };
}

export function ExportButton({ data }: ExportButtonProps) {
  const { t } = useLanguage();
  
  if (!data) return null;

  // Extract the necessary data for PDF generation
  const pdfData = {
    userId: data.userId,
    generalResponses: data.responses.general,
    lifeSupportResponses: data.responses.lifeSupport,
    advancedIllnessResponses: data.responses.advancedIllness,
    preferencesResponses: data.responses.preferences,
    synthesis: data.synthesis?.free_text || '',
  };
  
  // Create a unique filename with timestamp
  const filename = `directives-anticipees-${new Date().toISOString().slice(0, 10)}.pdf`;

  return (
    <PDFDownloadLink
      document={<PDFDocument data={pdfData} />}
      fileName={filename}
      className="mt-4 block"
    >
      {({ loading }) => (
        <Button variant="outline" size="default" className="w-full" disabled={loading}>
          {loading ? t('generatingPDF') : t('exportPDF')}
        </Button>
      )}
    </PDFDownloadLink>
  );
}
