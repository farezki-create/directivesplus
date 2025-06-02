import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Shield, Building2 } from "lucide-react";
import AppNavigation from "@/components/AppNavigation";
import { Link } from "react-router-dom";
import { UsersTable } from "./UsersTable";
import { type UserProfile } from "@/hooks/useUsersList";

type AdminDashboardProps = {
  users: UserProfile[];
  isLoading: boolean;
  onViewUserDetails?: (userId: string) => void;
};

export function AdminDashboard({ users, isLoading, onViewUserDetails }: AdminDashboardProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <AppNavigation hideEditingFeatures={true} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Administration
            </h1>
            <p className="text-gray-600">
              Panneau d'administration de DirectivesPlus
            </p>
          </div>

          {/* Navigation Admin */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Link to="/admin/institutions">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-blue-200 bg-blue-50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <Building2 className="h-8 w-8 text-blue-600" />
                    <div>
                      <h3 className="font-semibold text-blue-800">Institutions</h3>
                      <p className="text-sm text-blue-700">Gérer les abonnements et accès</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
            
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Users className="h-8 w-8 text-green-600" />
                  <div>
                    <h3 className="font-semibold text-green-800">Utilisateurs</h3>
                    <p className="text-sm text-green-700">Gérer les comptes utilisateurs</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-purple-200 bg-purple-50">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Shield className="h-8 w-8 text-purple-600" />
                  <div>
                    <h3 className="font-semibold text-purple-800">Sécurité</h3>
                    <p className="text-sm text-purple-700">Audits et logs de sécurité</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Users Table */}
          <Card>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <UsersTable users={users} onViewDetails={onViewUserDetails} />
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
