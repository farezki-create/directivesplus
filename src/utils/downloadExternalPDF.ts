
import { supabase } from '@/integrations/supabase/client';

export async function downloadExternalPDF(pdfUrl: string, userId: string, description?: string) {
  try {
    const response = await fetch(`${window.location.origin}/functions/v1/download-external-pdf`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        pdfUrl,
        userId,
        description
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erreur lors du téléchargement');
    }

    return await response.json();
  } catch (error: any) {
    console.error('Erreur:', error);
    throw error;
  }
}
