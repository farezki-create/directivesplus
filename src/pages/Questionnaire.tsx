import { Header } from "@/components/Header";
import { QuestionnaireForm } from "@/components/questionnaire/QuestionnaireForm";

const Questionnaire = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <QuestionnaireForm />
      </main>
    </div>
  );
};

export default Questionnaire;