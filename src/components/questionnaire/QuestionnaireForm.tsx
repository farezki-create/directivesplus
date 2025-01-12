import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { GeneralOpinion } from "./sections/GeneralOpinion";
import { OtherDirectives } from "./sections/OtherDirectives";
import { LifeSupport } from "./sections/LifeSupport";
import { PainRelief } from "./sections/PainRelief";
import { LetDie } from "./sections/LetDie";
import { SectionButtons } from "./components/SectionButtons";
import { SectionContent } from "./components/SectionContent";

type QuestionnaireData = {
  medicalDirectives: {
    generalOpinion: Record<string, string>;
    otherDirectives: Record<string, boolean>;
    lifeSupport: Record<string, boolean>;
    painRelief: Record<string, boolean>;
    letDie: Record<string, boolean>;
  };
};

export const QuestionnaireForm = () => {
  const form = useForm<QuestionnaireData>({
    defaultValues: {
      medicalDirectives: {
        generalOpinion: {},
        otherDirectives: {},
        lifeSupport: {},
        painRelief: {},
        letDie: {}
      }
    }
  });
  const { toast } = useToast();
  const [openSection, setOpenSection] = React.useState<string | null>(null);

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
      content: <LifeSupport form={form} />
    },
    {
      id: "pain",
      title: "Allégement des souffrances",
      content: <PainRelief form={form} />
    },
    {
      id: "die",
      title: "Privilégier le laisser mourir",
      content: <LetDie form={form} />
    }
  ];

  const handleSectionClick = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

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

      // Format the data to match the database schema
      const formattedData = {
        user_id: session.user.id,
        general_opinion: Object.values(data.medicalDirectives.generalOpinion).some(value => value === 'oui'),
        other_directives: Object.values(data.medicalDirectives.otherDirectives).some(value => value),
        life_support: JSON.stringify(data.medicalDirectives.lifeSupport),
        pain_relief: JSON.stringify(data.medicalDirectives.painRelief),
        let_die: JSON.stringify(data.medicalDirectives.letDie),
      };

      const { error } = await supabase
        .from('advance_directives')
        .upsert(formattedData);

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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="relative">
        <Card className={`transition-all duration-300 ${openSection ? 'fixed inset-0 z-50 m-0 rounded-none' : 'max-w-[95vw] mx-auto'}`}>
          <CardHeader>
            <SectionButtons 
              openSection={openSection}
              handleSectionClick={handleSectionClick}
              sections={sections}
            />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Vos informations personnelles sont déjà enregistrées dans votre profil. 
                Vous pouvez maintenant renseigner vos directives médicales.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 mt-6">
              {sections.map((section) => (
                <SectionContent
                  key={section.id}
                  section={section}
                  openSection={openSection}
                  handleSectionClick={handleSectionClick}
                />
              ))}
            </div>

            <div className="flex justify-between mt-6">
              <Button type="submit" className="transition-all duration-200 hover:scale-105">
                Sauvegarder
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
};