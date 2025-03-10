
import React from 'react';
import { useLanguage } from "@/hooks/useLanguage";
import { ScrollArea } from "@/components/ui/scroll-area";

export function AdvanceDirectivesGuide() {
  const { currentLanguage } = useLanguage();

  const frenchContent = `
Les « directives anticipées » sont une déclaration écrite que vous rédigez préalablement pour faire connaître votre volonté sur les conditions de prise en charge médicale de votre fin de vie. Dans l'hypothèse où vous êtes hors d'état d'exprimer votre volonté (suite à un coma, en cas de troubles cognitifs profonds, à la suite d'un accident, du fait de l'évolution d'une maladie ou encore du fait du grand âge…), ces directives permettent au médecin et à l'équipe médicale qui vous prennent en charge, de connaître vos volontés.

Confronté à un patient en situation de fin de vie, quelle qu'en soit la cause et dans l'incapacité d'exprimer sa volonté, le médecin a l'obligation de s'enquérir en priorité de l'existence de directives anticipées et de les respecter, dès lors qu'elles sont appropriées et conformes à la situation médicale.

Qui peut rédiger des directives anticipées ?
Toute personne majeure peut, si elle le souhaite, rédiger ses directives anticipées. Si vous bénéficiez d'un régime de protection légale (vous êtes par exemple sous tutelle), vous devez demander l'autorisation du juge ou, le cas échéant, du conseil de famille.

Quelle est la forme des directives anticipées ?
Il s'agit d'un document écrit qui doit être daté et signé avec vos noms, prénoms, date et lieu de naissance. Si vous êtes dans l'impossibilité physique d'écrire vos directives anticipées, on peut le faire à votre place, mais le document n'est valide que si deux témoins attestent par écrit, en précisant leurs noms et qualités, que ce document est bien l'expression de votre volonté libre et éclairée.

Quel est le contenu des directives anticipées ?
Vous pouvez exprimer, par avance, votre volonté de refuser ou de poursuivre, de limiter ou d'arrêter des traitements, y compris de maintien artificiel de la vie, ou de bénéficier d'une sédation profonde et continue. Ces décisions ne seront mises en œuvre qu'à l'issue d'une procédure collégiale permettant de vérifier que votre situation les autorise et que telle était bien votre volonté.

Puis-je changer d'avis après avoir rédigé des directives anticipées ?
Vous pouvez modifier totalement ou partiellement, voire annuler vos directives anticipées à tout moment et sans formalité. Les directives anticipées sont valables indéfiniment, tant que vous ne les modifiez vous-même.

Comment m'assurer que mes directives anticipées seront suivies d'effet ?
Afin de vous assurer que les directives et leurs modifications éventuelles seront bien prises en compte et exécutées, vous êtes invité à :
– garder l'original de vos directives anticipées sur vous
– le conserver chez votre médecin, dans votre dossier médical
– le confier à une personne de confiance désignée comme telle ou à un tiers

Quelle est la portée de mes directives anticipées dans la décision médicale ?
Si vous avez rédigé des directives anticipées, le médecin doit les appliquer. Leur contenu prime sur les avis et témoignages (personne de confiance, famille, proches) et elles s'imposent au médecin, qui ne peut refuser de les appliquer que dans deux situations : en cas d'urgence vitale, le temps d'évaluer la situation et lorsque les directives anticipées lui apparaissent inappropriées ou non conformes à la situation médicale.`;

  const englishContent = `
Advance Directives: Planning for Your Future Healthcare

1. Definition
Advance directives are legal documents allowing individuals to outline their healthcare preferences if they become incapacitated. They cover end-of-life care, resuscitation, and artificial life support.

2. Who Can Create Them?
• Adults (age 18+ in most countries)
• Must be created voluntarily and while mentally capable
• If under legal protection (guardianship), may require court authorization

3. Legal Format
• Written document that must be dated and signed
• Must include your full name, date and place of birth
• If physically unable to write, two witnesses must attest in writing that the document expresses your free and informed will
• Your doctor can add certification that you are capable of expressing your free will and have received appropriate information

4. Content
• You can express your desire to refuse or continue, limit or stop treatments, including artificial life support
• You may indicate preference for deep and continuous sedation
• These decisions will only be implemented after a collegial process verifying your situation warrants them

5. When to Write Advance Directives
• Must be written while you are capable of expressing "free and informed" consent
• No need to be ill or elderly to anticipate end-of-life conditions
• During a medical consultation, hospitalization, or admission to a care facility, your doctor can inform you about this option
• In case of serious and progressive illness, your doctor should suggest writing them

6. Changing Your Mind
• You can modify partially or completely, or cancel your advance directives at any time without formality
• As directives are written, revisions must also be in writing
• The most recent directives will be considered valid

7. Ensuring Your Directives Are Followed
To ensure your directives are properly considered:
• Keep the original with you
• Store a copy with your doctor in your medical file
• Entrust it to your designated trusted person or a third party
• During hospitalization, inform staff if you have written advance directives

8. Legal Weight in Medical Decisions
• If you have written advance directives, doctors must apply them
• Their content takes precedence over opinions and testimonies (trusted person, family, relatives)
• Doctors can refuse to apply them only in two situations:
  - In case of vital emergency, to evaluate the situation
  - When directives appear inappropriate or inconsistent with the medical situation`;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <ScrollArea className="h-[70vh] rounded-md border p-6 bg-white shadow-sm">
        <div className="prose prose-slate max-w-none">
          <div className="whitespace-pre-wrap">
            {currentLanguage === 'fr' ? frenchContent : englishContent}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
