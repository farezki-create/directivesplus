
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface UserRole {
  role: 'admin' | 'moderator' | 'user';
  created_at: string;
}

export const useSecureAuth = () => {
  const { user, isAuthenticated } = useAuth();
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserRoles = async () => {
      if (!isAuthenticated || !user) {
        setUserRoles([]);
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        // Check if user is admin using the new secure function
        const { data: adminCheck, error: adminError } = await supabase
          .rpc('is_current_user_admin');

        if (adminError) {
          console.error('Error checking admin status:', adminError);
          setIsAdmin(false);
        } else {
          setIsAdmin(adminCheck || false);
        }

        // Get user roles
        const { data: roles, error: rolesError } = await supabase
          .from('user_roles')
          .select('role, created_at')
          .eq('user_id', user.id);

        if (rolesError) {
          console.error('Error fetching user roles:', rolesError);
          setUserRoles([]);
        } else {
          setUserRoles(roles || []);
        }
      } catch (error) {
        console.error('Error in loadUserRoles:', error);
        setUserRoles([]);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    loadUserRoles();
  }, [isAuthenticated, user]);

  const hasRole = (role: 'admin' | 'moderator' | 'user') => {
    return userRoles.some(userRole => userRole.role === role);
  };

  const logSecurityEvent = async (
    eventType: string,
    details?: any,
    riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low'
  ) => {
    try {
      await supabase.rpc('log_security_event', {
        _event_type: eventType,
        _details: details ? JSON.stringify(details) : null,
        _risk_level: riskLevel
      });
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  };

  return {
    user,
    userRoles,
    isAdmin,
    hasRole,
    loading,
    logSecurityEvent,
    isAuthenticated
  };
};
