
export const determineDocumentType = (document: any): string => {
  if (document.source) {
    return document.source;
  }
  
  if (document.file_type === 'directive') {
    return 'directives';
  }
  
  return 'pdf_documents';
};

export const calculateExpirationDate = (daysFromNow: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString();
};

export const formatShareMessage = (fileName: string, accessCode: string): string => {
  return `${fileName} a été partagé. Code d'accès : ${accessCode}`;
};
