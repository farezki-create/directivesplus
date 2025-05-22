
import * as z from "zod";

// Schema de validation pour le formulaire
export const formSchema = z.object({
  firstName: z.string().min(1, "Le prénom est requis"),
  lastName: z.string().min(1, "Le nom est requis"),
  birthDate: z.string().min(1, "La date de naissance est requise"),
  accessCode: z.string().min(1, "Le code d'accès est requis")
});

export type FormData = z.infer<typeof formSchema>;
