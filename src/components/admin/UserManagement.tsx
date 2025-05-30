
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSecureAuth } from "@/hooks/useSecureAuth";
import { Users, UserPlus, Shield, Trash } from "lucide-react";

interface User {
  id: string;
  email: string;
  created_at: string;
  roles: UserRole[];
}

type UserRole = 'admin' | 'moderator' | 'user';

const UserManagement: React.FC = () => {
  const { isAdmin } = useSecureAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('user');

  useEffect(() => {
    if (isAdmin) {
      loadUsers();
    }
  }, [isAdmin]);

  const loadUsers = async () => {
    try {
      // Get auth users (admin only)
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) {
        console.error('Error loading users:', authError);
        return;
      }

      // Get user roles
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) {
        console.error('Error loading user roles:', rolesError);
        return;
      }

      // Combine data
      const usersWithRoles = authUsers.users.map(user => ({
        id: user.id,
        email: user.email || 'No email',
        created_at: user.created_at,
        roles: userRoles?.filter(role => role.user_id === user.id).map(role => role.role as UserRole) || []
      }));

      setUsers(usersWithRoles);
    } catch (error) {
      console.error('Error in loadUsers:', error);
    } finally {
      setLoading(false);
    }
  };

  const assignRole = async () => {
    if (!selectedUser || !selectedRole) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un utilisateur et un rôle",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('user_roles')
        .insert({
          user_id: selectedUser,
          role: selectedRole
        });

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast({
            title: "Erreur",
            description: "Cet utilisateur a déjà ce rôle",
            variant: "destructive"
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Succès",
          description: "Rôle assigné avec succès"
        });
        loadUsers();
        setSelectedUser('');
      }
    } catch (error) {
      console.error('Error assigning role:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'assigner le rôle",
        variant: "destructive"
      });
    }
  };

  const removeRole = async (userId: string, role: UserRole) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', role);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Rôle supprimé avec succès"
      });
      loadUsers();
    } catch (error) {
      console.error('Error removing role:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le rôle",
        variant: "destructive"
      });
    }
  };

  const handleRoleChange = (value: string) => {
    setSelectedRole(value as UserRole);
  };

  if (!isAdmin) {
    return null;
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Role Assignment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Gestion des Rôles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Utilisateur</label>
              <Select value={selectedUser} onValueChange={setSelectedUser}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un utilisateur" />
                </SelectTrigger>
                <SelectContent>
                  {users.map(user => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Rôle</label>
              <Select value={selectedRole} onValueChange={handleRoleChange}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">Utilisateur</SelectItem>
                  <SelectItem value="moderator">Modérateur</SelectItem>
                  <SelectItem value="admin">Administrateur</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={assignRole}>
              <Shield className="w-4 h-4 mr-2" />
              Assigner
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Utilisateurs ({users.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map(user => (
              <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{user.email}</p>
                  <p className="text-sm text-gray-600">
                    Créé le {new Date(user.created_at).toLocaleDateString('fr-FR')}
                  </p>
                  <div className="flex gap-2 mt-2">
                    {user.roles.length === 0 ? (
                      <Badge variant="secondary">Aucun rôle</Badge>
                    ) : (
                      user.roles.map(role => (
                        <div key={role} className="flex items-center gap-1">
                          <Badge 
                            variant={role === 'admin' ? 'destructive' : role === 'moderator' ? 'default' : 'secondary'}
                          >
                            {role}
                          </Badge>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeRole(user.id, role)}
                            className="h-6 w-6 p-0 hover:bg-red-100"
                          >
                            <Trash className="w-3 h-3 text-red-600" />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
