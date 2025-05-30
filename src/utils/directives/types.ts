
import { DirectiveDocument, PatientData, DirectiveItem, InstitutionAccessState } from "@/types/directivesTypes";
import { useDirectivesStore } from "@/store/directivesStore";

// Re-export types for backward compatibility
export type { DirectiveDocument, PatientData, DirectiveItem, InstitutionAccessState };

// Helper functions for type checking
export const isDirectiveDocument = (item: any): item is DirectiveDocument => {
  return item && typeof item.id === 'string' && typeof item.file_name === 'string';
};

export const isPatientData = (item: any): item is PatientData => {
  return item && typeof item.first_name === 'string' && typeof item.last_name === 'string';
};

export const createEmptyDirectivesState = () => {
  return {
    documents: [],
    currentDocument: null
  };
};
