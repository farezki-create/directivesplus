import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQSection = () => {
  const faqItems = [
    {
      question: "Que sont les directives anticipées ?",
      answer: (
        <div className="space-y-3">
          <p>Les directives anticipées permettent à toute personne majeure d'exprimer par écrit ses volontés concernant les traitements médicaux en cas d'incapacité à communiquer. Ce dispositif légal, renforcé par la loi Claeys-Leonetti de 2016, vise à garantir le respect des choix personnels en fin de vie, notamment concernant la limitation ou l'arrêt des thérapeutiques.</p>
          <p>Contrairement à un testament, elles se concentrent exclusivement sur les décisions médicales et restent modifiables à tout moment.</p>
        </div>
      )
    },
    {
      question: "Qui peut rédiger des directives anticipées ?",
      answer: (
        <div className="space-y-3">
          <p>Toute personne majeure, y compris sous mesure de protection juridique (avec autorisation du juge), possède ce droit. Aucune condition de santé n'est requise : 63% des rédacteurs en 2024 étaient des personnes en bonne santé selon l'Observatoire national de la fin de vie.</p>
          <p>La démarche s'avère particulièrement pertinente pour les patients atteints de maladies évolutives ou les personnes souhaitant anticiper un accident grave.</p>
        </div>
      )
    },
    {
      question: "Comment rédiger des directives valides ?",
      answer: (
        <div className="space-y-3">
          <p>Le document doit être écrit, daté et signé personnellement, avec mention des nom, prénom, date et lieu de naissance. Bien que la rédaction sur papier libre soit possible, l'utilisation des modèles officiels (disponibles sur service-public.fr) est fortement recommandée pour couvrir tous les aspects légaux.</p>
          <p>Pour les personnes incapables d'écrire, la loi prévoit une procédure exceptionnelle avec deux témoins attestant de la volonté libre et éclairée.</p>
        </div>
      )
    },
    {
      question: "Quels éléments doivent figurer dans le document ?",
      answer: (
        <div className="space-y-3">
          <p>Les directives doivent préciser :</p>
          <ul className="list-disc ml-6 space-y-2">
            <li>Le refus ou l'acceptation de traitements spécifiques (réanimation, nutrition artificielle, etc.)</li>
            <li>Les souhaits concernant la sédation palliative</li>
            <li>Les préférences relatives au lieu de fin de vie</li>
            <li>Toute considération éthique ou religieuse influençant les choix thérapeutiques</li>
          </ul>
          <p>La Haute Autorité de Santé recommande d'intégrer des réflexions personnelles sur sa conception de la qualité de vie ("Qu'est-ce qui me rend heureux ?", "Suis-je prêt à accepter une perte d'autonomie pour prolonger ma vie ?").</p>
        </div>
      )
    },
    {
      question: "Où conserver ses directives anticipées ?",
      answer: (
        <div className="space-y-3">
          <p>Trois lieux de conservation principaux sont préconisés :</p>
          <ol className="list-decimal ml-6 space-y-2">
            <li>Chez son médecin traitant (obligation légale d'information mutuelle)</li>
            <li>Dans le Dossier Médical Partagé (DMP)</li>
            <li>Au domicile, avec indication claire aux proches</li>
          </ol>
          <p>Le registre national numérique, en cours de déploiement, centralisera progressivement toutes les directives. Une carte portable à glisser dans son portefeuille est également proposée par certains organismes.</p>
        </div>
      )
    },
    {
      question: "Comment mettre à jour ses directives ?",
      answer: (
        <div className="space-y-3">
          <p>La révision s'effectue par tout moyen écrit (lettre manuscrite, formulaire actualisé), en précisant la date et la mention "annule et remplace la version précédente".</p>
          <p>Les experts recommandent une réévaluation tous les 3 ans ou à chaque changement important de situation personnelle/médicale.</p>
        </div>
      )
    },
    {
      question: "Un médecin peut-il refuser d'appliquer mes directives ?",
      answer: (
        <div className="space-y-3">
          <p>Oui dans deux cas précis :</p>
          <ol className="list-decimal ml-6 space-y-2">
            <li>Urgence vitale nécessitant un délai d'évaluation (ex : coma traumatique nécessitant une réanimation transitoire)</li>
            <li>Inadéquation manifeste avec la situation médicale (ex : refus de transfusion pour un traitement devenu peu invasif)</li>
          </ol>
          <p>Dans ce second cas, le médecin doit obligatoirement :</p>
          <ul className="list-disc ml-6 space-y-2">
            <li>Consulter un confrère indépendant</li>
            <li>Recueillir l'avis de la personne de confiance ou des proches</li>
            <li>Motiver par écrit sa décision au dossier médical</li>
          </ul>
        </div>
      )
    },
    {
      question: "Dois-je obligatoirement désigner une personne de confiance ?",
      answer: (
        <div className="space-y-3">
          <p>Non, mais cette désignation est fortement recommandée. La personne de confiance :</p>
          <ul className="list-disc ml-6 space-y-2">
            <li>Intervient en complément (non en remplacement) des directives</li>
            <li>Peut aider à interpréter vos volontés dans des situations imprévues</li>
            <li>Doit être consultée avant toute décision de non-application des directives</li>
          </ul>
        </div>
      )
    },
    {
      question: "Où trouver de l'aide pour rédiger ?",
      answer: "L'application DirectivesPlus vous guide pas à pas dans la rédaction de vos directives anticipées avec des questions claires et des exemples pour vous assurer que vos volontés sont correctement exprimées."
    },
    {
      question: "Quel est le poids de mes directives anticipées dans la décision médicale ?",
      answer: (
        <div className="space-y-3">
          <p>En cas d'hospitalisation, vous devez être interrogé sur l'existence de directives anticipées. Les directives anticipées constituent un document essentiel pour la prise de décision médicale en situation de fin de vie.</p>
          <p>Leur contenu prévaut sur tout autre avis non médical, y compris sur celui de votre personne de confiance et de vos proches.</p>
          <p>Le médecin a l'obligation de respecter les directives anticipées.</p>
          <p className="font-semibold">Il existe 2 exceptions :</p>
          <ul className="list-disc ml-6 space-y-2">
            <li>En cas d'urgence vitale, pendant le temps nécessaire de l'évaluation complète de la situation.</li>
            <li>Lorsque les directives anticipées apparaissent manifestement inappropriées ou non conformes à la situation médicale.</li>
          </ul>
          <p>Dans ce cas, la décision de refus d'application des directives anticipées est prise de façon collégiale, inscrite dans le dossier médical et portée à la connaissance de la personne de confiance.</p>
        </div>
      )
    },
    {
      question: "Les directives anticipées sont-elles obligatoires ?",
      answer: "Non, la rédaction de directives anticipées est un acte volontaire. Cependant, elles sont fortement recommandées car elles garantissent le respect de vos volontés en cas d'incapacité à vous exprimer."
    },
    {
      question: "Combien de temps sont-elles valables ?",
      answer: "Les directives anticipées sont valables sans limitation de durée. Vous pouvez les modifier ou les révoquer à tout moment. Il est recommandé de les revoir régulièrement."
    },
    {
      question: "Qui peut consulter mes directives ?",
      answer: "Vos directives peuvent être consultées par les professionnels de santé qui vous prennent en charge, vos proches désignés, et toute personne à qui vous donnez accès via un code sécurisé."
    }
  ];

  return (
    <div className="mb-8">
      <Accordion type="single" collapsible className="w-full">
        {faqItems.map((item, index) => (
          <AccordionItem key={index} value={`item-${index}`} className="border-directiveplus-200">
            <AccordionTrigger className="text-left hover:text-directiveplus-600">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-gray-600">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default FAQSection;
