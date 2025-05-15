
import { jsPDF } from "jspdf";

// Types for PDF formatting functions
export interface PdfTextOptions {
  color?: [number, number, number];
  fontStyle?: "normal" | "bold" | "italic";
  fontSize?: number;
  align?: "left" | "center" | "right";
}

// Utility functions for PDF text formatting
export const formatText = (pdf: jsPDF, options: PdfTextOptions = {}) => {
  const { color = [0, 0, 0], fontStyle = "normal", fontSize = 11 } = options;
  
  pdf.setTextColor(color[0], color[1], color[2]);
  pdf.setFontSize(fontSize);
  
  // Map fontStyle to jsPDF font style
  if (fontStyle === "bold") {
    pdf.setFont("helvetica", "bold");
  } else if (fontStyle === "italic") {
    pdf.setFont("helvetica", "italic");
  } else {
    pdf.setFont("helvetica", "normal");
  }
};

// Add text with built-in formatting
export const addFormattedText = (
  pdf: jsPDF, 
  text: string, 
  x: number, 
  y: number, 
  options: PdfTextOptions = {}
) => {
  formatText(pdf, options);
  
  if (options.align === "center") {
    pdf.text(text, x, y, { align: "center" });
  } else if (options.align === "right") {
    pdf.text(text, x, y, { align: "right" });
  } else {
    pdf.text(text, x, y);
  }
  
  return y + (options.fontSize || 11) / 2; // Return the new Y position
};

// Calculate text height based on line breaks and width constraints
export const calculateTextHeight = (
  pdf: jsPDF,
  text: string,
  maxWidth: number
) => {
  const splitText = pdf.splitTextToSize(text, maxWidth);
  return splitText.length * (pdf.getLineHeight() / pdf.internal.scaleFactor);
};
