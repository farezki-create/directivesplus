
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

const Rediger = () => {
  const { isAuthenticated } = useAuth();

  // Redirect to auth if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Je rédige mes directives</h1>
      <p className="mb-4">Cette page vous permet de rédiger vos directives anticipées.</p>
    </div>
  );
};

export default Rediger;
