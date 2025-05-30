
// Main entry point for directive utilities
// Re-exports all functions from specialized files
export { getPatientInfo, hasPatientInfo, formatPatientName } from './patientInfo';
export { checkDirectiveExistence, getDirectiveCount, hasValidDirectives } from './directiveExistence';
export { retrieveDirectives, getDirectiveById, getDirectiveByPath } from './directiveRetrieval';

// Types
export type { DirectiveDocument, PatientData, DirectiveItem, InstitutionAccessState } from './types';
