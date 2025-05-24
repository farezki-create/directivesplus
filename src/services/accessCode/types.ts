
import type { ShareableDocument } from "@/types/sharing";

/**
 * Types pour le gestionnaire unifié de codes d'accès
 */
export interface AccessCodeOptions {
  expiresInDays?: number;
  requirePersonalInfo?: boolean;
}

export interface AccessCodeValidation {
  success: boolean;
  documents?: ShareableDocument[];
  message?: string;
  error?: string;
}

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  birthDate: string;
}

/**
 * Structure pour les données stockées dans Supabase (compatible avec Json)
 */
export interface TemporaryAccessData {
  access_type: string;
  user_id: string;
  total_documents: number;
  generated_at: string;
  documents: any[]; // Utilisation d'any[] pour la compatibilité Json
  [key: string]: any; // Index signature pour la compatibilité
}
