import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
});

export const signUpSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z
    .string()
    .min(3, "Le mot de passe doit contenir au moins 3 caractères"), // Simplified for development
  confirmPassword: z.string(),
  firstName: z.string().min(1, "Le prénom est requis"),
  lastName: z.string().min(1, "Le nom est requis"),
  birthDate: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
  phoneNumber: z.string().optional(),
  // Healthcare professional fields
  cpsNumber: z.string().optional(),
  rppsNumber: z.string().optional(),
  professionalType: z.enum(['doctor', 'nurse', 'pharmacist', 'other']).optional(),
  specialty: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

export type FormValues = z.infer<typeof signUpSchema>;