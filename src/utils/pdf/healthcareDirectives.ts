
import { jsPDF } from "jspdf";
import { HealthcareDirective } from "./types";

export const formatHealthcareDirectivesSection = (doc: jsPDF, healthcareDirectives: HealthcareDirective[], startY: number): number => {
  // Return the same Y position without rendering anything
  return startY;
};
