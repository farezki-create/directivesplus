
import { z } from 'zod';

// Enhanced access code validation with security checks
export const accessCodeSchema = z.object({
  lastName: z.string()
    .min(1, "Le nom de famille est requis")
    .max(50, "Le nom de famille ne peut pas dépasser 50 caractères")
    .regex(/^[a-zA-ZÀ-ÿ\s\-']+$/, "Le nom de famille ne peut contenir que des lettres, espaces, tirets et apostrophes"),
  
  firstName: z.string()
    .min(1, "Le prénom est requis")
    .max(50, "Le prénom ne peut pas dépasser 50 caractères")
    .regex(/^[a-zA-ZÀ-ÿ\s\-']+$/, "Le prénom ne peut contenir que des lettres, espaces, tirets et apostrophes"),
  
  birthDate: z.string()
    .min(1, "La date de naissance est requise")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Format de date invalide (YYYY-MM-DD)")
    .refine((date) => {
      const parsedDate = new Date(date);
      const now = new Date();
      const minDate = new Date('1900-01-01');
      return parsedDate >= minDate && parsedDate <= now;
    }, "Date de naissance invalide"),
  
  accessCode: z.string()
    .min(1, "Le code d'accès est requis")
    .max(20, "Le code d'accès ne peut pas dépasser 20 caractères")
    .regex(/^[A-Z0-9]+$/, "Le code d'accès ne peut contenir que des lettres majuscules et des chiffres")
});

// Professional ID validation for institution access
export const professionalIdSchema = z.string()
  .min(1, "Le numéro professionnel est requis")
  .regex(/^\d{8,11}$/, "Le numéro professionnel doit contenir entre 8 et 11 chiffres");

// Institution access validation
export const institutionAccessSchema = z.object({
  lastName: accessCodeSchema.shape.lastName,
  firstName: accessCodeSchema.shape.firstName,
  birthDate: accessCodeSchema.shape.birthDate,
  institutionCode: z.string()
    .min(1, "Le code institution est requis")
    .max(20, "Le code institution ne peut pas dépasser 20 caractères")
    .regex(/^[A-Z0-9]+$/, "Le code institution ne peut contenir que des lettres majuscules et des chiffres"),
  professionalId: professionalIdSchema
});

// Enhanced email validation
export const emailSchema = z.string()
  .email("Adresse email invalide")
  .max(254, "L'adresse email ne peut pas dépasser 254 caractères")
  .refine((email) => {
    // Additional security checks
    const suspiciousPatterns = [
      /script/i,
      /<.*>/,
      /javascript:/i,
      /data:/i
    ];
    return !suspiciousPatterns.some(pattern => pattern.test(email));
  }, "Adresse email contient des caractères non autorisés");

// Phone number validation
export const phoneSchema = z.string()
  .regex(/^[0-9\s\-\+\(\)]{10,20}$/, "Numéro de téléphone invalide")
  .optional();

// Secure text validation (prevents XSS)
export const secureTextSchema = z.string()
  .max(1000, "Le texte ne peut pas dépasser 1000 caractères")
  .refine((text) => {
    const dangerousPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+=/i,
      /<iframe/i,
      /<object/i,
      /<embed/i
    ];
    return !dangerousPatterns.some(pattern => pattern.test(text));
  }, "Le texte contient des éléments non autorisés");

// Validation helper functions
export const validateAccessCode = (accessCode: string): boolean => {
  try {
    accessCodeSchema.shape.accessCode.parse(accessCode);
    return true;
  } catch {
    return false;
  }
};

export const validateEmail = (email: string): boolean => {
  try {
    emailSchema.parse(email);
    return true;
  } catch {
    return false;
  }
};

export const sanitizeAndValidateInput = <T>(
  data: T,
  schema: z.ZodSchema<T>
): { isValid: boolean; data?: T; errors?: string[] } => {
  try {
    const validatedData = schema.parse(data);
    return { isValid: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => err.message);
      return { isValid: false, errors };
    }
    return { isValid: false, errors: ['Validation failed'] };
  }
};
