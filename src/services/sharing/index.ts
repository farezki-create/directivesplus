
// Export unifié des services de partage
export { AccessCodeService } from './accessCodeService';
export { ValidationService } from './validationService';
export { DocumentService } from './documentService';

export type {
  AccessCodeOptions,
  AccessCodeResult
} from './accessCodeService';

export type {
  ValidationRequest,
  ValidationResult
} from './validationService';

// Export des types depuis le module principal
export type { ShareableDocument } from '@/types/sharing';
