
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { jsPDF } from "jspdf";
import { Button } from "@/components/ui/button";
import { useMedicalData } from "@/hooks/useMedicalData";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const medicalQuestionnaireSchema = z.object({
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

type MedicalQuestionnaireData = z.infer<typeof medicalQuestionnaireSchema>;

export function MedicalQuestionnaire() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { saveMedicalData } = useMedicalData(user?.id || "");

  const form = useForm<MedicalQuestionnaireData>({
    resolver: zodResolver(medicalQuestionnaireSchema),
    defaultValues: {
      symptomes: [],
      famille: [],
    },
  });

  const onSubmit = async (data: MedicalQuestionnaireData) => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour enregistrer vos données",
        variant: "destructive",
      });
      return;
    }

    try {
      // Generate PDF
      const pdfDoc = new jsPDF();

      // Add title
      pdfDoc.setFontSize(18);
      pdfDoc.setFont("helvetica", "bold");
      pdfDoc.text("Questionnaire médical préalable", 105, 20, { align: "center" });
      pdfDoc.setFontSize(12);
      pdfDoc.setFont("helvetica", "normal");

      // Section 1: Informations générales
      let y = 40;
      pdfDoc.setFont("helvetica", "bold");
      pdfDoc.text("1. Informations générales", 20, y);
      pdfDoc.setFont("helvetica", "normal");
      y += 10;
      pdfDoc.text(`Nom: ${data.nom}`, 25, y);
      y += 8;
      pdfDoc.text(`Prénom: ${data.prenom}`, 25, y);
      y += 8;
      pdfDoc.text(`Date de naissance: ${data.date_naissance}`, 25, y);
      y += 8;
      pdfDoc.text(`Sexe: ${data.sexe}`, 25, y);
      y += 8;
      if (data.secu) {
        pdfDoc.text(`Numéro de sécurité sociale: ${data.secu}`, 25, y);
        y += 8;
      }
      if (data.adresse) {
        pdfDoc.text(`Adresse: ${data.adresse}`, 25, y);
        y += 8;
      }
      if (data.telephone) {
        pdfDoc.text(`Téléphone: ${data.telephone}`, 25, y);
        y += 8;
      }
      if (data.personne_prevenir) {
        pdfDoc.text(`Personne à prévenir: ${data.personne_prevenir}`, 25, y);
        y += 8;
      }

      y += 5;

      // Add remaining sections (similar pattern)
      // Section 2
      pdfDoc.setFont("helvetica", "bold");
      pdfDoc.text("2. Motif de consultation", 20, y);
      pdfDoc.setFont("helvetica", "normal");
      y += 10;
      if (data.motif) {
        pdfDoc.text(`Motif principal: ${data.motif}`, 25, y);
        y += 8;
      }
      if (data.debut_symptomes) {
        pdfDoc.text(`Début des symptômes: ${data.debut_symptomes}`, 25, y);
        y += 8;
      }
      if (data.evolution) {
        pdfDoc.text(`Évolution: ${data.evolution}`, 25, y);
        y += 8;
      }
      if (data.contexte) {
        pdfDoc.text(`Contexte déclencheur: ${data.contexte}`, 25, y);
        y += 8;
      }

      y += 5;

      // Check if we need a new page
      if (y > 250) {
        pdfDoc.addPage();
        y = 20;
      }

      // Section 3
      pdfDoc.setFont("helvetica", "bold");
      pdfDoc.text("3. Symptômes associés", 20, y);
      pdfDoc.setFont("helvetica", "normal");
      y += 10;
      if (data.symptomes && data.symptomes.length > 0) {
        pdfDoc.text(`Symptômes: ${data.symptomes.join(', ')}`, 25, y);
        y += 8;
      }
      if (data.autres_symptomes) {
        pdfDoc.text(`Autres symptômes: ${data.autres_symptomes}`, 25, y);
        y += 8;
      }

      y += 5;

      // Section 4
      pdfDoc.setFont("helvetica", "bold");
      pdfDoc.text("4. Antécédents médicaux", 20, y);
      pdfDoc.setFont("helvetica", "normal");
      y += 10;
      if (data.antecedents) {
        pdfDoc.text(`Pathologies connues: ${data.antecedents}`, 25, y);
        y += 8;
      }
      if (data.chirurgies) {
        pdfDoc.text(`Chirurgies antérieures: ${data.chirurgies}`, 25, y);
        y += 8;
      }
      if (data.hospitalisations) {
        pdfDoc.text(`Hospitalisations récentes: ${data.hospitalisations}`, 25, y);
        y += 8;
      }

      y += 5;

      // Check if we need a new page
      if (y > 250) {
        pdfDoc.addPage();
        y = 20;
      }

      // Section 5
      pdfDoc.setFont("helvetica", "bold");
      pdfDoc.text("5. Allergies", 20, y);
      pdfDoc.setFont("helvetica", "normal");
      y += 10;
      if (data.allergies_medicaments) {
        pdfDoc.text(`Médicaments: ${data.allergies_medicaments}`, 25, y);
        y += 8;
      }
      if (data.allergies_aliments) {
        pdfDoc.text(`Aliments: ${data.allergies_aliments}`, 25, y);
        y += 8;
      }
      if (data.autres_allergies) {
        pdfDoc.text(`Autres allergies: ${data.autres_allergies}`, 25, y);
        y += 8;
      }

      y += 5;

      // Continue adding remaining sections...
      // Section 6
      pdfDoc.setFont("helvetica", "bold");
      pdfDoc.text("6. Traitements en cours", 20, y);
      pdfDoc.setFont("helvetica", "normal");
      y += 10;
      if (data.traitements) {
        pdfDoc.text(`Médicaments habituels: ${data.traitements}`, 25, y);
        y += 8;
      }
      if (data.modif_traitements) {
        pdfDoc.text(`Modifications récentes: ${data.modif_traitements}`, 25, y);
        y += 8;
      }

      y += 5;

      // Check if we need a new page
      if (y > 250) {
        pdfDoc.addPage();
        y = 20;
      }

      // Section 7
      pdfDoc.setFont("helvetica", "bold");
      pdfDoc.text("7. Antécédents familiaux", 20, y);
      pdfDoc.setFont("helvetica", "normal");
      y += 10;
      if (data.famille && data.famille.length > 0) {
        pdfDoc.text(`Antécédents familiaux: ${data.famille.join(', ')}`, 25, y);
        y += 8;
      }

      y += 5;

      // Section 8
      pdfDoc.setFont("helvetica", "bold");
      pdfDoc.text("8. Mode de vie", 20, y);
      pdfDoc.setFont("helvetica", "normal");
      y += 10;
      if (data.tabac) {
        pdfDoc.text(`Fumeur: ${data.tabac}`, 25, y);
        y += 8;
      }
      if (data.alcool) {
        pdfDoc.text(`Alcool: ${data.alcool}`, 25, y);
        y += 8;
      }
      if (data.drogues) {
        pdfDoc.text(`Drogues: ${data.drogues}`, 25, y);
        y += 8;
      }
      if (data.activite_physique) {
        pdfDoc.text(`Activité physique: ${data.activite_physique}`, 25, y);
        y += 8;
      }

      y += 5;

      // Check if we need a new page
      if (y > 250) {
        pdfDoc.addPage();
        y = 20;
      }

      // Section 9
      pdfDoc.setFont("helvetica", "bold");
      pdfDoc.text("9. Contexte social", 20, y);
      pdfDoc.setFont("helvetica", "normal");
      y += 10;
      if (data.vie_seul) {
        pdfDoc.text(`Vie seul(e): ${data.vie_seul}`, 25, y);
        y += 8;
      }
      if (data.profession) {
        pdfDoc.text(`Profession: ${data.profession}`, 25, y);
        y += 8;
      }
      if (data.couverture) {
        pdfDoc.text(`Couverture sociale: ${data.couverture}`, 25, y);
        y += 8;
      }

      y += 5;

      // Section 10
      pdfDoc.setFont("helvetica", "bold");
      pdfDoc.text("10. Particularités", 20, y);
      pdfDoc.setFont("helvetica", "normal");
      y += 10;
      if (data.dispositifs) {
        pdfDoc.text(`Dispositifs médicaux implantés: ${data.dispositifs}`, 25, y);
        y += 8;
      }
      if (data.directives) {
        pdfDoc.text(`Directives anticipées ou personne de confiance: ${data.directives}`, 25, y);
        y += 8;
      }

      // Save PDF as data URL
      const pdfOutput = pdfDoc.output('dataurlstring');
      
      // Save the data to the database
      const accessCode = await saveMedicalData({
        type: "medical_questionnaire",
        title: "Questionnaire médical préalable",
        date: new Date().toISOString(),
        data: data,
        pdfUrl: pdfOutput
      });

      if (accessCode) {
        toast({
          title: "Succès",
          description: "Le questionnaire a été enregistré et le PDF généré",
        });
        
        // Navigate to the medical data page
        navigate("/medical-data");
      } else {
        throw new Error("Failed to save medical data");
      }
    } catch (error) {
      console.error("Error saving medical questionnaire:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement du questionnaire",
        variant: "destructive",
      });
    }
  };

  const symptomOptions = [
    { id: "fièvre", label: "Fièvre" },
    { id: "douleur", label: "Douleur" },
    { id: "essoufflement", label: "Essoufflement" },
    { id: "toux", label: "Toux" },
    { id: "nausees", label: "Nausées / Vomissements" },
    { id: "diarrhee", label: "Diarrhée" },
    { id: "malaise", label: "Malaise / Perte de connaissance" },
    { id: "troubles_neuro", label: "Troubles neurologiques" },
    { id: "saignement", label: "Saignement" },
  ];

  const familyOptions = [
    { id: "cardiaque", label: "Maladie cardiaque" },
    { id: "cancer", label: "Cancer" },
    { id: "diabete", label: "Diabète" },
    { id: "hta", label: "Hypertension" },
    { id: "avc", label: "AVC" },
  ];

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Questionnaire médical préalable</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Section 1: Informations générales */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold py-2 px-4 bg-blue-500 text-white rounded-md">
                1. Informations générales
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="nom"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom</FormLabel>
                      <FormControl>
                        <Input placeholder="Entrez votre nom" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="prenom"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prénom</FormLabel>
                      <FormControl>
                        <Input placeholder="Entrez votre prénom" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="date_naissance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date de naissance</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sexe"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sexe</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="-- Choisir --" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="H">Homme</SelectItem>
                          <SelectItem value="F">Femme</SelectItem>
                          <SelectItem value="Autre">Autre</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="secu"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Numéro de sécurité sociale</FormLabel>
                      <FormControl>
                        <Input placeholder="Numéro de sécurité sociale" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="adresse"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Adresse</FormLabel>
                      <FormControl>
                        <Input placeholder="Adresse" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="telephone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Téléphone</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="Téléphone" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="personne_prevenir"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Personne à prévenir</FormLabel>
                      <FormControl>
                        <Input placeholder="Nom et téléphone" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* Section 2: Motif de consultation */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold py-2 px-4 bg-blue-500 text-white rounded-md">
                2. Motif de consultation
              </h2>
              <div className="grid grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="motif"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Motif principal</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Décrivez le motif principal de votre consultation" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="debut_symptomes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Début des symptômes</FormLabel>
                      <FormControl>
                        <Input placeholder="Quand les symptômes ont-ils commencé?" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="evolution"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Évolution</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="-- Choisir --" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="aggravation">Aggravation</SelectItem>
                          <SelectItem value="amelioration">Amélioration</SelectItem>
                          <SelectItem value="stable">Stable</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contexte"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contexte déclencheur</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Décrivez les circonstances d'apparition des symptômes" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* Section 3: Symptômes associés */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold py-2 px-4 bg-blue-500 text-white rounded-md">
                3. Symptômes associés
              </h2>
              <FormField
                control={form.control}
                name="symptomes"
                render={() => (
                  <FormItem>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {symptomOptions.map((option) => (
                        <FormField
                          key={option.id}
                          control={form.control}
                          name="symptomes"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={option.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(option.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value || [], option.id])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== option.id
                                            )
                                          );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {option.label}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="autres_symptomes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Autres symptômes</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Décrivez d'autres symptômes non listés ci-dessus" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* Section 4: Antécédents médicaux */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold py-2 px-4 bg-blue-500 text-white rounded-md">
                4. Antécédents médicaux
              </h2>
              <FormField
                control={form.control}
                name="antecedents"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pathologies connues</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Listez vos pathologies connues" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="chirurgies"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chirurgies antérieures</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Décrivez vos précédentes chirurgies" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="hospitalisations"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hospitalisations récentes</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Mentionnez vos hospitalisations récentes" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* Section 5: Allergies */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold py-2 px-4 bg-blue-500 text-white rounded-md">
                5. Allergies
              </h2>
              <FormField
                control={form.control}
                name="allergies_medicaments"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Médicaments</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Listez vos allergies aux médicaments" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="allergies_aliments"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Aliments</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Listez vos allergies alimentaires" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="autres_allergies"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Autres allergies</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Mentionnez d'autres allergies (latex, insectes...)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* Section 6: Traitements en cours */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold py-2 px-4 bg-blue-500 text-white rounded-md">
                6. Traitements en cours
              </h2>
              <FormField
                control={form.control}
                name="traitements"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Médicaments habituels</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Listez vos médicaments habituels" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="modif_traitements"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Modifications récentes</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Indiquez les modifications récentes de traitement" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* Section 7: Antécédents familiaux */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold py-2 px-4 bg-blue-500 text-white rounded-md">
                7. Antécédents familiaux
              </h2>
              <FormField
                control={form.control}
                name="famille"
                render={() => (
                  <FormItem>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {familyOptions.map((option) => (
                        <FormField
                          key={option.id}
                          control={form.control}
                          name="famille"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={option.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(option.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value || [], option.id])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== option.id
                                            )
                                          );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {option.label}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* Section 8: Mode de vie */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold py-2 px-4 bg-blue-500 text-white rounded-md">
                8. Mode de vie
              </h2>
              <FormField
                control={form.control}
                name="tabac"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fumeur ?</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="--" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="non">Non</SelectItem>
                        <SelectItem value="oui">Oui</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="alcool"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alcool</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Décrivez votre consommation d'alcool" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="drogues"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Drogues</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Décrivez votre consommation de drogues" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="activite_physique"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Activité physique</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Décrivez votre activité physique" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* Section 9: Contexte social */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold py-2 px-4 bg-blue-500 text-white rounded-md">
                9. Contexte social
              </h2>
              <FormField
                control={form.control}
                name="vie_seul"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vie seul(e) ?</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="--" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="non">Non</SelectItem>
                        <SelectItem value="oui">Oui</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="profession"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profession</FormLabel>
                    <FormControl>
                      <Input placeholder="Votre profession" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="couverture"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Couverture sociale</FormLabel>
                    <FormControl>
                      <Input placeholder="Détails sur votre couverture sociale" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* Section 10: Particularités */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold py-2 px-4 bg-blue-500 text-white rounded-md">
                10. Particularités
              </h2>
              <FormField
                control={form.control}
                name="dispositifs"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dispositifs médicaux implantés</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Pacemaker, prothèses, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="directives"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Directives anticipées ou personne de confiance</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Précisez vos directives ou personne de confiance" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" className="bg-green-600 hover:bg-green-700">
                Enregistrer le questionnaire
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
