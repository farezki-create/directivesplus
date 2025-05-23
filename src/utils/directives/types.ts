
import { Dossier } from "@/store/dossierStore";

/**
 * Types related to directives
 */

/**
 * Source of the directives data
 */
export type DirectiveSource = 
  | 'direct' 
  | 'content' 
  | 'contenu' 
  | 'meta' 
  | 'pdf_contenu'
  | 'objet_direct'
  | 'image miroir';

/**
 * Result from directives extraction
 */
export interface DirectiveExtractResult {
  directives: any;
  source: DirectiveSource | string;
}

/**
 * Interface for patient information
 */
export interface PatientInfo {
  firstName: string;
  lastName: string;
  birthDate: string | null;
  gender: string | null;
}
