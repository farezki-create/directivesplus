
import jsPDF from 'jspdf';
import { 
  renderHeader,
  renderPersonalInfo,
  renderTrustedPersons,
  renderQuestionnaires,
  renderPhrases,
  renderFreeText,
  renderSignature
} from '../pdf/documentSections';
import { PdfLayout } from '../pdf/types';
import type { PdfData } from './types';

export const buildPDF = (data: PdfData): jsPDF => {
  const doc = new jsPDF();
  
  // Define layout parameters
  const layout: PdfLayout = {
    margin: 20,
    pageWidth: doc.internal.pageSize.getWidth(),
    pageHeight: doc.internal.pageSize.getHeight(),
    lineHeight: 8,
    contentWidth: doc.internal.pageSize.getWidth() - 40,
    footerHeight: 30
  };

  let yPosition = 20;

  // Header
  yPosition = renderHeader(doc, layout, yPosition);
  
  // Profile data
  if (data.profileData) {
    yPosition = renderPersonalInfo(doc, layout, yPosition, data.profileData);
  }

  // Contact persons
  if (data.trustedPersons && data.trustedPersons.length > 0) {
    yPosition = renderTrustedPersons(doc, layout, yPosition, data.trustedPersons);
  }

  // Questionnaires
  if (data.responses) {
    const translateResponse = (response: string): string => {
      const lowerResponse = response.toLowerCase().trim();
      switch(lowerResponse) {
        case 'yes': return 'Oui';
        case 'no': return 'Non';
        case 'unsure': return 'Incertain';
        default: return response;
      }
    };
    yPosition = renderQuestionnaires(doc, layout, yPosition, data.responses, translateResponse);
  }

  // Example phrases
  if (data.examplePhrases && data.examplePhrases.length > 0) {
    yPosition = renderPhrases(doc, layout, yPosition, data.examplePhrases, "Phrases d'exemple sélectionnées");
  }

  // Custom phrases
  if (data.customPhrases && data.customPhrases.length > 0) {
    yPosition = renderPhrases(doc, layout, yPosition, data.customPhrases, "Mes phrases personnalisées");
  }

  // Free text
  if (data.freeText) {
    yPosition = renderFreeText(doc, layout, yPosition, data.freeText);
  }

  // Signature
  if (data.signature) {
    yPosition = renderSignature(doc, layout, yPosition, data.signature);
  }

  return doc;
};
