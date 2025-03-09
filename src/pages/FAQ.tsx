
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function FAQ() {
  const { currentLanguage } = useLanguage();
  const navigate = useNavigate();
  
  // Content based on language
  const faqItems = currentLanguage === 'en' ? [
    {
      question: "What are advance directives?",
      answer: "Advance directives are legal documents that allow you to specify your preferences for medical care in case you become unable to make decisions for yourself. They help ensure your wishes are respected when you cannot communicate them directly."
    },
    {
      question: "Who needs advance directives?",
      answer: "Everyone should consider having advance directives. They're especially important for older adults, people with serious illnesses, or anyone who wants to ensure their medical preferences are known and followed."
    },
    {
      question: "How do I create advance directives?",
      answer: "Our application guides you through the process step by step. Generally, you'll need to: (1) Think about your values and preferences, (2) Complete our questionnaires, (3) Review and sign the documents, and (4) Share them with your trusted persons and healthcare providers."
    },
    {
      question: "What is a 'trusted person'?",
      answer: "A trusted person (sometimes called a healthcare proxy or surrogate) is someone you designate to make healthcare decisions on your behalf if you're unable to do so. This should be someone who understands and respects your wishes."
    },
    {
      question: "Can I change my advance directives later?",
      answer: "Yes! You can update your advance directives at any time. In fact, it's recommended to review them periodically, especially after major life events or changes in your health status."
    }
  ] : [
    {
      question: "Que sont les directives anticipées?",
      answer: "Les directives anticipées sont des documents légaux qui vous permettent de spécifier vos préférences en matière de soins médicaux au cas où vous deviendriez incapable de prendre des décisions par vous-même. Elles aident à garantir que vos souhaits sont respectés lorsque vous ne pouvez pas les communiquer directement."
    },
    {
      question: "Qui a besoin de directives anticipées?",
      answer: "Tout le monde devrait envisager d'avoir des directives anticipées. Elles sont particulièrement importantes pour les personnes âgées, les personnes atteintes de maladies graves, ou toute personne qui souhaite s'assurer que ses préférences médicales sont connues et suivies."
    },
    {
      question: "Comment créer des directives anticipées?",
      answer: "Notre application vous guide à travers le processus étape par étape. Généralement, vous devrez: (1) Réfléchir à vos valeurs et préférences, (2) Remplir nos questionnaires, (3) Examiner et signer les documents, et (4) Les partager avec vos personnes de confiance et vos prestataires de soins de santé."
    },
    {
      question: "Qu'est-ce qu'une 'personne de confiance'?",
      answer: "Une personne de confiance est quelqu'un que vous désignez pour prendre des décisions de soins de santé en votre nom si vous êtes incapable de le faire. Cette personne doit comprendre et respecter vos souhaits."
    },
    {
      question: "Puis-je modifier mes directives anticipées ultérieurement?",
      answer: "Oui! Vous pouvez mettre à jour vos directives anticipées à tout moment. En fait, il est recommandé de les réviser périodiquement, notamment après des événements majeurs de la vie ou des changements dans votre état de santé."
    }
  ];
  
  return (
    <div className="container max-w-3xl py-10">
      <div className="mb-10">
        <div className="flex items-center mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="mr-2"
            aria-label={currentLanguage === 'en' ? 'Back' : 'Retour'}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold">
            {currentLanguage === 'en' ? 'Frequently Asked Questions' : 'Questions Fréquemment Posées'}
          </h1>
        </div>
        <p className="text-muted-foreground">
          {currentLanguage === 'en' 
            ? 'Find answers to common questions about advance directives and using our application.'
            : 'Trouvez des réponses aux questions courantes sur les directives anticipées et l\'utilisation de notre application.'}
        </p>
      </div>
      
      <Accordion type="single" collapsible className="w-full">
        {faqItems.map((item, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-left">
              {item.question}
            </AccordionTrigger>
            <AccordionContent>
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

export default FAQ;
