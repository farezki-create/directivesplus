
// Point d'entrée principal pour tous les services de codes d'accès
export { AccessCodeService } from "./AccessCodeService";
export { CodeGenerationService } from "./codeGeneration";
export { ValidationService } from "./validation";
export { DiagnosticService } from "./diagnostic";
export { CodeManagementService } from "./codeManagement";
export { DocumentRetrievalService } from "./documentRetrieval";
export { AnonymousValidationService } from "./anonymousValidation";

// Réexportation des types
export type {
  PersonalInfo,
  AccessCodeOptions,
  AccessValidationResult,
  CodeGenerationResult,
  ShareableDocument,
  DocumentBundle
} from "@/types/accessCode";
