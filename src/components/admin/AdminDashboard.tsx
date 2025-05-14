
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { UsersTable, type UserProfile } from "./UsersTable";

type AdminDashboardProps = {
  users: UserProfile[];
  isLoading: boolean;
  onViewUserDetails?: (userId: string) => void;
};

export function AdminDashboard({ users, isLoading, onViewUserDetails }: AdminDashboardProps) {
  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-directiveplus-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Gestion des utilisateurs</CardTitle>
          <CardDescription>
            Vue d'ensemble de tous les utilisateurs inscrits sur la plateforme.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UsersTable users={users} onViewDetails={onViewUserDetails} />
        </CardContent>
      </Card>
    </div>
  );
}
