import { create } from 'zustand';

interface DossierMedical {
  id: string;
  contenu: any;
  // Add profileData if it's needed
  profileData?: any;
}

interface DossierState {
  dossierActif: DossierMedical | null;
  setDossierActif: (dossier: DossierMedical) => void;
  clearDossierActif: () => void;
}

export const useDossierStore = create<DossierState>((set) => ({
  dossierActif: null,
  setDossierActif: (dossier) => set({ dossierActif: dossier }),
  clearDossierActif: () => set({ dossierActif: null })
}));
