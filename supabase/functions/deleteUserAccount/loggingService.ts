
import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

export async function logAccountDeletion(
  supabase: SupabaseClient, 
  userId: string, 
  success: boolean, 
  message: string
) {
  try {
    // Créer un log de suppression de compte
    const logData = {
      user_id: userId,
      event_type: 'account_deletion',
      success: success,
      message: message,
      timestamp: new Date().toISOString()
    };
    
    console.log('📝 [LOGGING] Account deletion log:', logData);
    
    // Utiliser une table simple pour le logging si elle existe
    // Sinon, juste logger dans la console
    await supabase.from('security_audit_logs').insert({
      event_type: 'account_deletion',
      user_id: userId,
      details: {
        success: success,
        message: message,
        operation: 'delete_user_account'
      },
      risk_level: success ? 'low' : 'high'
    }).catch(error => {
      console.warn('⚠️ [LOGGING] Failed to write to audit log, continuing:', error.message);
    });
    
  } catch (error) {
    console.warn('⚠️ [LOGGING] Logging failed but continuing operation:', error);
  }
}
