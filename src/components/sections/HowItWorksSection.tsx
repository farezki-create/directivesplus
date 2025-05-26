
const HowItWorksSection = () => {
  const howItWorksSteps = [
    {
      step: 1,
      title: "Créez votre compte",
      description:
        "Inscrivez-vous gratuitement et accédez à votre espace personnel sécurisé.",
    },
    {
      step: 2,
      title: "Rédigez vos directives",
      description:
        "Utilisez notre questionnaire guidé pour exprimer clairement vos volontés.",
    },
    {
      step: 3,
      title: "Partagez en sécurité",
      description:
        "Donnez accès à vos proches et professionnels avec des codes sécurisés.",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Comment ça marche ?
        </h3>
        <div className="grid md:grid-cols-3 gap-8">
          {howItWorksSteps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="w-12 h-12 bg-directiveplus-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                {step.step}
              </div>
              <h4 className="text-xl font-semibold mb-3">{step.title}</h4>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
