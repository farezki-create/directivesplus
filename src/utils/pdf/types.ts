
import { jsPDF } from "jspdf";

// Define the PDF layout interface
export interface PdfLayout {
  margin: number;
  pageWidth: number;
  pageHeight: number;
  lineHeight: number;
  contentWidth: number;
  footerHeight: number;
}

export interface SectionData {
  title: string;
  content: string | string[];
}

export interface ContactPerson {
  firstName: string;
  lastName: string;
  relationship: string;
  phone: string;
  email: string;
}

export interface HealthcareDirective {
  directive: string;
}

export interface QuestionResponse {
  question: string;
  response: string;
}
