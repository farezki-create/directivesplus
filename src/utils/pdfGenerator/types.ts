
// Interface for PDF generation data
export interface PdfData {
  profileData: any;
  responses: Record<string, any>;
  examplePhrases: string[];
  customPhrases: string[];
  trustedPersons: any[];
  freeText: string;
  signature: string | null;
  userId?: string;
}

// Legacy alias for backward compatibility
export interface PDFData extends PdfData {}
