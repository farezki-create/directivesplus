
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AlertContact {
  id: string;
  contact_name: string;
  contact_type: string;
  email?: string;
  phone_number?: string;
}

interface AlertRequest {
  patient_id: string;
  critical_symptoms: string[];
  contacts: AlertContact[];
  settings: {
    sms_enabled: boolean;
    sms_provider: 'twilio' | 'whatsapp';
    phone_number?: string;
    whatsapp_number?: string;
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { patient_id, critical_symptoms, contacts, settings }: AlertRequest = await req.json()
    
    console.log("🚨 Processing symptom alert for patient:", patient_id)
    console.log("📋 Critical symptoms:", critical_symptoms)
    console.log("👥 Number of contacts:", contacts.length)

    // Get patient info
    const { data: patientProfile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('first_name, last_name')
      .eq('id', patient_id)
      .single()

    if (profileError) {
      console.error("Error fetching patient profile:", profileError)
      throw new Error("Patient profile not found")
    }

    const patientName = `${patientProfile.first_name} ${patientProfile.last_name}`
    
    // Prepare alert message
    const alertMessage = `🚨 ALERTE SYMPTÔMES CRITIQUES 🚨\n\nPatient: ${patientName}\nSymptômes critiques:\n${critical_symptoms.join('\n')}\n\nContactez immédiatement le patient ou les services d'urgence si nécessaire.\n\nDirectivesPlus - ${new Date().toLocaleString('fr-FR')}`

    const notifications = []

    // Send notifications to each contact
    for (const contact of contacts) {
      try {
        // Send email if contact has email
        if (contact.email) {
          console.log(`📧 Sending email to: ${contact.email}`)
          
          const { error: emailError } = await supabaseClient.functions.invoke('send-auth-email', {
            body: {
              email: contact.email,
              type: 'symptom_alert',
              user_data: {
                patient_name: patientName,
                contact_name: contact.contact_name,
                critical_symptoms: critical_symptoms,
                alert_message: alertMessage
              }
            }
          })

          if (emailError) {
            console.error(`Email error for ${contact.email}:`, emailError)
          } else {
            notifications.push({
              contact_id: contact.id,
              type: 'email',
              recipient: contact.email,
              status: 'sent'
            })
          }
        }

        // Send SMS if contact has phone and SMS is enabled
        if (contact.phone_number && settings.sms_enabled) {
          console.log(`📱 Sending SMS to: ${contact.phone_number}`)
          
          const { error: smsError } = await supabaseClient.functions.invoke('send-test-alert', {
            body: {
              sms_provider: settings.sms_provider,
              phone_number: settings.sms_provider === 'twilio' ? contact.phone_number : undefined,
              whatsapp_number: settings.sms_provider === 'whatsapp' ? contact.phone_number : undefined,
              message: alertMessage
            }
          })

          if (smsError) {
            console.error(`SMS error for ${contact.phone_number}:`, smsError)
          } else {
            notifications.push({
              contact_id: contact.id,
              type: settings.sms_provider === 'whatsapp' ? 'whatsapp' : 'sms',
              recipient: contact.phone_number,
              status: 'sent'
            })
          }
        }

      } catch (contactError) {
        console.error(`Error sending notification to contact ${contact.id}:`, contactError)
        notifications.push({
          contact_id: contact.id,
          type: 'error',
          recipient: contact.email || contact.phone_number || 'unknown',
          status: 'failed',
          error: contactError.message
        })
      }
    }

    // Log notifications in database
    for (const notification of notifications) {
      if (notification.status === 'sent') {
        await supabaseClient
          .from('alert_notifications_sent')
          .insert({
            patient_id: patient_id,
            contact_id: notification.contact_id,
            notification_type: notification.type,
            recipient_contact: notification.recipient,
            message_content: alertMessage,
            status: notification.status
          })
      }
    }

    console.log(`✅ Alert processing complete. ${notifications.filter(n => n.status === 'sent').length} notifications sent successfully`)

    return new Response(
      JSON.stringify({
        success: true,
        message: `Alert sent successfully to ${notifications.filter(n => n.status === 'sent').length} contacts`,
        notifications: notifications
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Error in send-symptom-alert function:', error)
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
