
// Main entry point for directive utilities
// Re-exports all functions from specialized files
export { extractPatientInfo } from './patientInfo';
export { checkDirectivesExistence } from './directiveExistence';
export { getDirectivesFromContent } from './directiveRetrieval';

// Types
export type { DirectiveSource, DirectiveExtractResult } from './types';
