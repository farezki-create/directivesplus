import { z } from "zod";

/**
 * Zod schema for medical questionnaire data validation
 */
export const medicalQuestionnaireSchema = z.object({
  nom: z.string().optional(),
  prenom: z.string().optional(),
  date_naissance: z.string().optional(),
  adresse: z.string().optional(),
  telephone: z.string().optional(),
  motif: z.string().optional(),
  debut_symptomes: z.string().optional(),
  evolution: z.enum(["aggravation", "amelioration", "stable"]).optional(),
  symptomes: z.array(z.string()).optional(),
  autres_symptomes: z.string().optional(),
  pathologies: z.array(z.string()).optional(),
  chirurgies: z.array(z.string()).optional(),
  allergies: z.array(z.string()).optional(),
  autres_allergies: z.string().optional(),
  traitements: z.string().optional(),
  famille: z.array(z.string()).optional(),
  tabac: z.enum(["oui", "non"]).optional(),
  alcool: z.enum(["oui", "non"]).optional(),
  drogues: z.enum(["oui", "non"]).optional(),
  activite_physique: z.enum(["oui", "non"]).optional(),
  dispositifs: z.string().optional(),
  directives: z.string().optional(),
  contexte_social_vie: z.string().optional(),
  contexte_social_profession: z.string().optional(),
  contexte_social_couverture: z.string().optional(),
});

/**
 * Type for medical questionnaire data based on the schema
 */
export type MedicalQuestionnaireData = z.infer<typeof medicalQuestionnaireSchema>;

/**
 * List of possible consultation reasons
 */
export const motifsList = [
  "Douleur",
  "Fièvre",
  "Fatigue",
  "Problèmes respiratoires",
  "Troubles digestifs",
  "Autres",
];

/**
 * List of possible allergies
 */
export const allergiesList = [
  "Médicaments",
  "Aliments",
  "Pollens",
  "Animaux",
  "Piqûres d'insectes",
  "Latex",
  "Autres",
];
