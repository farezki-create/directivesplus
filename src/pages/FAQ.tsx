
import { Header } from "@/components/Header";
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const FAQ = () => {
  const { currentLanguage } = useLanguage();
  const navigate = useNavigate();

  const fr = {
    questions: [
      {
        title: "Que sont les directives anticipées ?",
        content: "Les directives anticipées permettent à toute personne majeure d'exprimer par écrit ses volontés concernant les traitements médicaux en cas d'incapacité à communiquer. Ce dispositif légal, renforcé par la loi Claeys-Leonetti de 2016, vise à garantir le respect des choix personnels en fin de vie, notamment concernant la limitation ou l'arrêt des thérapeutiques. Contrairement à un testament, elles se concentrent exclusivement sur les décisions médicales et restent modifiables à tout moment."
      },
      {
        title: "Qui peut rédiger des directives anticipées ?",
        content: "Toute personne majeure, y compris sous mesure de protection juridique (avec autorisation du juge), possède ce droit. Aucune condition de santé n'est requise : 63% des rédacteurs en 2024 étaient des personnes en bonne santé selon l'Observatoire national de la fin de vie. La démarche s'avère particulièrement pertinente pour les patients atteints de maladies évolutives ou les personnes souhaitant anticiper un accident grave."
      },
      {
        title: "Comment rédiger des directives valides ?",
        content: "Le document doit être écrit, daté et signé personnellement, avec mention des nom, prénom, date et lieu de naissance. Bien que la rédaction sur papier libre soit possible, l'utilisation des modèles officiels (disponibles sur service-public.fr) est fortement recommandée pour couvrir tous les aspects légaux. Pour les personnes incapables d'écrire, la loi prévoit une procédure exceptionnelle avec deux témoins attestant de la volonté libre et éclairée."
      },
      {
        title: "Quels éléments doivent figurer dans le document ?",
        content: [
          "Les directives doivent préciser :",
          "• Le refus ou l'acceptation de traitements spécifiques (réanimation, nutrition artificielle, etc.)",
          "• Les souhaits concernant la sédation palliative",
          "• Les préférences relatives au lieu de fin de vie",
          "• Toute considération éthique ou religieuse influençant les choix thérapeutiques.",
          "La Haute Autorité de Santé recommande d'intégrer des réflexions personnelles sur sa conception de la qualité de vie (\"Qu'est-ce qui me rend heureux ?\", \"Suis-je prêt à accepter une perte d'autonomie pour prolonger ma vie ?\")."
        ]
      },
      {
        title: "Où conserver ses directives anticipées ?",
        content: [
          "Trois lieux de conservation principaux sont préconisés :",
          "1. Chez son médecin traitant (obligation légale d'information mutuelle)",
          "2. Dans le Dossier Médical Partagé (DMP)",
          "3. Au domicile, avec indication claire aux proches.",
          "Le registre national numérique, en cours de déploiement, centralisera progressivement toutes les directives. Une carte portable à glisser dans son portefeuille est également proposée par certains organismes."
        ]
      },
      {
        title: "Comment mettre à jour ses directives ?",
        content: "La révision s'effectue par tout moyen écrit (lettre manuscrite, formulaire actualisé), en précisant la date et la mention \"annule et remplace la version précédente\". Les experts recommandent une réévaluation tous les 3 ans ou à chaque changement important de situation personnelle/médicale."
      },
      {
        title: "Un médecin peut-il refuser d'appliquer mes directives ?",
        content: [
          "Oui dans deux cas précis :",
          "1. Urgence vitale nécessitant un délai d'évaluation (ex : coma traumatique nécessitant une réanimation transitoire)",
          "2. Inadéquation manifeste avec la situation médicale (ex : refus de transfusion pour un traitement devenu peu invasif).",
          "Dans ce second cas, le médecin doit obligatoirement :",
          "• Consulter un confrère indépendant",
          "• Recueillir l'avis de la personne de confiance ou des proches",
          "• Motiver par écrit sa décision au dossier médical."
        ]
      },
      {
        title: "Dois-je obligatoirement désigner une personne de confiance ?",
        content: [
          "Non, mais cette désignation est fortement recommandée. La personne de confiance :",
          "• Intervient en complément (non en remplacement) des directives",
          "• Peut aider à interpréter vos volontés dans des situations imprévues",
          "• Doit être consultée avant toute décision de non-application des directives."
        ]
      },
      {
        title: "Où trouver de l'aide pour rédiger ?",
        content: [
          "• L'application DirectivesPlus",
          "• Aide du médecin traitant : 67% des généralistes formés spécifiquement depuis 2022",
          "• Plateforme SOS Fin de Vie : écoute téléphonique et modèles personnalisables",
          "• Unités de soins palliatifs : entretiens d'1 à 3 heures avec un médecin spécialisé"
        ]
      }
    ]
  };

  const en = {
    questions: [
      {
        title: "What are advance directives?",
        content: "Advance directives allow any adult to express in writing their wishes regarding medical treatments in case of inability to communicate. This legal mechanism, strengthened by the Claeys-Leonetti law of 2016, aims to ensure respect for personal choices at the end of life, particularly regarding the limitation or cessation of therapeutics. Unlike a will, they focus exclusively on medical decisions and remain modifiable at any time."
      },
      {
        title: "Who can write advance directives?",
        content: "Any adult, including those under legal protection measures (with the judge's authorization), has this right. No health condition is required: 63% of writers in 2024 were healthy people according to the National End-of-Life Observatory. The approach is particularly relevant for patients with progressive diseases or people wishing to anticipate a serious accident."
      },
      {
        title: "How to write valid directives?",
        content: "The document must be written, dated and personally signed, with mention of surname, first name, date and place of birth. Although drafting on plain paper is possible, the use of official templates (available on service-public.fr) is strongly recommended to cover all legal aspects. For people unable to write, the law provides for an exceptional procedure with two witnesses attesting to free and informed will."
      },
      {
        title: "What elements should be included in the document?",
        content: [
          "The directives must specify:",
          "• Refusal or acceptance of specific treatments (resuscitation, artificial nutrition, etc.)",
          "• Wishes regarding palliative sedation",
          "• Preferences regarding the place of end of life",
          "• Any ethical or religious considerations influencing therapeutic choices.",
          "The High Authority for Health recommends incorporating personal reflections on one's conception of quality of life (\"What makes me happy?\", \"Am I ready to accept a loss of autonomy to prolong my life?\")."
        ]
      },
      {
        title: "Where to keep your advance directives?",
        content: [
          "Three main storage locations are recommended:",
          "1. With your primary care physician (legal obligation of mutual information)",
          "2. In the Shared Medical Record (DMP)",
          "3. At home, with clear indication to loved ones.",
          "The national digital registry, currently being deployed, will gradually centralize all directives. A portable card to slip into your wallet is also offered by some organizations."
        ]
      },
      {
        title: "How to update your directives?",
        content: "Revision is done by any written means (handwritten letter, updated form), specifying the date and the mention \"cancels and replaces the previous version\". Experts recommend a reassessment every 3 years or with each significant change in personal/medical situation."
      },
      {
        title: "Can a doctor refuse to apply my directives?",
        content: [
          "Yes in two specific cases:",
          "1. Vital emergency requiring an evaluation delay (e.g., traumatic coma requiring transitory resuscitation)",
          "2. Manifest inadequacy with the medical situation (e.g., refusal of transfusion for a treatment that has become minimally invasive).",
          "In this second case, the doctor must:",
          "• Consult an independent colleague",
          "• Gather the opinion of the trusted person or relatives",
          "• Motivate his decision in writing in the medical file."
        ]
      },
      {
        title: "Must I designate a trusted person?",
        content: [
          "No, but this designation is strongly recommended. The trusted person:",
          "• Intervenes as a complement (not a replacement) to the directives",
          "• Can help interpret your wishes in unforeseen situations",
          "• Must be consulted before any decision not to apply the directives."
        ]
      },
      {
        title: "Where to find help for writing?",
        content: [
          "• The DirectivesPlus application",
          "• Help from your primary care physician: 67% of general practitioners specifically trained since 2022",
          "• SOS End of Life platform: telephone listening and customizable models",
          "• Palliative care units: interviews of 1 to 3 hours with a specialized doctor"
        ]
      }
    ]
  };

  const content = currentLanguage === "fr" ? fr : en;

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
            {content.questions.map((question, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-blue-600 mb-3">
                  {question.title}
                </h2>
                <div className="text-gray-700">
                  {typeof question.content === "string" ? (
                    <p>{question.content}</p>
                  ) : (
                    question.content.map((line, i) => (
                      <span key={i} className="block mb-2">{line}</span>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default FAQ;
