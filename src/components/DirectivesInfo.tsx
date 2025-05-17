
import React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";

const DirectivesInfo = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      {/* Introduction Section */}
      <div className="mb-10 space-y-4">
        <h2 className="text-3xl font-bold tracking-tight text-directiveplus-800">
          Directives Anticipées
        </h2>
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-directiveplus-100 to-directiveplus-50 rounded-lg opacity-50"></div>
          <Card className="relative border-none shadow-lg">
            <CardContent className="p-6">
              <p className="text-lg leading-relaxed text-gray-700">
                Les « directives anticipées » sont une déclaration écrite que vous rédigez préalablement 
                pour faire connaître votre volonté sur les conditions de prise en charge médicale de 
                votre fin de vie. Dans l'hypothèse où vous êtes hors d'état d'exprimer votre volonté, 
                ces directives permettent au médecin et à l'équipe médicale qui vous prennent en charge, 
                de connaître vos souhaits.
              </p>
              <p className="mt-4 text-lg leading-relaxed text-gray-700">
                Confronté à un patient en situation de fin de vie et dans l'incapacité d'exprimer sa volonté, 
                le médecin a l'obligation de s'enquérir en priorité de l'existence de directives anticipées 
                et de les respecter, dès lors qu'elles sont appropriées et conformes à la situation médicale.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Accordion FAQ Section */}
      <div className="space-y-6">
        <h3 className="text-2xl font-semibold text-directiveplus-700 mb-6">
          Informations Détaillées
        </h3>
        
        <Accordion type="single" collapsible className="w-full space-y-4">
          <AccordionItem value="item-1" className="border rounded-lg bg-white shadow-sm">
            <AccordionTrigger className="px-6 py-4 hover:bg-gray-50 text-lg font-medium text-directiveplus-800">
              Qui peut rédiger des directives anticipées ?
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-4 text-gray-600">
              <p className="leading-relaxed">
                Toute personne majeure peut, si elle le souhaite, rédiger ses directives anticipées. 
                Si vous bénéficiez d'un régime de protection légale (vous êtes par exemple sous tutelle), 
                vous devez demander l'autorisation du juge ou, le cas échéant, du conseil de famille.
              </p>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-2" className="border rounded-lg bg-white shadow-sm">
            <AccordionTrigger className="px-6 py-4 hover:bg-gray-50 text-lg font-medium text-directiveplus-800">
              Quelle est la forme des directives anticipées ?
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-4 text-gray-600">
              <p className="leading-relaxed">
                Il s'agit d'un document écrit qui doit être daté et signé avec vos noms, prénoms, date et lieu de naissance. 
                Si vous êtes dans l'impossibilité physique d'écrire vos directives anticipées, on peut le faire à votre place, 
                mais le document n'est valide que si deux témoins attestent par écrit, en précisant leurs noms et qualités, 
                que ce document est bien l'expression de votre volonté libre et éclairée.
              </p>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-3" className="border rounded-lg bg-white shadow-sm">
            <AccordionTrigger className="px-6 py-4 hover:bg-gray-50 text-lg font-medium text-directiveplus-800">
              Quel est le contenu des directives anticipées ?
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-4 text-gray-600">
              <p className="leading-relaxed">
                Vous pouvez exprimer, par avance, votre volonté de refuser ou de poursuivre, de limiter ou d'arrêter des traitements, 
                y compris de maintien artificiel de la vie, ou de bénéficier d'une sédation profonde et continue. 
                Ces décisions ne seront mises en œuvre qu'à l'issue d'une procédure collégiale permettant de vérifier que 
                votre situation les autorise et que telle était bien votre volonté.
              </p>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-4" className="border rounded-lg bg-white shadow-sm">
            <AccordionTrigger className="px-6 py-4 hover:bg-gray-50 text-lg font-medium text-directiveplus-800">
              Puis-je changer d'avis après avoir rédigé des directives anticipées ?
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-4 text-gray-600">
              <p className="leading-relaxed">
                Vous pouvez modifier totalement ou partiellement, voire annuler vos directives anticipées à tout moment et sans formalité. 
                Les directives anticipées sont valables indéfiniment, tant que vous ne les modifiez vous-même.
              </p>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-5" className="border rounded-lg bg-white shadow-sm">
            <AccordionTrigger className="px-6 py-4 hover:bg-gray-50 text-lg font-medium text-directiveplus-800">
              Comment m'assurer que mes directives anticipées seront suivies d'effet ?
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-4 text-gray-600">
              <p className="leading-relaxed">
                Afin de vous assurer que les directives et leurs modifications éventuelles seront bien prises en compte et exécutées, vous êtes invité à :
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Garder l'original de vos directives anticipées sur vous</li>
                <li>Le conserver chez votre médecin, dans votre dossier médical</li>
                <li>Le confier à une personne de confiance désignée comme telle ou à un tiers</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-6" className="border rounded-lg bg-white shadow-sm">
            <AccordionTrigger className="px-6 py-4 hover:bg-gray-50 text-lg font-medium text-directiveplus-800">
              Quelle est la portée de mes directives anticipées dans la décision médicale ?
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-4 text-gray-600">
              <p className="leading-relaxed">
                Si vous avez rédigé des directives anticipées, le médecin doit les appliquer. Leur contenu prime sur les avis 
                et témoignages (personne de confiance, famille, proches) et elles s'imposent au médecin, qui ne peut refuser 
                de les appliquer que dans deux situations :
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>En cas d'urgence vitale, le temps d'évaluer la situation</li>
                <li>Lorsque les directives anticipées lui apparaissent inappropriées ou non conformes à la situation médicale</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      
      {/* FAQ Section */}
      <div className="mt-16">
        <h3 className="text-2xl font-semibold text-directiveplus-700 mb-6">
          Questions Fréquemment Posées
        </h3>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-l-4 border-l-directiveplus-400">
            <CardContent className="p-6">
              <h4 className="font-semibold text-lg text-directiveplus-600 mb-2">
                Que sont les directives anticipées?
              </h4>
              <p className="text-gray-600">
                Les directives anticipées sont des documents légaux qui vous permettent de spécifier vos préférences 
                en matière de soins médicaux au cas où vous deviendriez incapable de prendre des décisions par vous-même. 
                Elles aident à garantir que vos souhaits sont respectés lorsque vous ne pouvez pas les communiquer directement.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-directiveplus-400">
            <CardContent className="p-6">
              <h4 className="font-semibold text-lg text-directiveplus-600 mb-2">
                Qui a besoin de directives anticipées?
              </h4>
              <p className="text-gray-600">
                Tout le monde devrait envisager d'avoir des directives anticipées. Elles sont particulièrement importantes 
                pour les personnes âgées, les personnes atteintes de maladies graves, ou toute personne qui souhaite s'assurer 
                que ses préférences médicales sont connues et suivies.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-directiveplus-400">
            <CardContent className="p-6">
              <h4 className="font-semibold text-lg text-directiveplus-600 mb-2">
                Qu'est-ce qu'une 'personne de confiance'?
              </h4>
              <p className="text-gray-600">
                Une personne de confiance est quelqu'un que vous désignez pour prendre des décisions de soins de santé 
                en votre nom si vous êtes incapable de le faire. Cette personne doit comprendre et respecter vos souhaits.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-directiveplus-400">
            <CardContent className="p-6">
              <h4 className="font-semibold text-lg text-directiveplus-600 mb-2">
                Puis-je modifier mes directives anticipées ultérieurement?
              </h4>
              <p className="text-gray-600">
                Oui! Vous pouvez mettre à jour vos directives anticipées à tout moment. En fait, il est recommandé 
                de les réviser périodiquement, notamment après des événements majeurs de la vie ou des changements 
                dans votre état de santé.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DirectivesInfo;
