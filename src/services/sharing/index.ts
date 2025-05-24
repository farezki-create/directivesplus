
// Export unifié des services de partage
export { AccessCodeService } from './accessCodeService';
export { ValidationService } from './validationService';
export { DocumentService } from './documentService';

// Export des types depuis le module principal
export type { 
  ShareableDocument,
  AccessCodeOptions,
  AccessCodeResult,
  ValidationRequest,
  ValidationResult
} from '@/types/sharing';
