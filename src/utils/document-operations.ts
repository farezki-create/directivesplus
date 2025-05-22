
// Utility file for document operations
// This file is created for backward compatibility with older code

// Import specific functions from document-operations.ts
export { 
  viewDocument, 
  downloadDocument, 
  printDocument 
} from './document-operations/document-operations';

// Import shareDocument from its dedicated file
export { shareDocument } from './document-operations/shareDocument';
