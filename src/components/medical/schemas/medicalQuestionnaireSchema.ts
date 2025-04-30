
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
  // Le champ contexte a été supprimé

  // Section 3: Symptômes associés
  symptomes: z.array(z.string()).optional().default([]),
  autres_symptomes: z.string().optional(),

  // Section 4: Antécédents médicaux
  pathologies: z.array(z.string()).optional().default([]),
  antecedents: z.string().optional(),
  chirurgies: z.array(z.string()).optional().default([]),
  autres_chirurgies: z.string().optional(),
  hospitalisations: z.string().optional(),

  // Section 5: Allergies
  allergies: z.array(z.string()).optional().default([]),
  autres_allergies: z.string().optional(),
  // Suppression des champs allergies_medicaments et allergies_aliments

  // Section 6: Traitements en cours
  traitements: z.string().optional(),
  // Suppression du champ modif_traitements

  // Section 7: Antécédents familiaux
  famille: z.array(z.string()).optional().default([]),

  // Section 8: Mode de vie
  tabac: z.string().optional(),
  alcool: z.string().optional(),
  drogues: z.string().optional(),
  activite_physique: z.string().optional(),

  // Section 9: Particularités (ancien Section 10, Section 9 contexte social a été supprimé)
  dispositifs: z.array(z.string()).optional().default([]),
  directives: z.string().optional(),
});

export type MedicalQuestionnaireData = z.infer<typeof medicalQuestionnaireSchema>;

// Liste des pathologies pour le menu déroulant
export const pathologiesList = [
  "Hypertension artérielle (HTA)",
  "Diabète",
  "Hypercholestérolémie / dyslipidémie",
  "Maladie coronaire (angine de poitrine, infarctus du myocarde)",
  "Insuffisance cardiaque",
  "Accident vasculaire cérébral (AVC) ou AIT",
  "Asthme",
  "Bronchopneumopathie chronique obstructive (BPCO)",
  "Cancer (tout type)",
  "Maladie rénale chronique",
  "Hypothyroïdie ou hyperthyroïdie",
  "Dépression, anxiété",
  "Maladie de Parkinson ou autre trouble neurologique",
  "Maladies auto-immunes (lupus, polyarthrite rhumatoïde, sclérose en plaques, etc.)"
];

// Liste des chirurgies pour le menu déroulant
export const chirurgiesList = [
  "Appendicectomie (appendicite)",
  "Cholécystectomie (ablation de la vésicule biliaire)",
  "Césarienne",
  "Hystérectomie (ablation de l'utérus)",
  "Herniorraphie / cure de hernie inguinale ou ombilicale",
  "Prostatectomie (partielle ou totale, souvent pour adénome ou cancer)",
  "Résection intestinale (maladie de Crohn, diverticulite, cancer…)",
  "By-pass ou sleeve gastrique (chirurgie de l'obésité)",
  "Pontage coronarien (chirurgie cardiaque)",
  "Pose de stents ou angioplastie coronaire (intervention endovasculaire)",
  "Chirurgie de la cataracte",
  "Arthroplastie de hanche ou de genou (prothèse totale)",
  "Chirurgie de fracture (ostéosynthèse)",
  "Tonsillectomie / adénoïdectomie (amygdales / végétations)",
  "Mastectomie ou chirurgie mammaire (cancer, reconstruction…)"
];

// Liste des allergies pour le menu déroulant
export const allergiesList = [
  "Allergie à la pénicilline (et autres antibiotiques bêta-lactamines)",
  "Allergie à l'aspirine (AINS)",
  "Allergie au latex",
  "Allergie aux fruits à coque (arachides, noix, amandes…)",
  "Allergie aux fruits de mer / crustacés",
  "Allergie aux œufs",
  "Allergie au lait de vache (protéines)",
  "Allergie au pollen (rhume des foins)",
  "Allergie aux acariens",
  "Allergie aux piqûres d'insectes (guêpe, abeille…)"
];

// Liste des dispositifs médicaux pour le menu déroulant
export const dispositifsList = [
  "Pacemaker (stimulateur cardiaque)",
  "Défibrillateur implantable (DAI ou ICD)",
  "Prothèse totale de hanche (PTH)",
  "Prothèse totale de genou (PTG)",
  "Stents coronaires (ou autres stents vasculaires)",
  "Valves cardiaques mécaniques ou biologiques",
  "Cathéter veineux central implantable (chambre implantable, type Port-à-Cath)",
  "Pompe à insuline"
];

// Liste des motifs de consultation pour le menu déroulant
export const motifsList = [
  "Douleur abdominale",
  "Douleur thoracique",
  "Fièvre",
  "Dyspnée / gêne respiratoire",
  "Toux",
  "Douleurs ostéo-articulaires (dos, genou, épaule, etc.)",
  "Céphalées / maux de tête",
  "Vertiges / troubles de l'équilibre",
  "Fatigue / asthénie",
  "Palpitations",
  "Plaies / traumatismes / chutes",
  "Problèmes urinaires (brûlures, douleurs, infections)",
  "Éruption cutanée / prurit / allergie",
  "Troubles digestifs (nausées, vomissements, diarrhée, constipation)",
  "Troubles neurologiques aigus (troubles de la parole, paralysie, confusion...)"
];
