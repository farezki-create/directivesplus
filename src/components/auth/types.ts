import { z } from "zod";
import { COUNTRY_PREFIXES } from "./constants";

const baseSchema = {
  email: z.string().email("Email invalide"),
  password: z.string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une lettre majuscule")
    .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre")
    .regex(/[a-z]/, "Le mot de passe doit contenir au moins une lettre minuscule")
    .regex(/[^a-zA-Z0-9]/, "Le mot de passe doit contenir au moins un caractère spécial (!@#$%^&*)")
};

export const loginSchema = z.object(baseSchema);

export const signUpSchema = z.object({
  ...baseSchema,
  confirmPassword: z.string().min(1, "Veuillez confirmer votre mot de passe"),
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  birthDate: z.string().min(1, "La date de naissance est requise"),
  country: z.string().min(1, "Le pays est requis"),
  phoneNumber: z.string().min(9, "Le numéro de téléphone doit contenir au moins 9 chiffres"),
  address: z.string().min(5, "L'adresse doit contenir au moins 5 caractères"),
  city: z.string().min(2, "La ville doit contenir au moins 2 caractères"),
  postalCode: z.string().min(5, "Le code postal doit contenir au moins 5 caractères"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

export type FormValues = z.infer<typeof signUpSchema>;
export type CountryKey = keyof typeof COUNTRY_PREFIXES;