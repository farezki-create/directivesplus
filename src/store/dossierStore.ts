
import { create } from 'zustand';
import { Dossier as DossierType } from '@/hooks/types/dossierTypes';

// Re-export the Dossier type from our central type definition
export type { Dossier } from '@/hooks/types/dossierTypes';

interface DossierStore {
  dossierActif: DossierType | null;
  setDossierActif: (dossier: DossierType) => void;
  clearDossierActif: () => void;
}

export const useDossierStore = create<DossierStore>((set) => ({
  dossierActif: null,
  setDossierActif: (dossier) => set({ dossierActif: dossier }),
  clearDossierActif: () => set({ dossierActif: null }),
}));
