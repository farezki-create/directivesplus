
import { create } from 'zustand';

interface Dossier {
  id: string;
  userId: string;
  isFullAccess: boolean;
  isDirectivesOnly?: boolean;
  isMedicalOnly?: boolean;
  profileData?: any;
  contenu: any;
}

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
