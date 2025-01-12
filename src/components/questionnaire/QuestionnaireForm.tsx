import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

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
        <Card className={`transition-all duration-300 ${openSection ? 'fixed inset-0 z-50 m-0 rounded-none' : 'max-w-[95vw] mx-auto'}`}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Directives anticipées</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
              className="ml-auto"
            >
              <Home className="h-5 w-5" />
            </Button>
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
                <Collapsible
                  key={section.id}
                  open={openSection === section.id}
                  onOpenChange={() => handleSectionClick(section.id)}
                  className={`transition-all duration-300 ${
                    openSection === section.id 
                      ? 'fixed inset-0 z-50 bg-white overflow-auto p-6' 
                      : 'relative border rounded-lg p-4 hover:border-primary/50 shadow-sm hover:shadow-md'
                  }`}
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
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
};