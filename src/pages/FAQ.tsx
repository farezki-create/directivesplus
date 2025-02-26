
import { Header } from "@/components/Header";
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const FAQ = () => {
  const { currentLanguage } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">
              {currentLanguage === "fr" ? "Questions/Réponses" : "FAQ"}
            </h1>
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
            >
              {currentLanguage === "fr" ? "Retour" : "Back"}
            </Button>
          </div>
          
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-blue-600 mb-3">
                {currentLanguage === "fr" ? "Que sont les directives anticipées ?" : "What are advance directives?"}
              </h2>
              <p className="text-gray-700">
                {currentLanguage === "fr" 
                  ? "Les directives anticipées permettent à toute personne majeure d'exprimer par écrit ses volontés concernant les traitements médicaux en cas d'incapacité à communiquer. Ce dispositif légal, renforcé par la loi Claeys-Leonetti de 2016, vise à garantir le respect des choix personnels en fin de vie, notamment concernant la limitation ou l'arrêt des thérapeutiques. Contrairement à un testament, elles se concentrent exclusivement sur les décisions médicales et restent modifiables à tout moment."
                  : "Advance directives allow any adult to express in writing their wishes regarding medical treatments in case of inability to communicate. This legal mechanism, strengthened by the Claeys-Leonetti law of 2016, aims to ensure respect for personal choices at the end of life, particularly regarding the limitation or cessation of therapeutics. Unlike a will, they focus exclusively on medical decisions and remain modifiable at any time."}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-blue-600 mb-3">
                {currentLanguage === "fr" ? "Qui peut rédiger des directives anticipées ?" : "Who can write advance directives?"}
              </h2>
              <p className="text-gray-700">
                {currentLanguage === "fr" 
                  ? "Toute personne majeure, y compris sous mesure de protection juridique (avec autorisation du juge), possède ce droit. Aucune condition de santé n'est requise : 63% des rédacteurs en 2024 étaient des personnes en bonne santé selon l'Observatoire national de la fin de vie. La démarche s'avère particulièrement pertinente pour les patients atteints de maladies évolutives ou les personnes souhaitant anticiper un accident grave."
                  : "Any adult, including those under legal protection measures (with the judge's authorization), has this right. No health condition is required: 63% of writers in 2024 were healthy people according to the National End-of-Life Observatory. The approach is particularly relevant for patients with progressive diseases or people wishing to anticipate a serious accident."}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-blue-600 mb-3">
                {currentLanguage === "fr" ? "Comment rédiger des directives valides ?" : "How to write valid directives?"}
              </h2>
              <p className="text-gray-700">
                {currentLanguage === "fr" 
                  ? "Le document doit être écrit, daté et signé personnellement, avec mention des nom, prénom, date et lieu de naissance. Bien que la rédaction sur papier libre soit possible, l'utilisation des modèles officiels (disponibles sur service-public.fr) est fortement recommandée pour couvrir tous les aspects légaux. Pour les personnes incapables d'écrire, la loi prévoit une procédure exceptionnelle avec deux témoins attestant de la volonté libre et éclairée."
                  : "The document must be written, dated and personally signed, with mention of surname, first name, date and place of birth. Although drafting on plain paper is possible, the use of official templates (available on service-public.fr) is strongly recommended to cover all legal aspects. For people unable to write, the law provides for an exceptional procedure with two witnesses attesting to free and informed will."}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-blue-600 mb-3">
                {currentLanguage === "fr" ? "Quels éléments doivent figurer dans le document ?" : "What elements should be included in the document?"}
              </h2>
              <p className="text-gray-700">
                {currentLanguage === "fr" 
                  ? "Les directives doivent préciser :\n• Le refus ou l'acceptation de traitements spécifiques (réanimation, nutrition artificielle, etc.)\n• Les souhaits concernant la sédation palliative\n• Les préférences relatives au lieu de fin de vie\n• Toute considération éthique ou religieuse influençant les choix thérapeutiques.\nLa Haute Autorité de Santé recommande d'intégrer des réflexions personnelles sur sa conception de la qualité de vie (\"Qu'est-ce qui me rend heureux ?\", \"Suis-je prêt à accepter une perte d'autonomie pour prolonger ma vie ?\")."
                  : "The directives must specify:\n• Refusal or acceptance of specific treatments (resuscitation, artificial nutrition, etc.)\n• Wishes regarding palliative sedation\n• Preferences regarding the place of end of life\n• Any ethical or religious considerations influencing therapeutic choices.\nThe High Authority for Health recommends incorporating personal reflections on one's conception of quality of life (\"What makes me happy?\", \"Am I ready to accept a loss of autonomy to prolong my life?\")."}
                .split('\n').map((line, i) => (
                  <span key={i} className="block mb-2">{line}</span>
                ))
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-blue-600 mb-3">
                {currentLanguage === "fr" ? "Où conserver ses directives anticipées ?" : "Where to keep your advance directives?"}
              </h2>
              <p className="text-gray-700">
                {currentLanguage === "fr" 
                  ? "Trois lieux de conservation principaux sont préconisés :\n1. Chez son médecin traitant (obligation légale d'information mutuelle)\n2. Dans le Dossier Médical Partagé (DMP)\n3. Au domicile, avec indication claire aux proches.\nLe registre national numérique, en cours de déploiement, centralisera progressivement toutes les directives. Une carte portable à glisser dans son portefeuille est également proposée par certains organismes."
                  : "Three main storage locations are recommended:\n1. With your primary care physician (legal obligation of mutual information)\n2. In the Shared Medical Record (DMP)\n3. At home, with clear indication to loved ones.\nThe national digital registry, currently being deployed, will gradually centralize all directives. A portable card to slip into your wallet is also offered by some organizations."}
                .split('\n').map((line, i) => (
                  <span key={i} className="block mb-2">{line}</span>
                ))
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-blue-600 mb-3">
                {currentLanguage === "fr" ? "Comment mettre à jour ses directives ?" : "How to update your directives?"}
              </h2>
              <p className="text-gray-700">
                {currentLanguage === "fr" 
                  ? "La révision s'effectue par tout moyen écrit (lettre manuscrite, formulaire actualisé), en précisant la date et la mention \"annule et remplace la version précédente\". Les experts recommandent une réévaluation tous les 3 ans ou à chaque changement important de situation personnelle/médicale."
                  : "Revision is done by any written means (handwritten letter, updated form), specifying the date and the mention \"cancels and replaces the previous version\". Experts recommend a reassessment every 3 years or with each significant change in personal/medical situation."}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-blue-600 mb-3">
                {currentLanguage === "fr" ? "Un médecin peut-il refuser d'appliquer mes directives ?" : "Can a doctor refuse to apply my directives?"}
              </h2>
              <p className="text-gray-700">
                {currentLanguage === "fr" 
                  ? "Oui dans deux cas précis :\n1. Urgence vitale nécessitant un délai d'évaluation (ex : coma traumatique nécessitant une réanimation transitoire)\n2. Inadéquation manifeste avec la situation médicale (ex : refus de transfusion pour un traitement devenu peu invasif).\nDans ce second cas, le médecin doit obligatoirement :\n• Consulter un confrère indépendant\n• Recueillir l'avis de la personne de confiance ou des proches\n• Motiver par écrit sa décision au dossier médical."
                  : "Yes in two specific cases:\n1. Vital emergency requiring an evaluation delay (e.g., traumatic coma requiring transitory resuscitation)\n2. Manifest inadequacy with the medical situation (e.g., refusal of transfusion for a treatment that has become minimally invasive).\nIn this second case, the doctor must:\n• Consult an independent colleague\n• Gather the opinion of the trusted person or relatives\n• Motivate his decision in writing in the medical file."}
                .split('\n').map((line, i) => (
                  <span key={i} className="block mb-2">{line}</span>
                ))
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-blue-600 mb-3">
                {currentLanguage === "fr" ? "Dois-je obligatoirement désigner une personne de confiance ?" : "Must I designate a trusted person?"}
              </h2>
              <p className="text-gray-700">
                {currentLanguage === "fr" 
                  ? "Non, mais cette désignation est fortement recommandée. La personne de confiance :\n• Intervient en complément (non en remplacement) des directives\n• Peut aider à interpréter vos volontés dans des situations imprévues\n• Doit être consultée avant toute décision de non-application des directives."
                  : "No, but this designation is strongly recommended. The trusted person:\n• Intervenes as a complement (not a replacement) to the directives\n• Can help interpret your wishes in unforeseen situations\n• Must be consulted before any decision not to apply the directives."}
                .split('\n').map((line, i) => (
                  <span key={i} className="block mb-2">{line}</span>
                ))
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-blue-600 mb-3">
                {currentLanguage === "fr" ? "Où trouver de l'aide pour rédiger ?" : "Where to find help for writing?"}
              </h2>
              <p className="text-gray-700">
                {currentLanguage === "fr" 
                  ? "• L'application DirectivesPlus\n• Aide du médecin traitant : 67% des généralistes formés spécifiquement depuis 2022\n• Plateforme SOS Fin de Vie : écoute téléphonique et modèles personnalisables\n• Unités de soins palliatifs : entretiens d'1 à 3 heures avec un médecin spécialisé"
                  : "• The DirectivesPlus application\n• Help from your primary care physician: 67% of general practitioners specifically trained since 2022\n• SOS End of Life platform: telephone listening and customizable models\n• Palliative care units: interviews of 1 to 3 hours with a specialized doctor"}
                .split('\n').map((line, i) => (
                  <span key={i} className="block mb-2">{line}</span>
                ))
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FAQ;
