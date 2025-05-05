
import { z } from "zod";

/**
 * Zod schema for medical questionnaire data validation
 */
export const medicalQuestionnaireSchema = z.object({
  nom: z.string().optional(),
  prenom: z.string().optional(),
  date_naissance: z.string().optional(),
  sexe: z.enum(["H", "F", "Autre"]).optional(),
  secu: z.string().optional(),
  adresse: z.string().optional(),
  telephone: z.string().optional(),
  personne_prevenir: z.string().optional(),
  motif: z.string().optional(),
  debut_symptomes: z.string().optional(),
  evolution: z.enum(["aggravation", "amelioration", "stable"]).optional(),
  symptomes: z.array(z.string()).optional(),
  autres_symptomes: z.string().optional(),
  pathologies: z.array(z.string()).optional(),
  antecedents: z.string().optional(),
  chirurgies: z.array(z.string()).optional(),
  autres_chirurgies: z.string().optional(),
  hospitalisations: z.string().optional(),
  allergies: z.array(z.string()).optional(),
  traitements: z.string().optional(),
  famille: z.array(z.string()).optional(),
  tabac: z.boolean().optional(),
  alcool: z.boolean().optional(),
  drogues: z.boolean().optional(),
  activite_physique: z.boolean().optional(),
  dispositifs: z.string().optional(),
  directives: z.string().optional(),
  contexte_social_vie: z.string().optional(),
  contexte_social_profession: z.string().optional(),
  contexte_social_couverture: z.string().optional(),
  details_motif: z.string().optional(), // Added field for consultation details
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
];

/**
 * List of possible pathologies
 */
export const pathologiesList = [
  "Hypertension artérielle",
  "Diabète",
  "Asthme",
  "Maladie cardiaque",
  "Cancer",
  "Maladie rénale",
  "Maladie hépatique",
  "Maladie auto-immune",
  "Maladie neurologique",
  "Dépression/Anxiété",
  "Autres"
];

/**
 * List of possible chirurgies
 */
export const chirurgiesList = [
  "Appendicectomie",
  "Amygdalectomie",
  "Cholécystectomie",
  "Chirurgie cardiaque",
  "Chirurgie orthopédique",
  "Césarienne",
  "Chirurgie abdominale",
  "Neurochirurgie",
  "Autres"
];

/**
 * List of possible implanted medical devices
 */
export const dispositifsList = [
  "Pacemaker (stimulateur cardiaque)",
  "Défibrillateur implantable (DAI ou ICD)",
  "Prothèse totale de hanche (PTH)",
  "Prothèse totale de genou (PTG)",
  "Stents coronaires (ou autres stents vasculaires)",
  "Valves cardiaques mécaniques ou biologiques",
  "Cathéter veineux central implantable (chambre implantable, type Port-à-Cath)"
];
