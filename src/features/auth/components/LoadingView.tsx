
export const LoadingView = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-directiveplus-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Vérification de l'authentification...</p>
      </div>
    </div>
  );
};
