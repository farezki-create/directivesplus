import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { jsPDF } from "jspdf";
import { useMedicalData } from "@/hooks/useMedicalData";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { 
  medicalQuestionnaireSchema,
  MedicalQuestionnaireData 
} from "../schemas/medicalQuestionnaireSchema";

export function useMedicalQuestionnaire() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { saveMedicalData } = useMedicalData(user?.id || "");
  const { toast } = useToast();

  const form = useForm<MedicalQuestionnaireData>({
    resolver: zodResolver(medicalQuestionnaireSchema),
    defaultValues: {
      symptomes: [],
      famille: [],
      pathologies: [],
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
      
      if (data.pathologies && data.pathologies.length > 0) {
        pdfDoc.text(`Pathologies connues: ${data.pathologies.join(', ')}`, 25, y);
        y += 8;
      }
      
      if (data.antecedents) {
        pdfDoc.text(`Autres pathologies: ${data.antecedents}`, 25, y);
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
      
      // Generate CSV content in addition to PDF
      const headers = Object.keys(data).filter(key => 
        data[key as keyof MedicalQuestionnaireData] !== undefined && 
        data[key as keyof MedicalQuestionnaireData] !== null && 
        (Array.isArray(data[key as keyof MedicalQuestionnaireData]) ? 
          data[key as keyof MedicalQuestionnaireData].length > 0 : 
          data[key as keyof MedicalQuestionnaireData] !== '')
      );
      
      const values = headers.map(header => {
        const value = data[header as keyof MedicalQuestionnaireData];
        if (Array.isArray(value)) {
          return `"${value.join(' | ').replace(/"/g, '""')}"`;
        }
        return `"${String(value).replace(/"/g, '""')}"`;
      });
      
      const csvContent = `${headers.join(",")}\n${values.join(",")}`;
      
      // Save the data to the database
      const accessCode = await saveMedicalData({
        type: "medical_questionnaire",
        title: "Questionnaire médical préalable",
        date: new Date().toISOString(),
        data: data,
        pdfUrl: pdfOutput,
        csvContent: csvContent
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

  return { form, onSubmit };
}
