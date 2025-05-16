
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const BackupPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <Button
        onClick={() => navigate(-1)}
        variant="ghost"
        className="flex items-center mb-6 text-gray-600"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour
      </Button>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Politique de Sauvegarde et de Restauration des Données
        </h1>
        
        <div className="prose max-w-none">
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3 text-gray-800">1. Introduction</h2>
            <p className="mb-2">
              Cette politique définit les procédures de sauvegarde et de restauration mises en place pour protéger les données sensibles 
              hébergées par DirectivesPlus, conformément aux exigences du Règlement Général sur la Protection des Données (RGPD) et 
              du référentiel d'Hébergement des Données de Santé (HDS).
            </p>
            <p className="mb-2">
              La protection des directives anticipées et des données médicales de nos utilisateurs est une priorité absolue, 
              nécessitant des mesures rigoureuses pour garantir leur disponibilité, intégrité et confidentialité.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3 text-gray-800">2. Principes généraux</h2>
            <ul className="list-disc pl-6 mb-3">
              <li>Toutes les données sont sauvegardées régulièrement selon un calendrier prédéfini</li>
              <li>Les sauvegardes sont chiffrées pour garantir la confidentialité des données</li>
              <li>Des tests de restauration sont effectués périodiquement pour valider l'efficacité des procédures</li>
              <li>Une documentation détaillée est maintenue pour toutes les opérations de sauvegarde et de restauration</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3 text-gray-800">3. Stratégie de sauvegarde</h2>
            
            <h3 className="font-medium mb-2">3.1 Types de sauvegardes</h3>
            <ul className="list-disc pl-6 mb-3">
              <li><strong>Sauvegarde complète:</strong> Copie intégrale de toutes les données</li>
              <li><strong>Sauvegarde différentielle:</strong> Copie des données modifiées depuis la dernière sauvegarde complète</li>
              <li><strong>Sauvegarde incrémentale:</strong> Copie des données modifiées depuis la dernière sauvegarde (complète ou incrémentale)</li>
            </ul>
            
            <h3 className="font-medium mb-2">3.2 Fréquence des sauvegardes</h3>
            <ul className="list-disc pl-6 mb-3">
              <li><strong>Sauvegarde complète:</strong> Hebdomadaire (chaque dimanche à 01h00)</li>
              <li><strong>Sauvegarde différentielle:</strong> Quotidienne (chaque jour à 03h00)</li>
              <li><strong>Sauvegarde incrémentale:</strong> Toutes les 6 heures</li>
              <li><strong>Sauvegarde des journaux de transactions:</strong> Toutes les 30 minutes</li>
            </ul>
            
            <h3 className="font-medium mb-2">3.3 Rétention des sauvegardes</h3>
            <ul className="list-disc pl-6 mb-3">
              <li>Sauvegardes complètes: 12 mois</li>
              <li>Sauvegardes différentielles: 1 mois</li>
              <li>Sauvegardes incrémentales: 7 jours</li>
              <li>Journaux de transactions: 3 jours</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3 text-gray-800">4. Infrastructure de sauvegarde</h2>
            
            <h3 className="font-medium mb-2">4.1 Stockage des sauvegardes</h3>
            <ul className="list-disc pl-6 mb-3">
              <li>Stockage primaire: Infrastructure cloud sécurisée certifiée HDS</li>
              <li>Stockage secondaire: Serveur dédié dans un datacenter distinct (géographiquement distant)</li>
              <li>Stockage tertiaire: Solution d'archivage à froid pour les sauvegardes à long terme</li>
            </ul>
            
            <h3 className="font-medium mb-2">4.2 Sécurité des sauvegardes</h3>
            <ul className="list-disc pl-6 mb-3">
              <li>Chiffrement AES-256 pour toutes les sauvegardes</li>
              <li>Gestion sécurisée des clés de chiffrement</li>
              <li>Contrôle d'accès basé sur les rôles pour le système de sauvegarde</li>
              <li>Journalisation complète de toutes les opérations sur les sauvegardes</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3 text-gray-800">5. Procédure de restauration</h2>
            
            <h3 className="font-medium mb-2">5.1 Niveaux de restauration</h3>
            <ul className="list-disc pl-6 mb-3">
              <li><strong>Niveau 1 (Restauration ciblée):</strong> Récupération d'éléments spécifiques (fichiers individuels, enregistrements de base de données)</li>
              <li><strong>Niveau 2 (Restauration partielle):</strong> Récupération de composants spécifiques du système</li>
              <li><strong>Niveau 3 (Restauration complète):</strong> Récupération intégrale du système dans un état antérieur</li>
            </ul>
            
            <h3 className="font-medium mb-2">5.2 Temps de restauration ciblé (RTO)</h3>
            <ul className="list-disc pl-6 mb-3">
              <li>Niveau 1: 2 heures maximum</li>
              <li>Niveau 2: 4 heures maximum</li>
              <li>Niveau 3: 8 heures maximum</li>
            </ul>
            
            <h3 className="font-medium mb-2">5.3 Point de restauration ciblé (RPO)</h3>
            <p className="mb-2">
              Le point de restauration maximal (perte de données acceptée) est de 15 minutes pour les données critiques et de 4 heures pour les données non critiques.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3 text-gray-800">6. Tests et validation</h2>
            
            <h3 className="font-medium mb-2">6.1 Calendrier des tests</h3>
            <ul className="list-disc pl-6 mb-3">
              <li>Tests de restauration de niveau 1: Mensuels</li>
              <li>Tests de restauration de niveau 2: Trimestriels</li>
              <li>Tests de restauration de niveau 3: Semestriels</li>
              <li>Exercice complet de reprise d'activité: Annuel</li>
            </ul>
            
            <h3 className="font-medium mb-2">6.2 Documentation des tests</h3>
            <p className="mb-2">
              Chaque test de restauration fait l'objet d'un rapport détaillé documentant:
            </p>
            <ul className="list-disc pl-6 mb-3">
              <li>Date et heure du test</li>
              <li>Type de test réalisé</li>
              <li>Données/systèmes concernés</li>
              <li>Durée de la restauration</li>
              <li>Résultats du test et validation</li>
              <li>Problèmes rencontrés et actions correctives</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3 text-gray-800">7. Rôles et responsabilités</h2>
            <table className="min-w-full bg-white border border-gray-200 mb-4">
              <thead>
                <tr>
                  <th className="border border-gray-200 px-4 py-2">Rôle</th>
                  <th className="border border-gray-200 px-4 py-2">Responsabilités</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-200 px-4 py-2">Directeur des Systèmes d'Information</td>
                  <td className="border border-gray-200 px-4 py-2">
                    <ul className="list-disc pl-4">
                      <li>Supervision générale de la stratégie de sauvegarde</li>
                      <li>Approbation des modifications majeures</li>
                    </ul>
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-4 py-2">Administrateur de sauvegarde</td>
                  <td className="border border-gray-200 px-4 py-2">
                    <ul className="list-disc pl-4">
                      <li>Configuration et maintenance du système de sauvegarde</li>
                      <li>Surveillance quotidienne des opérations</li>
                      <li>Test périodique des restaurations</li>
                    </ul>
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-4 py-2">Responsable sécurité</td>
                  <td className="border border-gray-200 px-4 py-2">
                    <ul className="list-disc pl-4">
                      <li>Audit de sécurité du système de sauvegarde</li>
                      <li>Gestion du chiffrement et des clés</li>
                    </ul>
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-4 py-2">Équipe d'intervention d'urgence</td>
                  <td className="border border-gray-200 px-4 py-2">
                    <ul className="list-disc pl-4">
                      <li>Exécution des procédures de restauration en cas d'incident</li>
                      <li>Communication avec les parties prenantes</li>
                    </ul>
                  </td>
                </tr>
              </tbody>
            </table>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3 text-gray-800">8. Révision et mise à jour</h2>
            <p className="mb-2">
              Cette politique est revue au minimum une fois par an et mise à jour selon les besoins pour refléter les évolutions technologiques, 
              réglementaires ou organisationnelles.
            </p>
            <p className="mb-2">
              Date de dernière révision: {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default BackupPolicy;
