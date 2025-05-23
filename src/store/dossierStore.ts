
import { create } from 'zustand';
import type { Dossier } from '@/hooks/types/dossierTypes';

// Re-export the Dossier type from our central type definition
export type { Dossier } from '@/hooks/types/dossierTypes';

interface DossierStore {
  dossierActif: Dossier | null;
  setDossierActif: (dossier: Dossier) => void;
  clearDossierActif: () => void;
}

export const useDossierStore = create<DossierStore>((set) => ({
  dossierActif: null,
  setDossierActif: (dossier) => set({ dossierActif: dossier }),
  clearDossierActif: () => set({ dossierActif: null }),
}));
