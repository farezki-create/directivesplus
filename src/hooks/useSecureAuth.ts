
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
        // Use the secure admin check function
        const { data: adminCheck, error: adminError } = await supabase
          .rpc('is_current_user_admin');

        if (adminError) {
          console.error('Error checking admin status:', adminError);
          setIsAdmin(false);
          
          // Log security event for admin check failure
          await supabase.rpc('log_security_event_enhanced', {
            p_event_type: 'admin_check_failed',
            p_user_id: user.id,
            p_details: { error: adminError.message },
            p_risk_level: 'medium'
          });
        } else {
          setIsAdmin(adminCheck || false);
          
          // Log admin access if user is admin
          if (adminCheck) {
            await supabase.rpc('log_security_event_enhanced', {
              p_event_type: 'admin_access_granted',
              p_user_id: user.id,
              p_details: { 
                user_email: user.email,
                access_time: new Date().toISOString()
              },
              p_risk_level: 'low'
            });
          }
        }

        // Get user roles using secure query
        const { data: roles, error: rolesError } = await supabase
          .from('user_roles')
          .select('role, created_at')
          .eq('user_id', user.id);

        if (rolesError) {
          console.error('Error fetching user roles:', rolesError);
          setUserRoles([]);
          
          // Log security event for role fetch failure
          await supabase.rpc('log_security_event_enhanced', {
            p_event_type: 'role_fetch_failed',
            p_user_id: user.id,
            p_details: { error: rolesError.message },
            p_risk_level: 'medium'
          });
        } else {
          setUserRoles(roles || []);
        }
      } catch (error) {
        console.error('Error in loadUserRoles:', error);
        setUserRoles([]);
        setIsAdmin(false);
        
        // Log critical security event
        await supabase.rpc('log_security_event_enhanced', {
          p_event_type: 'auth_system_error',
          p_user_id: user?.id,
          p_details: { error: error.message },
          p_risk_level: 'critical'
        });
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
      await supabase.rpc('log_security_event_enhanced', {
        p_event_type: eventType,
        p_user_id: user?.id,
        p_details: details ? JSON.stringify(details) : null,
        p_risk_level: riskLevel
      });
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  };

  // Enhanced security function to check permissions
  const checkPermission = async (action: string, resource?: string) => {
    const hasPermission = isAdmin || hasRole('admin');
    
    // Log permission check
    await logSecurityEvent(
      'permission_check',
      { 
        action, 
        resource, 
        granted: hasPermission,
        user_roles: userRoles.map(r => r.role)
      },
      hasPermission ? 'low' : 'medium'
    );
    
    return hasPermission;
  };

  return {
    user,
    userRoles,
    isAdmin,
    hasRole,
    loading,
    logSecurityEvent,
    checkPermission,
    isAuthenticated
  };
};
