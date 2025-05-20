
import { create } from 'zustand';

interface DossierMedical {
  id: string;
  contenu: any;
}

interface DossierState {
  dossierActif: DossierMedical | null;
  setDossierActif: (dossier: DossierMedical | null) => void;
  clearDossierActif: () => void;
}

export const useDossierStore = create<DossierState>((set) => ({
  dossierActif: null,
  setDossierActif: (dossier) => set({ dossierActif }),
  clearDossierActif: () => set({ dossierActif: null }),
}));
