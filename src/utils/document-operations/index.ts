
// Re-export document operations from individual files
export { 
  viewDocument, 
  downloadDocument, 
  printDocument 
} from './document-operations';

// Export shareDocument from its dedicated file
export * from './shareDocument';

// This pattern makes imports cleaner in the rest of the application
