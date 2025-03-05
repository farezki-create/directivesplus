
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/language/useLanguage";

interface LifeSupportExplanationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContinue: () => void;
}

export function LifeSupportExplanationDialog({ open, onOpenChange, onContinue }: LifeSupportExplanationDialogProps) {
  const { t, currentLanguage } = useLanguage();
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-center">
            {t('lifeSupport')}
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-6">
          {currentLanguage === 'fr' ? (
            <div className="space-y-4">
              <p className="text-lg mb-4">
                Ce document vous permet d'exprimer vos volontés quant à la poursuite ou l'arrêt de certains traitements en cas de maladie grave ou de situation critique où vous ne pourriez plus vous exprimer. Il ne s'agit pas d'une décision définitive, mais d'une aide pour les soignants et vos proches afin de respecter vos choix.
              </p>
              
              <p className="mb-4">
                Chaque question concerne une intervention médicale spécifique. Pour chaque point, plusieurs réponses sont possibles :
              </p>
              
              <ul className="list-disc pl-5 space-y-1 mb-4">
                <li><strong>"Oui"</strong> : Vous souhaitez recevoir ce traitement sans limite de durée.</li>
                <li><strong>"Oui pour une durée modérée"</strong> : Vous acceptez le traitement, mais uniquement pendant un temps limité.</li>
                <li><strong>"Oui seulement si l'équipe médicale le juge utile"</strong> : Vous faites confiance aux médecins pour décider s'il est nécessaire.</li>
                <li><strong>"Non rapidement abandonner le thérapeutique"</strong> : Vous refusez le traitement ou souhaitez qu'il soit interrompu rapidement si votre état ne s'améliore pas.</li>
                <li><strong>"La non-souffrance est à privilégier"</strong> : Vous acceptez ou refusez en fonction de ce qui permet de limiter votre souffrance.</li>
                <li><strong>"Indécision"</strong> : Vous ne souhaitez pas trancher pour l'instant et préférez en discuter avec un professionnel de santé.</li>
              </ul>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg">1. Le maintien sous respirateur artificiel</h3>
                  <p className="mt-1">
                    Le respirateur (ventilation mécanique) est un appareil qui aide à respirer lorsqu'on ne peut plus le faire seul. Il peut être temporaire ou prolongé.
                  </p>
                  <ul className="mt-2 list-disc pl-5 space-y-1">
                    <li>Accepter signifie que vous serez maintenu en vie même si vous ne pouvez plus respirer seul.</li>
                    <li>Refuser signifie que les médecins ne vous intuberont pas ou arrêteront rapidement l'assistance respiratoire si elle ne permet pas une amélioration durable.</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg">2. L'alimentation artificielle</h3>
                  <p className="mt-1">
                    Si vous ne pouvez plus vous alimenter normalement, une sonde ou une perfusion peut être utilisée pour vous nourrir.
                  </p>
                  <ul className="mt-2 list-disc pl-5 space-y-1">
                    <li>Cela permet de maintenir l'organisme en état de fonctionner, mais ne soigne pas la maladie sous-jacente.</li>
                    <li>Certains préfèrent limiter l'alimentation artificielle pour éviter un maintien en vie prolongé sans espoir d'amélioration.</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg">3. L'hydratation artificielle</h3>
                  <p className="mt-1">
                    L'hydratation par perfusion ou sonde permet d'éviter la déshydratation en cas d'incapacité à boire.
                  </p>
                  <ul className="mt-2 list-disc pl-5 space-y-1">
                    <li>Elle peut être essentielle dans certaines situations, mais dans d'autres, elle peut prolonger un état de fin de vie sans bénéfice réel.</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg">4. La réanimation cardio-pulmonaire</h3>
                  <p className="mt-1">
                    En cas d'arrêt cardiaque, des gestes de réanimation peuvent être pratiqués (massage cardiaque, défibrillateur, intubation…).
                  </p>
                  <ul className="mt-2 list-disc pl-5 space-y-1">
                    <li>La réanimation peut sauver une vie, mais dans certains cas, elle risque d'entraîner des séquelles graves et de prolonger une souffrance.</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg">5. La dialyse</h3>
                  <p className="mt-1">
                    La dialyse remplace le fonctionnement des reins quand ils ne peuvent plus éliminer les toxines du sang.
                  </p>
                  <ul className="mt-2 list-disc pl-5 space-y-1">
                    <li>Ce traitement peut être vital, mais s'il est commencé en phase terminale d'une maladie grave, il ne fait que prolonger une situation sans espoir d'amélioration.</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg">6. Les antibiotiques en cas d'infection grave</h3>
                  <p className="mt-1">
                    Les infections graves peuvent être fatales, surtout en cas d'état de santé très fragile.
                  </p>
                  <ul className="mt-2 list-disc pl-5 space-y-1">
                    <li>Accepter les antibiotiques peut permettre de guérir une infection et de prolonger la vie.</li>
                    <li>Dans certains cas, on peut choisir de ne pas les administrer si l'objectif est d'éviter un acharnement thérapeutique.</li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-lg text-center mb-6">
              {t('advancedIllnessDesc')}
            </p>
          )}
        </div>

        <DialogFooter>
          <Button onClick={onContinue} className="w-full sm:w-auto">
            {t('continueToQuestionnaire')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
