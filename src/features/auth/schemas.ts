
import { z } from "zod";

export const registerFormSchema = z.object({
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  gender: z.enum(["M", "F", "Autre"]).optional(),
  birthDate: z.string().min(1, "La date de naissance est obligatoire"),
  email: z.string().email("Format d'email invalide"),
  phoneNumber: z.string()
    .min(8, "Le numéro de téléphone doit contenir au moins 8 chiffres")
    .max(15, "Le numéro de téléphone ne peut pas dépasser 15 chiffres")
    .regex(/^\d+$/, "Le numéro de téléphone ne doit contenir que des chiffres"),
  address: z.string().optional(),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  passwordConfirm: z.string(),
}).refine((data) => data.password === data.passwordConfirm, {
  message: "Les mots de passe ne correspondent pas",
  path: ["passwordConfirm"],
});

export const loginFormSchema = z.object({
  email: z.string().email("Format d'email invalide"),
  password: z.string().min(1, "Le mot de passe est obligatoire"),
});

export type RegisterFormValues = z.infer<typeof registerFormSchema>;
export type LoginFormValues = z.infer<typeof loginFormSchema>;
