
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/language/useLanguage";

interface ExplanationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContinue: () => void;
}

export function ExplanationDialog({ open, onOpenChange, onContinue }: ExplanationDialogProps) {
  const { t, currentLanguage } = useLanguage();
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-center">
            {t('beforeStarting')}
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-6">
          {currentLanguage === 'fr' ? (
            <div className="space-y-4">
              <p className="text-lg mb-4">
                Ce document vous aide à exprimer vos souhaits concernant votre prise en charge médicale en cas de situation critique où vous ne pourriez plus vous exprimer. Chaque question est importante et reflète des décisions personnelles qui peuvent guider les soignants et vos proches. Prenez le temps d'y réfléchir.
              </p>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg">1. Je souhaite que l'on respecte ma volonté de ne pas être réanimé</h3>
                  <p className="mt-1">Cela signifie que si votre cœur s'arrête ou que vous cessez de respirer, les médecins ne tenteront pas de vous réanimer (massage cardiaque, défibrillateur, intubation…).</p>
                  
                  <ul className="mt-2 list-disc pl-5 space-y-1">
                    <li><strong>"Oui"</strong> : Vous refusez toute tentative de réanimation.</li>
                    <li><strong>"Non"</strong> : Vous acceptez que l'on tente de vous réanimer si cela est médicalement possible.</li>
                    <li><strong>"Je ne sais pas"</strong> : Vous n'avez pas encore pris de décision et souhaitez en discuter avec un professionnel de santé.</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg">2. Je souhaite que l'on respecte ma volonté d'arrêter ou de limiter les traitements actifs</h3>
                  <p className="mt-1">Il s'agit des traitements qui visent à prolonger la vie, comme la ventilation artificielle, la dialyse, ou certains médicaments agressifs.</p>
                  
                  <ul className="mt-2 list-disc pl-5 space-y-1">
                    <li><strong>"Oui"</strong> : Vous souhaitez que les traitements lourds puissent être arrêtés ou non commencés si leur poursuite ne fait qu'augmenter votre souffrance ou ne permet pas d'améliorer votre état.</li>
                    <li><strong>"Non"</strong> : Vous voulez recevoir tous les traitements possibles, même s'ils sont lourds et prolongent la vie sans espoir d'amélioration.</li>
                    <li><strong>"Je ne sais pas"</strong> : Vous hésitez et aimeriez en parler avec votre médecin.</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg">3. Je demande que l'on soulage mes souffrances même si cela a pour effet d'abréger ma vie</h3>
                  <p className="mt-1">Dans certaines situations, les médicaments nécessaires pour soulager la douleur (comme la morphine) peuvent indirectement accélérer la fin de vie.</p>
                  
                  <ul className="mt-2 list-disc pl-5 space-y-1">
                    <li><strong>"Oui"</strong> : Vous privilégiez le soulagement de la douleur, même si cela peut raccourcir votre vie.</li>
                    <li><strong>"Non"</strong> : Vous souhaitez limiter les traitements antidouleur si cela risque d'avoir cet effet.</li>
                    <li><strong>"Je ne sais pas"</strong> : Vous souhaitez plus d'informations ou en discuter avant de décider.</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg">4. Souhaitez-vous que vos proches soient informés de votre état de santé ?</h3>
                  <p className="mt-1">Les médecins sont tenus au secret médical, sauf si vous autorisez vos proches à être informés.</p>
                  
                  <ul className="mt-2 list-disc pl-5 space-y-1">
                    <li><strong>"Oui"</strong> : Vous acceptez que vos proches puissent être informés de votre état et des décisions médicales prises.</li>
                    <li><strong>"Non"</strong> : Vous souhaitez que votre état de santé reste confidentiel, même pour vos proches.</li>
                    <li><strong>"Je ne sais pas"</strong> : Vous avez besoin de réfléchir ou d'en parler avec votre entourage.</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg">5. Acceptez-vous de recevoir une transfusion sanguine si nécessaire ?</h3>
                  <p className="mt-1">Une transfusion sanguine peut être vitale en cas d'hémorragie ou d'anémie sévère. Certaines personnes la refusent pour des raisons personnelles ou religieuses.</p>
                  
                  <ul className="mt-2 list-disc pl-5 space-y-1">
                    <li><strong>"Oui"</strong> : Vous acceptez qu'on vous transfuse si nécessaire.</li>
                    <li><strong>"Non"</strong> : Vous refusez toute transfusion, même en cas de nécessité vitale.</li>
                    <li><strong>"Je ne sais pas"</strong> : Vous n'avez pas encore décidé et souhaitez plus d'informations.</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg">6. Acceptez-vous de faire don de vos organes après votre décès ?</h3>
                  <p className="mt-1">Le don d'organes peut sauver des vies. En France, chacun est considéré comme donneur par défaut, mais vous pouvez exprimer votre refus.</p>
                  
                  <ul className="mt-2 list-disc pl-5 space-y-1">
                    <li><strong>"Oui"</strong> : Vous acceptez que vos organes puissent être prélevés après votre décès pour aider d'autres personnes.</li>
                    <li><strong>"Non"</strong> : Vous refusez tout prélèvement d'organes après votre décès.</li>
                    <li><strong>"Je ne sais pas"</strong> : Vous hésitez et souhaitez prendre le temps de réfléchir.</li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-lg text-center mb-6">
              {t('generalOpinionDesc')}
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
