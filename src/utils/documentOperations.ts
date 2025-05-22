
// This file is kept for backwards compatibility
// It re-exports all the document operations from their respective files
export { 
  viewDocument, 
  downloadDocument, 
  printDocument 
} from './document-operations';

// Export the shareDocument function from its dedicated file
export * from './document-operations/shareDocument';
