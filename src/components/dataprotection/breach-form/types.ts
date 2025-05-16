
import { z } from "zod";

// Schema for form validation
export const formSchema = z.object({
  breach_type: z.enum(["confidentiality", "integrity", "availability", "multiple"], {
    required_error: "Veuillez sélectionner un type de violation",
  }),
  description: z.string().min(10, {
    message: "La description doit contenir au moins 10 caractères",
  }),
  affected_data_types: z.array(z.string()).min(1, {
    message: "Veuillez sélectionner au moins un type de données affecté",
  }),
  affected_users_count: z.string().optional(),
  detection_date: z.string().min(1, {
    message: "Veuillez indiquer la date de détection",
  }),
  remediation_measures: z.string().min(10, {
    message: "Veuillez décrire les mesures prises",
  }),
  is_notified_to_authorities: z.boolean().default(false),
  is_notified_to_users: z.boolean().default(false),
  reporter_name: z.string().min(3, {
    message: "Veuillez indiquer votre nom",
  }),
  reporter_email: z.string().email({
    message: "Veuillez indiquer une adresse email valide",
  }),
  risk_level: z.enum(["low", "medium", "high", "critical"], {
    required_error: "Veuillez sélectionner un niveau de risque",
  }),
  is_data_encrypted: z.boolean().default(false)
});

export type FormSchema = z.infer<typeof formSchema>;

export const dataTypeOptions = [
  { id: "personal_data", label: "Données d'identification" },
  { id: "contact_info", label: "Coordonnées" },
  { id: "health_data", label: "Données de santé" },
  { id: "advance_directives", label: "Directives anticipées" },
  { id: "medical_documents", label: "Documents médicaux" },
  { id: "trusted_persons", label: "Personnes de confiance" },
  { id: "authentication", label: "Données d'authentification" },
  { id: "access_logs", label: "Journaux d'accès" }
];
