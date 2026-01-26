
// Follow this setup guide to deploy: 
// 1. Run `supabase functions new send-email`
// 2. Overwrite the content with this file
// 3. Set secrets: `supabase secrets set RESEND_API_KEY=re_123...`
// 4. Deploy: `supabase functions deploy send-email`

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        const supabaseClient = createClient(
            Deno.env.get("SUPABASE_URL") ?? "",
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
        );

        // 1. Get the current user (sender) from the Authorization header
        const authHeader = req.headers.get('Authorization')
        if (!authHeader) throw new Error('Missing Authorization header')

        // 2. Parse payload
        const { recipientUserId, subject, html, text } = await req.json();

        if (!recipientUserId) throw new Error("Missing recipientUserId");

        // 3. Fetch Recipient Email (Securely using Admin Client)
        const { data: userData, error: userError } = await supabaseClient.auth.admin.getUserById(recipientUserId);

        if (userError || !userData.user) {
            console.error("User fetch error:", userError);
            throw new Error("Recipient not found");
        }

        const recipientEmail = userData.user.email;
        const resendApiKey = Deno.env.get("RESEND_API_KEY");

        if (!resendApiKey) {
            // Fallback for demo/dev without API key
            console.log(`[MOCK EMAIL] To: ${recipientEmail}, Subject: ${subject}`);
            return new Response(
                JSON.stringify({ success: true, message: "Mock email logged (Resend Key missing)" }),
                { headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        // 4. Send Email via Resend
        const res = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${resendApiKey}`,
            },
            body: JSON.stringify({
                from: "Hiring Plug <notifications@hiringplug.com>", // Update with your verified domain
                to: recipientEmail,
                subject: subject,
                html: html,
                text: text || "Enable HTML to view this message",
            }),
        });

        const data = await res.json();

        return new Response(JSON.stringify(data), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
});
