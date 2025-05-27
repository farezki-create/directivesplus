
import { useNavigate } from "react-router-dom";
import { ArrowLeft, AlertTriangle, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import PageFooter from "@/components/layout/PageFooter";

const ProcedureViolationDonnees = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Retour
          </Button>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center text-directiveplus-800">
            Procédure de Signalement de Violation de Données
          </h1>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-red-800 mb-2">Signalement urgent</h3>
                <p className="text-red-700">
                  En cas de suspicion de violation de données personnelles, contactez immédiatement l'équipe de sécurité.
                </p>
              </div>
            </div>
          </div>
          
          <div className="prose max-w-none">
            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3 text-gray-800">1. Définition d'une violation de données</h2>
              <p className="mb-4">
                Une violation de données personnelles est un incident de sécurité qui entraîne, de manière accidentelle ou illicite :
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>La destruction, la perte, l'altération de données personnelles</li>
                <li>La divulgation non autorisée ou l'accès non autorisé à des données personnelles</li>
                <li>Tout autre traitement non autorisé de données personnelles</li>
              </ul>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3 text-gray-800">2. Qui peut signaler ?</h2>
              <ul className="list-disc pl-6 mb-4">
                <li>Tout utilisateur de l'application DirectivesPlus</li>
                <li>Professionnel de santé ayant accès aux données</li>
                <li>Personnel technique ou administratif</li>
                <li>Toute personne ayant connaissance d'un incident</li>
              </ul>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3 text-gray-800">3. Comment signaler ?</h2>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <h3 className="font-semibold text-blue-800 mb-3">Contacts d'urgence</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-blue-600" />
                    <span>Email : <a href="mailto:securite@directivesplus.fr" className="text-blue-600 hover:underline">securite@directivesplus.fr</a></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-blue-600" />
                    <span>Urgence 24h/24 : <a href="tel:+33123456789" className="text-blue-600 hover:underline">01 23 45 67 89</a></span>
                  </div>
                </div>
              </div>

              <h4 className="font-medium mb-2">Informations à fournir :</h4>
              <ul className="list-disc pl-6 mb-4">
                <li>Date et heure de découverte de l'incident</li>
                <li>Description détaillée de l'incident</li>
                <li>Données potentiellement concernées</li>
                <li>Nombre approximatif de personnes affectées</li>
                <li>Actions déjà entreprises</li>
                <li>Vos coordonnées pour un suivi</li>
              </ul>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3 text-gray-800">4. Délais de signalement</h2>
              <ul className="list-disc pl-6 mb-4">
                <li><strong>Immédiat :</strong> Dès la découverte de l'incident</li>
                <li><strong>Maximum 24h :</strong> Signalement interne complet</li>
                <li><strong>72h :</strong> Notification à la CNIL si nécessaire</li>
                <li><strong>Sans délai :</strong> Information des personnes concernées si risque élevé</li>
              </ul>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3 text-gray-800">5. Traitement du signalement</h2>
              <ol className="list-decimal pl-6 mb-4">
                <li>Accusé de réception immédiat</li>
                <li>Évaluation de la gravité de l'incident</li>
                <li>Mise en place de mesures correctives</li>
                <li>Investigation approfondie</li>
                <li>Notification aux autorités si nécessaire</li>
                <li>Information des personnes concernées</li>
                <li>Rapport final et mesures préventives</li>
              </ol>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3 text-gray-800">6. Protection du déclarant</h2>
              <p className="mb-4">
                Tout signalement de bonne foi est protégé. Aucune mesure de rétorsion ne sera prise contre une personne qui signale une violation de données de manière légitime.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3 text-gray-800">7. Suivi et retour d'information</h2>
              <p className="mb-4">
                Le déclarant sera tenu informé des suites données à son signalement, dans le respect de la confidentialité de l'enquête et des personnes concernées.
              </p>
            </section>
          </div>
        </div>
      </main>
      
      <PageFooter />
    </div>
  );
};

export default ProcedureViolationDonnees;
