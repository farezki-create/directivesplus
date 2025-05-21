
import { create } from 'zustand';

interface DossierMedical {
  id: string;
  contenu: any;
}

interface DossierState {
  dossierActif: DossierMedical | null;
  lastAccessed: number | null;
  setDossierActif: (dossier: DossierMedical | null) => void;
  clearDossierActif: () => void;
}

// Durée maximale d'inactivité avant nettoyage automatique des données (15 minutes)
const AUTO_CLEAR_TIMEOUT_MS = 15 * 60 * 1000;

export const useDossierStore = create<DossierState>((set) => ({
  dossierActif: null,
  lastAccessed: null,
  setDossierActif: (dossier) => set({ 
    dossierActif: dossier,
    lastAccessed: Date.now()
  }),
  clearDossierActif: () => set({ 
    dossierActif: null,
    lastAccessed: null
  }),
}));

// Nettoyage automatique des données sensibles après période d'inactivité
if (typeof window !== 'undefined') {
  // Vérifier périodiquement si les données doivent être nettoyées
  setInterval(() => {
    const { dossierActif, lastAccessed, clearDossierActif } = useDossierStore.getState();
    
    if (dossierActif && lastAccessed) {
      const now = Date.now();
      const inactiveTime = now - lastAccessed;
      
      if (inactiveTime > AUTO_CLEAR_TIMEOUT_MS) {
        console.log(`Nettoyage automatique des données après ${Math.floor(inactiveTime/1000/60)} minutes d'inactivité`);
        clearDossierActif();
      }
    }
  }, 60 * 1000); // Vérifier toutes les minutes
  
  // Nettoyage lors de la fermeture de l'onglet/navigateur
  window.addEventListener('beforeunload', () => {
    const { clearDossierActif } = useDossierStore.getState();
    clearDossierActif();
  });
}
