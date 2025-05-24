
import { create } from 'zustand';
import type { Dossier } from '@/hooks/types/dossierTypes';

// Re-export the Dossier type from our central type definition
export type { Dossier } from '@/hooks/types/dossierTypes';

interface DossierStore {
  dossierActif: Dossier | null;
  decryptedContent: any;
  setDossierActif: (dossier: Dossier) => void;
  clearDossierActif: () => void;
  setDecryptedContent: (content: any) => void;
  clearDecryptedContent: () => void;
}

export const useDossierStore = create<DossierStore>((set) => ({
  dossierActif: null,
  decryptedContent: null,
  setDossierActif: (dossier) => set({ dossierActif: dossier }),
  clearDossierActif: () => set({ dossierActif: null }),
  setDecryptedContent: (content) => set({ decryptedContent: content }),
  clearDecryptedContent: () => set({ decryptedContent: null }),
}));
