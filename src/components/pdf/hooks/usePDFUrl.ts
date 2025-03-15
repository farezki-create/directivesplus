
import { useEffect, useState } from "react";

/**
 * Hook to process and clean PDF URLs
 */
export function usePDFUrl(pdfUrl: string | null) {
  const [cleanUrl, setCleanUrl] = useState<string | null>(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    if (!pdfUrl) {
      console.log("[usePDFUrl] No PDF URL provided");
      setCleanUrl(null);
      setLoadError(false);
      return;
    }
    
    try {
      console.log("[usePDFUrl] Processing PDF URL:", pdfUrl.substring(0, 50) + "...");
      
      // Reset error state when URL changes
      setLoadError(false);
      
      // For data URLs, use them directly
      if (pdfUrl.startsWith('data:application/pdf;base64,')) {
        console.log("[usePDFUrl] Using data URL directly");
        setCleanUrl(pdfUrl);
        return;
      }
      
      // For non-data URLs, clean them
      // Remove any double slashes except in protocol
      let cleaned = pdfUrl.replace(/([^:])\/\/+/g, '$1/');
      
      // Fix protocol if needed
      if (cleaned.includes(':') && !cleaned.includes('://')) {
        cleaned = cleaned.replace(/:\//g, '://');
      }
      
      console.log("[usePDFUrl] Original URL:", pdfUrl);
      console.log("[usePDFUrl] Cleaned URL:", cleaned);
      
      setCleanUrl(cleaned);
    } catch (error) {
      console.error("[usePDFUrl] Invalid URL format:", error);
      
      // For data URLs that might have been corrupted by string handling,
      // try to use the original URL
      if (pdfUrl.includes('data:application/pdf;base64,')) {
        console.log("[usePDFUrl] Attempting to use original data URL");
        setCleanUrl(pdfUrl);
      } else {
        console.error("[usePDFUrl] Cannot display PDF, invalid URL");
        setCleanUrl(null);
        setLoadError(true);
      }
    }
  }, [pdfUrl]);

  return { cleanUrl, loadError, setLoadError };
}
