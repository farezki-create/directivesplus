
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ExamplesContentProps {
  onBack: () => void;
}

export function ExamplesContent({ onBack }: ExamplesContentProps) {
  const [showTemplates, setShowTemplates] = useState(false);
  const [showPhrases, setShowPhrases] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    type: 'add' | 'remove';
    phrase: string;
  }>({ isOpen: false, type: 'add', phrase: '' });
  const { toast } = useToast();

  const examplePhrases = [
    {
      text: "En cas d'arrêt cardiaque avec pronostic neurologique incertain, je refuse les manœuvres de réanimation et la ventilation mécanique prolongée, privilégiant une prise en charge palliative",
    },
    {
      text: "Si je perds définitivement ma capacité à communiquer et à reconnaître mes proches à cause de ma maladie d'Alzheimer, je demande l'arrêt de toute nutrition ou hydratation artificielle.",
    },
    {
      text: "En cas d'échec des thérapies ciblées et de progression tumorale symptomatique, je refuse toute chimiothérapie palliative à visée uniquement de gain de survie limité, privilégiant un traitement antalgique maximal associé à une sédation intermittente si nécessaire.",
    },
    {
      text: "En cas de décompensation aiguë de ma pathologie cardiaque avec pronostic fonctionnel réservé, je refuse toute hospitalisation en service de soins intensifs, autorisant uniquement les soins de confort prodigués à mon domicile ou en EHPAD.",
    },
    {
      text: "Lorsque j'aurai perdu de façon irréversible ma capacité à m'alimenter oralement du fait de troubles neurodégénératifs, je refuse toute gastrostomie ou hydratation parentérale, autorisant uniquement des soins de bouche réguliers.",
    },
    {
      text: "En accord avec mes convictions religieuses, je refuse catégoriquement toute transfusion sanguine quelle que soit la situation clinique, y compris en contexte vital, autorisant uniquement les alternatives thérapeutiques non hémiques.",
    },
    {
      text: "En cas de dégradation respiratoire nécessitant une assistance mécanique invasive (trachéotomie), je refuse ce geste au profit d'une ventilation non invasive et d'une sédation palliative en phase terminale, conformément aux recommandations de la SFAP sur les maladies neurodégénératives. J'autorise uniquement les soins de confort visant à prévenir les souffrances liées à l'encombrement bronchique.",
    },
    {
      text: "En cas de rejet aigu irréversible malgré un second traitement immunosuppresseur, je refuse toute retransplantation ou assistance ventriculaire prolongée. Je souhaite une limitation thérapeutique axée sur le contrôle symptomatique, incluant si nécessaire une sédation profonde continue selon l'article R. 4127-37 du Code de Santé Public.",
    },
    {
      text: "En cas de coma acidocétosique résistant à 72h de réanimation, complété d'un état végétatif persistant, je refuse toute nutrition parentérale au profit de soins palliatifs. Cette directive s'applique uniquement si deux neurologues indépendants confirment l'absence de potentiel de récupération.",
    },
    {
      text: "Lors d'une crise myasthénique avec insuffisance respiratoire aiguë, j'accepte une intubation de courte durée (<7 jours) mais refuse toute trachéotomie définitive. Au-delà de 15 jours de ventilation mécanique sans amélioration, je demande l'orientation vers une unité de soins palliatifs.",
    },
    {
      text: "En cas de découverte d'un adénocarcinome colique métastatique, je refuse toute colectomie ou chimiothérapie adjuvante au profit d'une colostomie palliative si nécessaire. J'exige une concertation oncogériatrique préalable validant mon choix selon les critères de la Société Internationale d'Oncologie Gériatrique.",
    }
  ];

  const handleAddToSynthesis = async (phrase: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour ajouter une phrase à votre synthèse",
          variant: "destructive",
        });
        return;
      }

      // Vérifier d'abord si une synthèse existe déjà pour cet utilisateur
      const { data: existingSynthesis, error: fetchError } = await supabase
        .from('questionnaire_synthesis')
        .select('free_text')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (fetchError) {
        throw fetchError;
      }

      let currentText = existingSynthesis?.free_text || '';

      // Diviser le texte existant en sections
      const sections = currentText.split("PERSONNE DE CONFIANCE");
      const mainText = sections[0] || '';
      const trustedPersonSection = sections.length > 1 ? sections[1] : '';

      // Éviter les doublons
      if (mainText.includes(phrase)) {
        toast({
          title: "Information",
          description: "Cette phrase est déjà présente dans votre synthèse",
        });
        return;
      }

      // Construire le nouveau texte
      const newMainText = mainText ? `${mainText.trim()}\n\n${phrase}` : phrase;
      const newText = trustedPersonSection 
        ? `${newMainText.trim()}\n\nPERSONNE DE CONFIANCE${trustedPersonSection}`
        : newMainText;

      // Utiliser upsert avec précision sur la colonne de conflit
      const { error: upsertError } = await supabase
        .from('questionnaire_synthesis')
        .upsert({
          user_id: session.user.id,
          free_text: newText
        }, {
          onConflict: 'user_id'
        });

      if (upsertError) {
        throw upsertError;
      }

      toast({
        title: "Succès",
        description: "La phrase a été ajoutée à votre synthèse",
      });
    } catch (error) {
      console.error("Erreur lors de l'ajout de la phrase:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la phrase à votre synthèse",
        variant: "destructive",
      });
    }
  };

  const handleRemoveFromSynthesis = async (phrase: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour modifier votre synthèse",
          variant: "destructive",
        });
        return;
      }

      // Récupérer la synthèse existante
      const { data: existingSynthesis } = await supabase
        .from('questionnaire_synthesis')
        .select('free_text')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (!existingSynthesis?.free_text) {
        toast({
          title: "Information",
          description: "Cette phrase n'est pas présente dans votre synthèse",
        });
        return;
      }

      // Séparer le texte en sections
      const sections = existingSynthesis.free_text.split("PERSONNE DE CONFIANCE");
      const mainText = sections[0] || '';
      const trustedPersonSection = sections.length > 1 ? sections[1] : '';

      // Retirer la phrase de la section principale uniquement
      const updatedMainText = mainText
        .replace(phrase, '')
        .replace(/\n\n\n/g, '\n\n')
        .trim();

      // Reconstruire le texte complet
      const updatedText = trustedPersonSection 
        ? `${updatedMainText}\n\nPERSONNE DE CONFIANCE${trustedPersonSection}`
        : updatedMainText;

      // Mettre à jour la synthèse
      const { error } = await supabase
        .from('questionnaire_synthesis')
        .upsert({
          user_id: session.user.id,
          free_text: updatedText
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;

      toast({
        title: "Succès",
        description: "La phrase a été retirée de votre synthèse",
      });
    } catch (error) {
      console.error("Erreur lors de la suppression de la phrase:", error);
      toast({
        title: "Erreur",
        description: "Impossible de retirer la phrase de votre synthèse",
        variant: "destructive",
      });
    }
  };

  const handleConfirm = async () => {
    if (confirmDialog.type === 'add') {
      await handleAddToSynthesis(confirmDialog.phrase);
    } else {
      await handleRemoveFromSynthesis(confirmDialog.phrase);
    }
    setConfirmDialog({ isOpen: false, type: 'add', phrase: '' });
  };

  if (showPhrases) {
    return (
      <div className="space-y-6">
        <Button 
          onClick={() => setShowPhrases(false)} 
          variant="outline" 
          className="mb-4"
        >
          Retour
        </Button>
        <div className="space-y-4">
          {examplePhrases.map((phrase, index) => (
            <Card key={index} className="p-6">
              <div className="space-y-4">
                <p className="text-sm text-gray-600">{phrase.text}</p>
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setConfirmDialog({
                      isOpen: true,
                      type: 'add',
                      phrase: phrase.text
                    })}
                  >
                    Ajouter à ma synthèse
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setConfirmDialog({
                      isOpen: true,
                      type: 'remove',
                      phrase: phrase.text
                    })}
                  >
                    Supprimer de ma synthèse
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Dialog open={confirmDialog.isOpen} onOpenChange={(isOpen) => 
          setConfirmDialog(prev => ({ ...prev, isOpen }))
        }>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {confirmDialog.type === 'add' ? 'Ajouter à la synthèse' : 'Supprimer de la synthèse'}
              </DialogTitle>
              <DialogDescription>
                {confirmDialog.type === 'add' 
                  ? 'Voulez-vous vraiment ajouter cette phrase à votre synthèse ?'
                  : 'Voulez-vous vraiment supprimer cette phrase de votre synthèse ?'
                }
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="sm:justify-start gap-3">
              <Button
                variant="default"
                onClick={handleConfirm}
              >
                Confirmer
              </Button>
              <Button
                variant="outline"
                onClick={() => setConfirmDialog({ isOpen: false, type: 'add', phrase: '' })}
              >
                Annuler
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  if (!showTemplates) {
    return (
      <div className="space-y-6">
        <Button 
          onClick={onBack} 
          variant="outline" 
          className="mb-4"
        >
          Retour
        </Button>
        <div className="grid gap-6 md:grid-cols-2">
          <Button
            size="lg"
            className="h-auto py-4 text-left"
            onClick={() => setShowTemplates(true)}
          >
            <h3 className="text-lg font-semibold">Propositions de modèles pré-remplis</h3>
          </Button>

          <Button
            size="lg"
            className="h-auto py-4 text-left"
            onClick={() => setShowPhrases(true)}
          >
            <h3 className="text-lg font-semibold">Exemples de phrases à utiliser</h3>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button 
        onClick={() => setShowTemplates(false)} 
        variant="outline" 
        className="mb-4"
      >
        Retour
      </Button>
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-2">Plus de soins thérapeutiques</h3>
            <p className="text-sm text-gray-600">
              Exemple de directives anticipées privilégiant les soins thérapeutiques actifs.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-2">Plus de soulagement des souffrances</h3>
            <p className="text-sm text-gray-600">
              Exemple de directives anticipées privilégiant le confort et le soulagement de la douleur.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-2">Intermédiaire, Soins thérapeutiques et soulagement</h3>
            <p className="text-sm text-gray-600">
              Exemple équilibré entre les soins thérapeutiques et le soulagement des souffrances.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
