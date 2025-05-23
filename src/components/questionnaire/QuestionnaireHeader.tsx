
interface QuestionnaireHeaderProps {
  title: string;
  description?: string;
}

export const QuestionnaireHeader = ({ title, description }: QuestionnaireHeaderProps) => {
  return (
    <div className="text-center mb-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">{title}</h1>
      {description && (
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">{description}</p>
      )}
    </div>
  );
};
