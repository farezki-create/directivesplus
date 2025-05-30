
import { z } from "zod";

// Input validation schemas
export const accessCodeSchema = z.object({
  accessCode: z.string()
    .min(6, "Le code d'accès doit contenir au moins 6 caractères")
    .max(20, "Le code d'accès ne peut pas dépasser 20 caractères")
    .regex(/^[A-Z0-9]+$/, "Le code d'accès ne peut contenir que des lettres majuscules et des chiffres"),
  firstName: z.string()
    .min(1, "Le prénom est requis")
    .max(50, "Le prénom ne peut pas dépasser 50 caractères")
    .regex(/^[a-zA-ZÀ-ÿ\s-']+$/, "Le prénom contient des caractères invalides"),
  lastName: z.string()
    .min(1, "Le nom est requis")
    .max(50, "Le nom ne peut pas dépasser 50 caractères")
    .regex(/^[a-zA-ZÀ-ÿ\s-']+$/, "Le nom contient des caractères invalides"),
  birthDate: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Format de date invalide")
    .refine((date) => {
      const birthDate = new Date(date);
      const today = new Date();
      const hundredYearsAgo = new Date();
      hundredYearsAgo.setFullYear(today.getFullYear() - 120);
      
      return birthDate <= today && birthDate >= hundredYearsAgo;
    }, "Date de naissance invalide")
});

export const institutionAccessSchema = z.object({
  institutionCode: z.string()
    .min(8, "Le code institution doit contenir au moins 8 caractères")
    .max(20, "Le code institution ne peut pas dépasser 20 caractères")
    .regex(/^[A-Z0-9]+$/, "Le code institution ne peut contenir que des lettres majuscules et des chiffres"),
  professionalId: z.string()
    .min(6, "L'identifiant professionnel doit contenir au moins 6 caractères")
    .max(15, "L'identifiant professionnel ne peut pas dépasser 15 caractères")
    .regex(/^[0-9]+$/, "L'identifiant professionnel ne peut contenir que des chiffres"),
  firstName: z.string()
    .min(1, "Le prénom est requis")
    .max(50, "Le prénom ne peut pas dépasser 50 caractères")
    .regex(/^[a-zA-ZÀ-ÿ\s-']+$/, "Le prénom contient des caractères invalides"),
  lastName: z.string()
    .min(1, "Le nom est requis")
    .max(50, "Le nom ne peut pas dépasser 50 caractères")
    .regex(/^[a-zA-ZÀ-ÿ\s-']+$/, "Le nom contient des caractères invalides"),
  birthDate: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Format de date invalide")
});

// Sanitization functions
export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>\"'&]/g, '') // Remove potentially dangerous characters
    .substring(0, 1000); // Limit length
};

export const sanitizeFileName = (fileName: string): string => {
  return fileName
    .replace(/[^a-zA-Z0-9.\-_]/g, '_') // Replace special chars with underscore
    .replace(/_{2,}/g, '_') // Remove multiple underscores
    .substring(0, 255); // Limit length
};

// XSS protection
export const escapeHtml = (text: string): string => {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};

// Validate file uploads
export const validateFileUpload = (file: File): { valid: boolean; error?: string } => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  if (file.size > maxSize) {
    return { valid: false, error: 'Le fichier ne peut pas dépasser 10MB' };
  }

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Type de fichier non autorisé' };
  }

  // Check file name
  if (file.name.length > 255) {
    return { valid: false, error: 'Le nom du fichier est trop long' };
  }

  if (!/^[a-zA-Z0-9.\-_\s]+$/.test(file.name)) {
    return { valid: false, error: 'Le nom du fichier contient des caractères non autorisés' };
  }

  return { valid: true };
};

// IP address validation
export const isValidIP = (ip: string): boolean => {
  const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
  
  return ipv4Regex.test(ip) || ipv6Regex.test(ip);
};

// User agent validation
export const isValidUserAgent = (userAgent: string): boolean => {
  if (!userAgent || userAgent.length < 10 || userAgent.length > 500) {
    return false;
  }
  
  // Basic check for common user agent patterns
  const commonPatterns = ['Mozilla', 'Chrome', 'Safari', 'Firefox', 'Edge', 'Opera'];
  return commonPatterns.some(pattern => userAgent.includes(pattern));
};
