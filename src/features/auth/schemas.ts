
import * as z from "zod";

export const registerFormSchema = z.object({
  firstName: z.string().min(2, "Le prénom est requis"),
  lastName: z.string().min(2, "Le nom est requis"),
  gender: z.enum(["M", "F", "autre"]).optional(),
  birthDate: z.string().min(1, "La date de naissance est requise"),
  email: z.string().email("Format d'email invalide"),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  postalCode: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  passwordConfirm: z.string(),
}).refine((data) => data.password === data.passwordConfirm, {
  path: ["passwordConfirm"],
  message: "Les mots de passe ne correspondent pas",
});

export type RegisterFormValues = z.infer<typeof registerFormSchema>;

export const loginFormSchema = z.object({
  email: z.string().email("Format d'email invalide"),
  password: z.string().min(1, "Le mot de passe est requis"),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email("Format d'email invalide"),
});

export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z.object({
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "Les mots de passe ne correspondent pas",
});

export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;
