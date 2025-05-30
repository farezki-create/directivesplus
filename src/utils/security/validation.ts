
import { z } from "zod";

// Enhanced validation schemas with security in mind
export const accessCodeSchema = z.object({
  lastName: z.string()
    .min(1, "Nom requis")
    .max(100, "Nom trop long")
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, "Caractères invalides dans le nom"),
  firstName: z.string()
    .min(1, "Prénom requis")
    .max(100, "Prénom trop long")
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, "Caractères invalides dans le prénom"),
  birthDate: z.string()
    .min(1, "Date de naissance requise")
    .refine((date) => {
      const parsed = new Date(date);
      const now = new Date();
      const hundredYearsAgo = new Date(now.getFullYear() - 100, now.getMonth(), now.getDate());
      return parsed <= now && parsed >= hundredYearsAgo;
    }, "Date de naissance invalide"),
  accessCode: z.string()
    .min(6, "Code d'accès trop court")
    .max(20, "Code d'accès trop long")
    .regex(/^[A-Z0-9]+$/, "Le code d'accès ne doit contenir que des lettres majuscules et des chiffres")
});

// Sanitize input to prevent XSS
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
};

// Validate email format with stricter rules
export const emailSchema = z.string()
  .email("Format d'email invalide")
  .max(254, "Email trop long")
  .refine((email) => {
    // Additional validation for common email attacks
    return !email.includes('..') && 
           !email.startsWith('.') && 
           !email.endsWith('.') &&
           !/[<>'"&]/.test(email);
  }, "Format d'email non sécurisé");

// Password validation with security requirements
export const passwordSchema = z.string()
  .min(8, "Le mot de passe doit contenir au moins 8 caractères")
  .max(128, "Mot de passe trop long")
  .regex(/(?=.*[a-z])/, "Au moins une lettre minuscule requise")
  .regex(/(?=.*[A-Z])/, "Au moins une lettre majuscule requise")
  .regex(/(?=.*\d)/, "Au moins un chiffre requis")
  .regex(/(?=.*[!@#$%^&*(),.?":{}|<>])/, "Au moins un caractère spécial requis")
  .refine((password) => {
    // Check for common weak passwords
    const commonPasswords = ['password', '123456', 'qwerty', 'admin'];
    return !commonPasswords.some(common => 
      password.toLowerCase().includes(common)
    );
  }, "Mot de passe trop commun");

// Phone number validation
export const phoneSchema = z.string()
  .regex(/^[\+]?[\d\s\-\(\)]{10,15}$/, "Format de téléphone invalide")
  .optional();

// Name validation with stricter rules
export const nameSchema = z.string()
  .min(1, "Requis")
  .max(50, "Trop long")
  .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, "Caractères invalides");
