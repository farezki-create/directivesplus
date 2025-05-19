
import * as z from "zod";

// Schéma de validation pour le formulaire
export const directivesFormSchema = z.object({
  firstName: z.string().min(1, "Le prénom est requis"),
  lastName: z.string().min(1, "Le nom est requis"),
  birthDate: z.string().optional(),
  accessCode: z.string().min(1, "Le code d'accès est requis")
});

export type DirectivesFormData = z.infer<typeof directivesFormSchema>;

export type DirectivesVerificationResult = {
  isValid: boolean;
  error?: string;
  errorType?: 'connection' | 'noProfiles' | 'invalidCode' | 'general';
  userId?: string;
  profileData?: any;
};
