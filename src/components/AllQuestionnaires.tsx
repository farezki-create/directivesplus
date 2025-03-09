
import { useState } from "react";
import { useAllQuestionnaires } from "@/hooks/useAllQuestionnaires";
import { useLanguage } from "@/hooks/useLanguage";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { QuestionCard } from "./questions/QuestionCard";
import { useQuestionOptions } from "./questions/QuestionOptions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function AllQuestionnaires() {
  const [isOpen, setIsOpen] = useState(true);
  const { t } = useLanguage();
  const { 
    generalQuestions, 
    lifeSupportQuestions, 
    advancedIllnessQuestions, 
    preferencesQuestions, 
    loading 
  } = useAllQuestionnaires(isOpen);
  
  const { 
    getQuestionOptions, 
    getLifeSupportOptions, 
    getAdvancedIllnessOptions, 
    getPreferencesOptions 
  } = useQuestionOptions();

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{t('allQuestionnaires')}</h2>
        <Button 
          variant="outline" 
          onClick={() => setIsOpen(!isOpen)}
        >
          {t('refresh')}
        </Button>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="general">{t('generalOpinion')}</TabsTrigger>
          <TabsTrigger value="lifeSupport">{t('lifeSupport')}</TabsTrigger>
          <TabsTrigger value="advancedIllness">{t('advancedIllnessTitle')}</TabsTrigger>
          <TabsTrigger value="preferences">{t('preferences')}</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('generalOpinion')}</CardTitle>
              <CardDescription>
                {generalQuestions.length} {t('questionsLoaded')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {generalQuestions.map((question) => (
                <QuestionCard
                  key={question.id}
                  question={question}
                  value={[]}
                  onValueChange={() => {}}
                  options={getQuestionOptions()}
                  multiple={true}
                />
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lifeSupport" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('lifeSupport')}</CardTitle>
              <CardDescription>
                {lifeSupportQuestions.length} {t('questionsLoaded')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {lifeSupportQuestions.map((question) => (
                <QuestionCard
                  key={question.id}
                  question={question}
                  value={[]}
                  onValueChange={() => {}}
                  options={getLifeSupportOptions()}
                  multiple={false}
                />
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advancedIllness" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('advancedIllnessTitle')}</CardTitle>
              <CardDescription>
                {advancedIllnessQuestions.length} {t('questionsLoaded')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {advancedIllnessQuestions.map((question) => (
                <QuestionCard
                  key={question.id}
                  question={question}
                  value={[]}
                  onValueChange={() => {}}
                  options={getAdvancedIllnessOptions()}
                  multiple={false}
                />
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('preferences')}</CardTitle>
              <CardDescription>
                {preferencesQuestions.length} {t('questionsLoaded')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {preferencesQuestions.map((question) => (
                <QuestionCard
                  key={question.id}
                  question={question}
                  value={[]}
                  onValueChange={() => {}}
                  options={getPreferencesOptions()}
                  multiple={false}
                />
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
