
import { create } from 'zustand';
import type { Dossier } from '@/hooks/types/dossierTypes';

// Re-export the Dossier type from our central type definition
export type { Dossier } from '@/hooks/types/dossierTypes';

interface DossierStore {
  dossierActif: Dossier | null;
  decryptedContent: any; // Adding the missing property
  setDossierActif: (dossier: Dossier) => void;
  clearDossierActif: () => void;
  setDecryptedContent: (content: any) => void; // Add setter function for the new property
  clearDecryptedContent: () => void; // Add function to clear the content
}

export const useDossierStore = create<DossierStore>((set) => ({
  dossierActif: null,
  decryptedContent: null, // Initialize with null
  setDossierActif: (dossier) => set({ dossierActif: dossier }),
  clearDossierActif: () => set({ dossierActif: null }),
  setDecryptedContent: (content) => set({ decryptedContent: content }),
  clearDecryptedContent: () => set({ decryptedContent: null }),
}));
