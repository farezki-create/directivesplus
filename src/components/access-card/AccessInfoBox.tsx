
const AccessInfoBox = () => {
  return (
    <div className="mt-10 bg-blue-50 border border-blue-200 rounded-lg p-4">
      <h3 className="font-medium text-blue-800">Pourquoi utiliser une carte d'accès?</h3>
      <ul className="list-disc list-inside mt-2 text-blue-700 space-y-1 text-sm">
        <li>Pratique pour communiquer rapidement vos codes d'accès aux professionnels de santé</li>
        <li>Format carte bancaire, facile à conserver dans votre portefeuille</li>
        <li>Solution d'urgence pour accéder à vos directives anticipées et données médicales</li>
        <li>Personnalisable selon vos besoins (directives, données médicales ou les deux)</li>
      </ul>
    </div>
  );
};

export default AccessInfoBox;
