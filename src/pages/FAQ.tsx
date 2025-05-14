
const FAQ = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Foire aux questions</h1>
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Qu'est-ce que les directives anticipées ?</h2>
          <p>Les directives anticipées sont des instructions écrites que vous donnez à l'avance concernant les soins médicaux que vous souhaitez recevoir si vous devenez incapable de communiquer vos décisions.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Comment puis-je créer mes directives anticipées ?</h2>
          <p>Notre plateforme vous guide pas à pas dans la création de vos directives anticipées. Connectez-vous à votre compte et suivez le processus guidé.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Mes directives sont-elles juridiquement valables ?</h2>
          <p>Oui, les directives anticipées sont reconnues par la loi française et doivent être respectées par les médecins, sauf dans certaines circonstances exceptionnelles.</p>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
