
// Main entry point for directive hooks
export { useDossierDocuments } from './useDossierDocuments';
export { useDirectivesState } from './useDirectivesState';

// Re-export utilities
export { extractDocumentsFromDossier } from './utils/documentExtractor';
export { 
  transformDossierDocuments, 
  transformDirectiveDocuments, 
  createSingleDocument 
} from './utils/documentTransformers';
