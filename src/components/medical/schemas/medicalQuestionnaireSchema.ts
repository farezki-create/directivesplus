
import * as z from "zod";

export const medicalQuestionnaireSchema = z.object({
  // Section 1: Informations générales
  nom: z.string().min(2, "Le nom est requis"),
  prenom: z.string().min(2, "Le prénom est requis"),
  date_naissance: z.string().min(2, "La date de naissance est requise"),
  sexe: z.string().min(1, "Le sexe est requis"),
  secu: z.string().optional(),
  adresse: z.string().optional(),
  telephone: z.string().optional(),
  personne_prevenir: z.string().optional(),

  // Section 2: Motif de consultation
  motif: z.string().optional(),
  debut_symptomes: z.string().optional(),
  evolution: z.string().optional(),
  contexte: z.string().optional(),

  // Section 3: Symptômes associés
  symptomes: z.array(z.string()).optional().default([]),
  autres_symptomes: z.string().optional(),

  // Section 4: Antécédents médicaux
  antecedents: z.string().optional(),
  chirurgies: z.string().optional(),
  hospitalisations: z.string().optional(),

  // Section 5: Allergies
  allergies_medicaments: z.string().optional(),
  allergies_aliments: z.string().optional(),
  autres_allergies: z.string().optional(),

  // Section 6: Traitements en cours
  traitements: z.string().optional(),
  modif_traitements: z.string().optional(),

  // Section 7: Antécédents familiaux
  famille: z.array(z.string()).optional().default([]),

  // Section 8: Mode de vie
  tabac: z.string().optional(),
  alcool: z.string().optional(),
  drogues: z.string().optional(),
  activite_physique: z.string().optional(),

  // Section 9: Contexte social
  vie_seul: z.string().optional(),
  profession: z.string().optional(),
  couverture: z.string().optional(),

  // Section 10: Particularités
  dispositifs: z.string().optional(),
  directives: z.string().optional(),
});

export type MedicalQuestionnaireData = z.infer<typeof medicalQuestionnaireSchema>;
