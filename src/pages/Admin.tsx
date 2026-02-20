
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/sonner";
import { useNavigate } from "react-router-dom";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { useUsersList } from "@/hooks/useUsersList";
import BackButton from '@/components/ui/back-button';

export default function AdminPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const { users, isLoading: usersLoading, fetchUsers } = useUsersList();

  // Check if user is admin based on email domain
  const isAdmin = isAuthenticated && user?.email?.endsWith('@directivesplus.fr');

  // Handle unauthorized access
  useEffect(() => {
    if (!isLoading && isAuthenticated && !isAdmin) {
      toast.error("Accès non autorisé", {
        description: "Vous n'avez pas les permissions nécessaires pour accéder à cette page.",
      });
      navigate("/");
      return;
    }
  }, [user, isAuthenticated, isLoading, isAdmin, navigate]);

  // Fetch users when authenticated as admin
  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      fetchUsers();
    }
  }, [isAuthenticated, isAdmin, fetchUsers]);

  // Handle user detail view
  const handleViewUserDetails = (userId: string) => {
    // TODO: Implement navigation to user details page or modal here
  };

  // Only allow admins to see this page
  if (!isLoading && (!isAuthenticated || !isAdmin)) {
    return null;
  }

  return (
    <div>
      <div className="container mx-auto px-4 pt-4">
        <BackButton label="Retour à l'accueil" onClick={() => window.location.href = '/'} />
      </div>
      <AdminDashboard 
        users={users} 
        isLoading={usersLoading || isLoading}
        onViewUserDetails={handleViewUserDetails}
      />
    </div>
  );
}
