
import { jsPDF } from "jspdf";
import { UserProfile, TrustedPerson } from "../../types";
import { PDFResponsesSection } from "../PDFResponsesSection";
import { SignatureHandler } from "../SignatureHandler";

export class FullDocumentGenerator {
  static async generate(
    doc: jsPDF,
    profile: UserProfile,
    responses: any,
    trustedPersons: TrustedPerson[]
  ): Promise<void> {
    this.setupDocument(doc);
    this.addUserInformation(doc, profile);
    this.addTrustedPersons(doc, trustedPersons);
    this.addResponses(doc, responses);
    await this.addSignature(doc, profile);
    this.addPageNumbers(doc);
  }

  private static setupDocument(doc: jsPDF): void {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Directives Anticipées", 105, 20, { align: "center" });
  }

  private static addUserInformation(doc: jsPDF, profile: UserProfile): void {
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Nom: ${profile.last_name || ""}`, 20, 40);
    doc.text(`Prénom: ${profile.first_name || ""}`, 20, 50);
    doc.text(`Date de naissance: ${profile.birth_date || ""}`, 20, 60);

    let yPos = 70;
    if (profile.address || profile.postal_code || profile.city || profile.country) {
      doc.setFont("helvetica", "bold");
      doc.text("Adresse:", 20, yPos);
      doc.setFont("helvetica", "normal");
      yPos += 10;

      if (profile.address) {
        doc.text(profile.address, 25, yPos);
        yPos += 10;
      }

      if (profile.postal_code || profile.city) {
        const locationLine = [profile.postal_code, profile.city]
          .filter(Boolean)
          .join(" ");
        if (locationLine) {
          doc.text(locationLine, 25, yPos);
          yPos += 10;
        }
      }

      if (profile.country) {
        doc.text(profile.country, 25, yPos);
        yPos += 10;
      }
    }
  }

  private static addTrustedPersons(doc: jsPDF, trustedPersons: TrustedPerson[]): void {
    if (!trustedPersons?.length) return;

    let yPos = 130;
    doc.setFont("helvetica", "bold");
    doc.text("Personnes de confiance:", 20, yPos);
    doc.setFont("helvetica", "normal");
    
    yPos += 10;
    trustedPersons.forEach((person, index) => {
      doc.text(`${index + 1}. ${person.name || "Non renseigné"}`, 25, yPos);
      yPos += 10;
      
      if (person.phone) {
        doc.text(`   Tél: ${person.phone}`, 25, yPos);
        yPos += 10;
      }
      
      if (person.email) {
        doc.text(`   Email: ${person.email}`, 25, yPos);
        yPos += 10;
      }
    });
  }

  private static addResponses(doc: jsPDF, responses: any): void {
    if (!responses) return;
    doc.addPage();
    PDFResponsesSection.generate(doc, responses, 20);
  }

  private static async addSignature(doc: jsPDF, profile: UserProfile): Promise<void> {
    await SignatureHandler.applySignature(doc, profile);
  }

  private static addPageNumbers(doc: jsPDF): void {
    const pageCount = doc.internal.pages.length;
    for (let i = 1; i < pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(`Page ${i} / ${pageCount - 1}`, doc.internal.pageSize.getWidth() - 30, doc.internal.pageSize.getHeight() - 10);
    }
  }
}
