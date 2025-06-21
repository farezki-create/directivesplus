
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
    
    // Prepare alert message for SMS
    const alertMessage = `🚨 ALERTE SYMPTÔMES CRITIQUES 🚨\n\nPatient: ${patientName}\nSymptômes critiques:\n${critical_symptoms.join('\n')}\n\nContactez immédiatement le patient ou les services d'urgence si nécessaire.\n\nDirectivesPlus - ${new Date().toLocaleString('fr-FR')}`

    const notifications = []

    // Configuration Twilio
    const TWILIO_ACCOUNT_SID = Deno.env.get('TWILIO_ACCOUNT_SID')
    const TWILIO_AUTH_TOKEN = Deno.env.get('TWILIO_AUTH_TOKEN')
    const TWILIO_PHONE_NUMBER = Deno.env.get('TWILIO_PHONE_NUMBER')

    // Send SMS notifications to each contact
    for (const contact of contacts) {
      try {
        // Send SMS if contact has phone number
        if (contact.phone_number) {
          console.log(`📱 Sending SMS to: ${contact.phone_number}`)
          
          if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
            console.log('Configuration Twilio manquante - simulation uniquement')
            console.log(`SMS Twilio simulé envoyé à ${contact.phone_number}: ${alertMessage}`)
            
            notifications.push({
              contact_id: contact.id,
              type: 'sms',
              recipient: contact.phone_number,
              status: 'simulated',
              message: 'Configuration Twilio manquante - alerte simulée'
            })
          } else {
            try {
              // Envoyer réellement via Twilio
              const auth = btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`)
              
              const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`, {
                method: 'POST',
                headers: {
                  'Authorization': `Basic ${auth}`,
                  'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                  From: TWILIO_PHONE_NUMBER,
                  To: contact.phone_number,
                  Body: alertMessage
                })
              })

              if (!response.ok) {
                const errorText = await response.text()
                throw new Error(`Twilio API error: ${response.status} - ${errorText}`)
              }

              const result = await response.json()
              console.log('SMS envoyé avec succès via Twilio:', result.sid)

              notifications.push({
                contact_id: contact.id,
                type: 'sms',
                recipient: contact.phone_number,
                status: 'sent',
                messageId: result.sid
              })
            } catch (twilioError) {
              console.error(`Erreur Twilio pour ${contact.phone_number}:`, twilioError)
              notifications.push({
                contact_id: contact.id,
                type: 'sms',
                recipient: contact.phone_number,
                status: 'failed',
                error: twilioError.message
              })
            }
          }
        }

        // Send email as fallback if no phone number
        if (!contact.phone_number && contact.email) {
          console.log(`📧 Sending fallback email to: ${contact.email}`)
          
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
            notifications.push({
              contact_id: contact.id,
              type: 'email',
              recipient: contact.email,
              status: 'failed',
              error: emailError.message
            })
          } else {
            notifications.push({
              contact_id: contact.id,
              type: 'email',
              recipient: contact.email,
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
      if (notification.status === 'sent' || notification.status === 'simulated') {
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

    const successCount = notifications.filter(n => n.status === 'sent' || n.status === 'simulated').length
    console.log(`✅ Alert processing complete. ${successCount} notifications sent successfully`)

    return new Response(
      JSON.stringify({
        success: true,
        message: `Alert sent successfully to ${successCount} contacts via SMS`,
        notifications: notifications,
        method: 'sms_priority'
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
