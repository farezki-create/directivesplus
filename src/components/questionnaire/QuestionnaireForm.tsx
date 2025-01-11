import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { GeneralOpinion } from "./sections/GeneralOpinion";
import { OtherDirectives } from "./sections/OtherDirectives";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

type QuestionnaireData = {
  medicalDirectives: {
    generalOpinion: {
      artificialLife: boolean;
      organDonation: boolean;
      palliativeCare: boolean;
    };
    otherDirectives: {
      resuscitation: boolean;
      artificialNutrition: boolean;
      painManagement: boolean;
    };
    lifeSupport: string;
    painRelief: string;
    letDie: string;
  };
};

export const QuestionnaireForm = () => {
  const form = useForm<QuestionnaireData>();
  const { toast } = useToast();
  const [openSection, setOpenSection] = React.useState<string | null>(null);

  const onSubmit = async (data: QuestionnaireData) => {
    try {
      console.log('Submitting form data:', data);
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Vous devez être connecté pour sauvegarder vos directives.",
        });
        return;
      }

      const { error } = await supabase
        .from('advance_directives')
        .upsert([{
          user_id: session.user.id,
          general_opinion: data.medicalDirectives.generalOpinion.artificialLife,
          other_directives: data.medicalDirectives.otherDirectives.resuscitation,
          life_support: JSON.stringify(data.medicalDirectives.lifeSupport),
          pain_relief: JSON.stringify(data.medicalDirectives.painRelief),
          let_die: JSON.stringify(data.medicalDirectives.letDie),
        }]);

      if (error) throw error;
      
      toast({
        title: "Succès",
        description: "Vos directives ont été sauvegardées.",
      });
    } catch (error) {
      console.error("Error saving form:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde.",
      });
    }
  };

  const handleSectionClick = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const sections = [
    {
      id: "general",
      title: "Mon avis d'une façon générale",
      content: <GeneralOpinion form={form} />
    },
    {
      id: "other",
      title: "Autres directives",
      content: <OtherDirectives form={form} />
    },
    {
      id: "life",
      title: "Maintien de la vie",
      content: <div className="space-y-4">{/* Life support content */}</div>
    },
    {
      id: "pain",
      title: "Allégement des souffrances",
      content: <div className="space-y-4">{/* Pain relief content */}</div>
    },
    {
      id: "die",
      title: "Privilégier le laisser mourir",
      content: <div className="space-y-4">{/* Let die content */}</div>
    }
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card className="max-w-[95vw] mx-auto">
          <CardHeader>
            <CardTitle>Directives anticipées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Vos informations personnelles sont déjà enregistrées dans votre profil. 
                Vous pouvez maintenant renseigner vos directives médicales.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mt-6">
              {sections.map((section) => (
                <Collapsible
                  key={section.id}
                  open={openSection === section.id}
                  onOpenChange={() => handleSectionClick(section.id)}
                  className="border rounded-lg p-4 transition-all duration-200 hover:border-primary/50 shadow-sm hover:shadow-md h-full"
                >
                  <CollapsibleTrigger className="w-full flex items-center justify-between font-semibold group">
                    <span className="text-lg">{section.title}</span>
                    <ChevronDown className={`h-5 w-5 transition-transform duration-300 ease-in-out text-primary ${
                      openSection === section.id ? 'transform rotate-180' : ''
                    }`} />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pt-4 transition-all duration-300">
                    <div className="border-t pt-4">
                      {section.content}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>

            <div className="flex justify-between mt-6">
              <Button type="submit" className="transition-all duration-200 hover:scale-105">
                Sauvegarder
              </Button>
              <Button type="button" variant="secondary" className="transition-all duration-200 hover:scale-105">
                Suite
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
};