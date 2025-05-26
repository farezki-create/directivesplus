
import jsPDF from 'jspdf';
import { 
  addBasicHeader, 
  addBasicFooter, 
  addSectionTitle, 
  addParagraph,
  addSignatureSection,
  addContactPersonsSection,
  addDirectivesSection,
  addQuestionnairesSection
} from '../pdf';
import type { PDFData } from './types';
import { processProfileData, processDirectivesData } from './dataProcessor';

export const buildPDF = (data: PDFData): jsPDF => {
  const doc = new jsPDF();
  let yPosition = 20;

  // Header
  yPosition = addBasicHeader(doc, yPosition);
  
  // Profile data
  const profileData = processProfileData(data.profileData);
  if (profileData) {
    yPosition = addSectionTitle(doc, 'Informations personnelles', yPosition);
    yPosition = addParagraph(doc, profileData, yPosition);
  }

  // Contact persons
  if (data.trustedPersons && data.trustedPersons.length > 0) {
    yPosition = addContactPersonsSection(doc, data.trustedPersons, yPosition);
  }

  // Questionnaires
  if (data.responses) {
    yPosition = addQuestionnairesSection(doc, data.responses, yPosition);
  }

  // Directives
  const directivesData = processDirectivesData(data);
  if (directivesData) {
    yPosition = addDirectivesSection(doc, directivesData, yPosition);
  }

  // Signature
  yPosition = addSignatureSection(doc, yPosition);

  // Footer
  addBasicFooter(doc);

  return doc;
};
