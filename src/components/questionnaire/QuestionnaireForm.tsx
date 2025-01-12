import React from "react";
import { Card, CardContent } from "@/components/ui/card";
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
import { QuestionnaireHeader } from "./components/QuestionnaireHeader";
import { QuestionnaireSection } from "./components/QuestionnaireSection";

type QuestionnaireData = {
  medicalDirectives: {
    generalOpinion: Record<string, boolean>;
    otherDirectives: Record<string, boolean>;
    lifeSupport: Record<string, boolean>;
    painRelief: Record<string, boolean>;
    letDie: Record<string, boolean>;
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
        .upsert({
          user_id: session.user.id,
          general_opinion: data.medicalDirectives.generalOpinion,
          other_directives: data.medicalDirectives.otherDirectives,
          life_support: JSON.stringify(data.medicalDirectives.lifeSupport),
          pain_relief: JSON.stringify(data.medicalDirectives.painRelief),
          let_die: JSON.stringify(data.medicalDirectives.letDie),
        });

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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="relative">
        <Card className={`w-full transition-all duration-300 ${
          openSection 
            ? 'fixed inset-0 z-50 rounded-none overflow-hidden' 
            : 'max-w-4xl mx-auto shadow-lg'
        }`}>
          <QuestionnaireHeader />
          
          <CardContent className={`${
            openSection 
              ? 'p-0 h-[calc(100vh-4rem)] overflow-auto bg-background' 
              : 'p-6'
          }`}>
            {!openSection && (
              <p className="text-muted-foreground mb-6">
                Vos informations personnelles sont déjà enregistrées dans votre profil. 
                Vous pouvez maintenant renseigner vos directives médicales.
              </p>
            )}

            <div className="grid gap-4">
              {sections.map((section) => (
                <QuestionnaireSection
                  key={section.id}
                  id={section.id}
                  title={section.title}
                  content={section.content}
                  isOpen={openSection === section.id}
                  onOpenChange={handleSectionClick}
                />
              ))}
            </div>

            <div className="flex justify-end mt-6">
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