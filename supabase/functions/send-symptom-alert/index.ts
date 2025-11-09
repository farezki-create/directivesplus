
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4'
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Input validation schema
const alertSchema = z.object({
  patient_id: z.string().uuid('Invalid patient ID format'),
  critical_symptoms: z.array(z.string().max(200, 'Symptom description too long')).max(10, 'Too many symptoms'),
  contacts: z.array(z.object({
    id: z.string().uuid('Invalid contact ID'),
    contact_name: z.string().max(100, 'Contact name too long'),
    contact_type: z.enum(['family', 'trusted_person', 'other']),
    phone_number: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format').optional(),
    email: z.string().email('Invalid email format').optional(),
  })).max(10, 'Too many contacts'),
  settings: z.object({
    sms_enabled: z.boolean(),
    sms_provider: z.enum(['twilio', 'whatsapp']),
    phone_number: z.string().optional(),
    whatsapp_number: z.string().optional(),
  }),
})

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
    // SECURITY: Validate JWT token and authenticate user
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      console.error('❌ No authorization header provided')
      throw new Error('Unauthorized: Missing authentication token')
    }

    const token = authHeader.replace('Bearer ', '')
    
    // Create client with user token for auth validation
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader }
        }
      }
    )

    // Verify user authentication
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token)
    if (authError || !user) {
      console.error('❌ Authentication failed:', authError?.message)
      throw new Error('Unauthorized: Invalid authentication token')
    }

    console.log('✅ User authenticated:', user.id)

    // Parse and validate request body
    const requestBody = await req.json()
    
    // SECURITY: Input validation
    let validatedData: z.infer<typeof alertSchema>
    try {
      validatedData = alertSchema.parse(requestBody)
    } catch (validationError) {
      console.error('❌ Input validation failed:', validationError)
      if (validationError instanceof z.ZodError) {
        throw new Error(`Invalid input: ${validationError.errors.map(e => e.message).join(', ')}`)
      }
      throw new Error('Invalid input format')
    }

    const { patient_id, critical_symptoms, contacts, settings } = validatedData

    // SECURITY: Verify patient ownership
    const { data: patientCheck, error: ownershipError } = await supabaseClient
      .from('profiles')
      .select('id')
      .eq('id', patient_id)
      .eq('id', user.id)
      .single()

    if (ownershipError || !patientCheck) {
      console.error('❌ Unauthorized access attempt to patient:', patient_id, 'by user:', user.id)
      // Log security event
      await supabaseClient.rpc('log_security_event', {
        p_event_type: 'unauthorized_alert_attempt',
        p_user_id: user.id,
        p_details: { patient_id, attempted_by: user.id },
        p_risk_level: 'high'
      })
      throw new Error('Unauthorized: You can only send alerts for your own account')
    }

    // Create service role client for operations
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )
    
    console.log("🚨 Processing symptom alert for patient:", patient_id)
    console.log("📋 Critical symptoms:", critical_symptoms)
    console.log("👥 Number of contacts:", contacts.length)

    // Get patient info using admin client
    const { data: patientProfile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('first_name, last_name')
      .eq('id', patient_id)
      .single()

    if (profileError) {
      console.error("Error fetching patient profile:", profileError)
      throw new Error("Patient profile not found")
    }
    
    // Log successful alert initiation
    await supabaseAdmin.rpc('log_security_event', {
      p_event_type: 'symptom_alert_sent',
      p_user_id: user.id,
      p_details: { 
        patient_id, 
        symptom_count: critical_symptoms.length,
        contact_count: contacts.length 
      },
      p_risk_level: 'medium'
    }).catch(err => console.error('Failed to log security event:', err))

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

    // Log notifications in database using admin client
    for (const notification of notifications) {
      if (notification.status === 'sent' || notification.status === 'simulated') {
        await supabaseAdmin
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
