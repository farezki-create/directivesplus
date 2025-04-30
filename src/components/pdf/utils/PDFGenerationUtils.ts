
/**
 * PDFGenerationUtils
 * 
 * This file serves as the entry point for PDF generation utilities.
 * It re-exports all the necessary functions from their respective services.
 */

import { generatePDF } from "./generation/PDFGenerator";
import { PDFStorageService } from "./generation/PDFStorageService";
import { PDFDownloadService } from "./download/PDFDownloadService";
import { PDFRetrievalService } from "./retrieval/PDFRetrievalService";

// Re-export the main functions with their original names for backward compatibility
export const handlePDFGeneration = generatePDF;
export const savePDFToStorage = PDFStorageService.savePDFToStorage;
export const handlePDFDownload = PDFDownloadService.downloadPDF;
export const syncSynthesisToCloud = PDFStorageService.syncSynthesisToCloud;
export const retrievePDFFromStorage = PDFRetrievalService.retrievePDFFromStorage;
