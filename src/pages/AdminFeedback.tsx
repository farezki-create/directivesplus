
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FeedbackAdminDashboard from "@/components/feedback/FeedbackAdminDashboard";

const AdminFeedback = () => {
  const { user } = useAuth();
  
  // Vérifier si l'utilisateur est admin
  const isAdmin = user?.email?.endsWith('@directivesplus.fr');
  
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto py-8 px-4">
        <FeedbackAdminDashboard />
      </main>
      <Footer />
    </div>
  );
};

export default AdminFeedback;
