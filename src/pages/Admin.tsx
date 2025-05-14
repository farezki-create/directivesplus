
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/sonner";
import { useNavigate } from "react-router-dom";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { useUsersList } from "@/hooks/useUsersList";

export default function AdminPage() {
  const { profile, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { users, isLoading, fetchUsers } = useUsersList();

  // Handle unauthorized access
  useEffect(() => {
    if (!isLoading && isAuthenticated && profile?.role !== "institution") {
      toast.error("Accès non autorisé", {
        description: "Vous n'avez pas les permissions nécessaires pour accéder à cette page.",
      });
      navigate("/");
      return;
    }
  }, [profile, isAuthenticated, isLoading, navigate]);

  // Fetch users when authenticated as institution
  useEffect(() => {
    if (isAuthenticated && profile?.role === "institution") {
      fetchUsers();
    }
  }, [isAuthenticated, profile, fetchUsers]);

  // Handle user detail view
  const handleViewUserDetails = (userId: string) => {
    console.log(`View details for user: ${userId}`);
    // You can implement navigation to user details page or modal here
  };

  // Only allow institutions to see this page
  if (!isLoading && (!isAuthenticated || profile?.role !== "institution")) {
    return null;
  }

  return (
    <AdminDashboard 
      users={users} 
      isLoading={isLoading || !profile}
      onViewUserDetails={handleViewUserDetails}
    />
  );
}
