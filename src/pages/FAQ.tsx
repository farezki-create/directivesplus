
import { Header } from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/hooks/useLanguage";

const FAQ = () => {
  const { t, currentLanguage } = useLanguage();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-center">
            {currentLanguage === 'fr' ? 'Questions/Réponses' : 'FAQ'}
          </h1>
          
          <div className="space-y-6">
            {currentLanguage === 'fr' ? (
              <>
                <Card className="overflow-hidden">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold text-blue-600 mb-4">Que sont les directives anticipées ?</h2>
                    <p className="mb-4">
                      Les directives anticipées permettent à toute personne majeure d'exprimer par écrit ses 
                      volontés concernant les traitements médicaux en cas d'incapacité à communiquer. Ce 
                      dispositif légal, renforcé par la loi Claeys-Leonetti de 2016, vise à garantir le respect 
                      des choix personnels en fin de vie, notamment concernant la limitation ou l'arrêt des thérapeutiques.
                    </p>
                    <p>
                      Contrairement à un testament, elles se concentrent exclusivement sur les décisions 
                      médicales et restent modifiables à tout moment.
                    </p>
                  </CardContent>
                </Card>

                <Card className="overflow-hidden">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold text-blue-600 mb-4">Qui peut rédiger des directives anticipées ?</h2>
                    <p>
                      Toute personne majeure, y compris sous mesure de protection juridique (avec autorisation 
                      du juge), possède ce droit. Aucune condition de santé n'est requise : 63% des rédacteurs en 
                      2024 étaient des personnes en bonne santé selon l'Observatoire national de la fin de vie. La 
                      démarche s'avère particulièrement pertinente pour les patients atteints de maladies 
                      évolutives ou les personnes souhaitant anticiper un accident grave.
                    </p>
                  </CardContent>
                </Card>

                <Card className="overflow-hidden">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold text-blue-600 mb-4">Comment rédiger des directives valides ?</h2>
                    <p>
                      Le document doit être écrit, daté et signé personnellement, avec mention des nom, prénom, 
                      date et lieu de naissance. Bien que la rédaction sur papier libre soit possible, l'utilisation des 
                      modèles officiels (disponibles sur service-public.fr) est fortement recommandée pour couvrir 
                      tous les aspects légaux. Pour les personnes incapables d'écrire, la loi prévoit une procédure 
                      exceptionnelle avec deux témoins attestant de la volonté libre et éclairée.
                    </p>
                  </CardContent>
                </Card>

                <Card className="overflow-hidden">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold text-blue-600 mb-4">Quels éléments doivent figurer dans le document ?</h2>
                    <p className="mb-4">Les directives doivent préciser :</p>
                    <ul className="list-disc pl-6 mb-4 space-y-2">
                      <li>Le refus ou l'acceptation de traitements spécifiques (réanimation, nutrition artificielle, etc.)</li>
                      <li>Les souhaits concernant la sédation palliative</li>
                      <li>Les préférences relatives au lieu de fin de vie</li>
                      <li>Toute considération éthique ou religieuse influençant les choix thérapeutiques.</li>
                    </ul>
                    <p>
                      La Haute Autorité de Santé recommande d'intégrer des réflexions personnelles sur sa 
                      conception de la qualité de vie ("Qu'est-ce qui me rend heureux ?", "Suis-je prêt à accepter 
                      une perte d'autonomie pour prolonger ma vie ?").
                    </p>
                    <h3 className="font-semibold mt-4 mb-2">Aspects pratiques</h3>
                  </CardContent>
                </Card>

                <Card className="overflow-hidden">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold text-blue-600 mb-4">Où conserver ses directives anticipées ?</h2>
                    <p className="mb-4">Trois lieux de conservation principaux sont préconisés :</p>
                    <ol className="list-decimal pl-6 mb-4 space-y-2">
                      <li>Chez son médecin traitant (obligation légale d'information mutuelle)</li>
                      <li>Dans le Dossier Médical Partagé (DMP)</li>
                      <li>Au domicile, avec indication claire aux proches.</li>
                    </ol>
                    <p>
                      Le registre national numérique, en cours de déploiement, centralisera progressivement toutes les directives.
                      Une carte portable à glisser dans son portefeuille est également proposée par certains organismes.
                    </p>
                  </CardContent>
                </Card>

                <Card className="overflow-hidden">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold text-blue-600 mb-4">Comment mettre à jour ses directives ?</h2>
                    <p>
                      La révision s'effectue par tout moyen écrit (lettre manuscrite, formulaire actualisé), 
                      en précisant la date et la mention "annule et remplace la version précédente". Les experts 
                      recommandent une réévaluation tous les 3 ans ou à chaque changement important de situation 
                      personnelle/médicale.
                    </p>
                  </CardContent>
                </Card>

                <Card className="overflow-hidden">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold text-blue-600 mb-4">Un médecin peut-il refuser d'appliquer mes directives ?</h2>
                    <p className="mb-4">Oui dans deux cas précis :</p>
                    <ol className="list-decimal pl-6 mb-4 space-y-2">
                      <li>Urgence vitale nécessitant un délai d'évaluation (ex : coma traumatique nécessitant une réanimation transitoire)</li>
                      <li>Inadéquation manifeste avec la situation médicale (ex : refus de transfusion pour un traitement devenu peu invasif).</li>
                    </ol>
                    <p className="mb-4">Dans ce second cas, le médecin doit obligatoirement :</p>
                    <ul className="list-disc pl-6 mb-4 space-y-2">
                      <li>Consulter un confrère indépendant</li>
                      <li>Recueillir l'avis de la personne de confiance ou des proches</li>
                      <li>Motiver par écrit sa décision au dossier médical.</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="overflow-hidden">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold text-blue-600 mb-4">Dois-je obligatoirement désigner une personne de confiance ?</h2>
                    <p className="mb-4">
                      Non, mais cette désignation est fortement recommandée. La personne de confiance :
                    </p>
                    <ul className="list-disc pl-6 mb-4 space-y-2">
                      <li>Intervient en complément (non en remplacement) des directives</li>
                      <li>Peut aider à interpréter vos volontés dans des situations imprévues</li>
                      <li>Doit être consultée avant toute décision de non-application des directives.</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="overflow-hidden">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold text-blue-600 mb-4">Où trouver de l'aide pour rédiger ?</h2>
                    <ul className="list-disc pl-6 mb-4 space-y-2">
                      <li>L'application DirectivesPlus</li>
                      <li>Aide du médecin traitant : 67% des généralistes formés spécifiquement depuis 2022</li>
                      <li>Plateforme SOS Fin de Vie : écoute téléphonique et modèles personnalisables</li>
                      <li>Unités de soins palliatifs : entretiens d'1 à 3 heures avec un médecin spécialisé</li>
                    </ul>
                  </CardContent>
                </Card>
              </>
            ) : (
              // Version anglaise (à implémenter au besoin)
              <Card className="overflow-hidden">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold text-blue-600 mb-4">What are advance directives?</h2>
                  <p>
                    Content in English will be displayed here when English language is selected.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default FAQ;
