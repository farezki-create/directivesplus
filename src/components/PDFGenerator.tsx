import { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Mail, Download, Printer } from "lucide-react";

interface UserProfile {
  first_name: string | null;
  last_name: string | null;
  address: string | null;
  city: string | null;
  postal_code: string | null;
  phone_number: string | null;
  unique_identifier: string;
}

interface TrustedPerson {
  name: string;
  phone: string;
  email: string;
  relation: string;
}

export const PDFGenerator = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [responses, setResponses] = useState<any>(null);
  const [trustedPersons, setTrustedPersons] = useState<TrustedPerson[]>([]);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) return;

        console.log("[PDFGenerator] Loading user profile");
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .maybeSingle();

        if (profileError) throw profileError;
        setProfile(profileData);

        console.log("[PDFGenerator] Loading responses");
        const { data: responsesData, error: responsesError } = await supabase
          .from("questionnaire_synthesis")
          .select("free_text")
          .eq("user_id", session.user.id)
          .maybeSingle();

        if (responsesError) throw responsesError;
        setResponses(responsesData || { free_text: null });

      } catch (error) {
        console.error("[PDFGenerator] Error loading user data:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger vos données.",
          variant: "destructive",
        });
      }
    };

    loadUserData();
  }, [toast]);

  const generatePDF = () => {
    try {
      console.log("[PDFGenerator] Generating PDF");
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      let yPosition = 20;

      // Title
      doc.setFontSize(20);
      doc.text("Directives Anticipées", pageWidth / 2, yPosition, { align: "center" });
      
      // User information
      yPosition += 20;
      doc.setFontSize(12);
      if (profile) {
        doc.text(`${profile.first_name} ${profile.last_name}`, 20, yPosition);
        yPosition += 10;
        if (profile.address) {
          doc.text(profile.address, 20, yPosition);
          yPosition += 7;
        }
        if (profile.postal_code || profile.city) {
          doc.text(`${profile.postal_code || ""} ${profile.city || ""}`, 20, yPosition);
          yPosition += 7;
        }
        if (profile.phone_number) {
          doc.text(`Tél: ${profile.phone_number}`, 20, yPosition);
          yPosition += 7;
        }
      }

      // Access code
      yPosition += 10;
      doc.setFontSize(14);
      doc.text("Code d'accès pour les professionnels de santé:", 20, yPosition);
      yPosition += 10;
      doc.setFontSize(16);
      if (profile?.unique_identifier) {
        doc.text(profile.unique_identifier, 20, yPosition);
      }

      // Synthesis
      yPosition += 20;
      doc.setFontSize(14);
      doc.text("Synthèse du questionnaire:", 20, yPosition);
      yPosition += 10;
      doc.setFontSize(12);
      if (responses?.free_text) {
        const lines = doc.splitTextToSize(responses.free_text, pageWidth - 40);
        doc.text(lines, 20, yPosition);
        yPosition += lines.length * 7;
      }

      // Free text space
      yPosition += 20;
      doc.setFontSize(14);
      doc.text("Notes complémentaires:", 20, yPosition);
      yPosition += 10;
      // Draw 3 lines
      for (let i = 0; i < 3; i++) {
        doc.line(20, yPosition + (i * 10), pageWidth - 20, yPosition + (i * 10));
      }

      // Trusted persons
      yPosition += 40;
      doc.setFontSize(14);
      doc.text("Personne(s) de confiance:", 20, yPosition);
      yPosition += 10;
      doc.setFontSize(12);
      trustedPersons.forEach((person, index) => {
        doc.text(`${index + 1}. ${person.name}`, 20, yPosition);
        yPosition += 7;
        doc.text(`   Tél: ${person.phone}`, 20, yPosition);
        yPosition += 7;
        doc.text(`   Email: ${person.email}`, 20, yPosition);
        yPosition += 7;
        doc.text(`   Relation: ${person.relation}`, 20, yPosition);
        yPosition += 10;
      });

      // Date and signature
      yPosition += 20;
      const currentDate = format(new Date(), "d MMMM yyyy", { locale: fr });
      doc.text(`Fait le ${currentDate} à `, 20, yPosition);
      yPosition += 20;
      doc.text("Signature:", 20, yPosition);

      // Instead of saving directly, create a data URL
      const pdfDataUrl = doc.output('dataurlstring');
      setPdfUrl(pdfDataUrl);
      setShowPreview(true);
      
      console.log("[PDFGenerator] PDF generated successfully");
      toast({
        title: "Succès",
        description: "Le PDF a été généré avec succès.",
      });

    } catch (error) {
      console.error("[PDFGenerator] Error generating PDF:", error);
      toast({
        title: "Erreur",
        description: "Impossible de générer le PDF.",
        variant: "destructive",
      });
    }
  };

  const handleSave = () => {
    const doc = new jsPDF();
    doc.save("directives-anticipees.pdf");
  };

  const handlePrint = () => {
    if (pdfUrl) {
      const printWindow = window.open(pdfUrl);
      printWindow?.print();
    }
  };

  const handleEmail = async () => {
    if (!profile?.email) {
      toast({
        title: "Erreur",
        description: "Aucune adresse email associée à votre profil.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch('/api/send-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: profile.email,
          pdfUrl: pdfUrl,
        }),
      });

      if (response.ok) {
        toast({
          title: "Succès",
          description: "Le PDF a été envoyé par email.",
        });
      } else {
        throw new Error("Erreur lors de l'envoi de l'email");
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer le PDF par email.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Générer vos documents</h2>
      <p className="text-muted-foreground mb-6">
        Téléchargez vos directives anticipées et la liste des personnes de confiance au format PDF.
      </p>
      <Button onClick={generatePDF} className="w-full">
        Générer Directives anticipées et personne de confiance
      </Button>

      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Aperçu du document</DialogTitle>
          </DialogHeader>
          
          {pdfUrl && (
            <div className="space-y-4">
              <iframe
                src={pdfUrl}
                className="w-full h-[600px] border rounded"
                title="Aperçu PDF"
              />
              
              <div className="flex justify-end gap-4">
                <Button variant="outline" onClick={handleEmail}>
                  <Mail className="mr-2 h-4 w-4" />
                  Envoyer par email
                </Button>
                <Button variant="outline" onClick={handleSave}>
                  <Download className="mr-2 h-4 w-4" />
                  Enregistrer
                </Button>
                <Button variant="outline" onClick={handlePrint}>
                  <Printer className="mr-2 h-4 w-4" />
                  Imprimer
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};
