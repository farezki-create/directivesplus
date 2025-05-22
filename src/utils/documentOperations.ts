
// This file is kept for backwards compatibility
// It re-exports all the document operations from their respective files

// Import operations from document-operations folder
export { 
  viewDocument, 
  downloadDocument, 
  printDocument 
} from './document-operations/document-operations';

// Import shareDocument from its dedicated file
export { shareDocument } from './document-operations/shareDocument';
