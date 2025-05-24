
// Re-export all functions from the new service modules
export { 
  createSharedDocument, 
  getSharedDocuments, 
  deactivateSharedDocument 
} from "./services/sharedDocumentService";

export { 
  extendSharedDocumentExpiry, 
  regenerateAccessCode 
} from "./services/accessCodeService";

export { 
  getSharedDocumentsByAccessCode 
} from "./services/documentRetrievalService";
