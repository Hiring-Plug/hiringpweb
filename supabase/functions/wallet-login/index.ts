import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';
import { verifyMessage } from 'npm:viem';

const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://www.hiringplug.xyz',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const VERSION = "8.0.0";

serve(async (req) => {
  console.log(`[Entry] [v${VERSION}] Request received: ${req.method} ${req.url}`);
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return new Response(JSON.stringify({ error: 'Server configuration error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const debug_info: string[] = [`API_VERSION: ${VERSION}`];
  const log = (msg: string) => { console.log(msg); debug_info.push(msg); };

  try {
    const body = await req.json();
    const { address, signature, message, siwe, user_token, redirectTo } = body;
    const cleanAddress = address?.toLowerCase();

    log(`[Auth-Attempt] Address: ${address}, Flow: ${user_token ? 'LINKING' : 'LOGIN'}`);

    if (!address || !signature || !message) {
      throw new Error('Missing address, signature, or message');
    }

    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // 1. Verify the signature
    const isValid = await verifyMessage({
      address: address as `0x${string}`,
      message,
      signature: signature as `0x${string}`,
    });

    if (!isValid) {
      log('[Error] Invalid signature.');
      return new Response(JSON.stringify({ error: 'Invalid signature.', debug_info, version: VERSION }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // LINKING FLOW
    if (user_token) {
      log('[Linking] Verifying user token...');
      const { data: userData, error: authError } = await supabaseAdmin.auth.getUser(user_token);

      if (authError || !userData?.user) {
        log(`[Linking-Error] auth.getUser failed: ${authError?.message}`);
        return new Response(JSON.stringify({ error: 'UNAUTHORIZED_LINKING', debug_info, version: VERSION }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const userId = userData.user.id;
      log(`[Linking] Authorized User ID: ${userId}`);

      // Check if wallet registered (Case-Insensitive)
      const { data: existing, error: findError } = await supabaseAdmin
        .from('wallets')
        .select('user_id, wallet_address')
        .ilike('wallet_address', cleanAddress)
        .maybeSingle();

      if (findError) throw findError;

      if (existing) {
        log(`[Linking] Found existing record: ${existing.wallet_address} -> ${existing.user_id}`);
        if (existing.user_id === userId) {
          return new Response(JSON.stringify({ success: true, message: 'Already linked.', debug_info, version: VERSION }), { status: 200, headers: corsHeaders });
        } else {
          return new Response(JSON.stringify({ error: 'Wallet linked to another account.', debug_info, version: VERSION }), { status: 400, headers: corsHeaders });
        }
      }

      log(`[Linking] Inserting ${cleanAddress} for user ${userId}`);
      const { error: insertError } = await supabaseAdmin
        .from('wallets')
        .insert([{ user_id: userId, wallet_address: cleanAddress }]);

      if (insertError) throw insertError;

      return new Response(JSON.stringify({ success: true, message: 'Linked!', debug_info, version: VERSION }), { status: 200, headers: corsHeaders });

    } else {
      // LOGIN / SIGNUP FLOW
      log('[Login] Searching for wallet record in DB...');
      const { data: walletData, error: walletError } = await supabaseAdmin
        .from('wallets')
        .select('*')
        .ilike('wallet_address', cleanAddress)
        .maybeSingle();

      if (walletError) throw walletError;

      let targetEmail: string;
      let finalUserId: string;
      let isSignup = false;

      if (!walletData) {
        log(`[Login] NO WALLET RECORD FOUND: ${cleanAddress}. Path: NEW_SIGNUP`);
        isSignup = true;
        targetEmail = `${cleanAddress}@wallet.local`;

        // List by email instead of ID to be safe
        const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
        const existing = existingUsers?.users?.find((u: any) => u.email === targetEmail);

        if (!existing) {
          log('[Login] Creating NEW auth account.');
          const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
            email: targetEmail,
            email_confirm: true,
            user_metadata: { wallet_address: cleanAddress, role: 'talent' }
          });
          if (createError) throw createError;

          finalUserId = newUser.user.id;
          await supabaseAdmin.from('wallets').insert([{ user_id: finalUserId, wallet_address: cleanAddress }]);
          await supabaseAdmin.from('profiles').insert([{ id: finalUserId, username: address.slice(0, 8), role: 'talent', updated_at: new Date() }]);
        } else {
          finalUserId = existing.id;
          log(`[Login] Using existing dummy account: ${finalUserId}`);
        }
      } else {
        finalUserId = walletData.user_id;
        log(`[Login] FOUND WALLET in DB. Associated ID: ${finalUserId}. Path: EXISTING_LINK`);

        const { data: userAuth, error: userError } = await supabaseAdmin.auth.admin.getUserById(finalUserId);

        if (userError || !userAuth?.user) {
          log(`[Login-Error] User ${finalUserId} missing from auth.users!`);
          throw new Error('Account associated with this wallet not found.');
        }

        targetEmail = userAuth.user.email!;
        log(`[Login] Account found: ${targetEmail}`);
      }

      log(`[Login] Generating magic link for ${targetEmail}. RedirectTo: ${redirectTo || 'Default'}`);
      const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
        type: 'magiclink',
        email: targetEmail,
        options: {
          redirectTo: redirectTo || undefined
        }
      });

      if (linkError) throw linkError;

      return new Response(JSON.stringify({
        success: true,
        is_signup: isSignup,
        target_email: targetEmail,
        user_id: finalUserId,
        action_link: linkData.properties.action_link,
        debug_info,
        version: VERSION
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

  } catch (error: any) {
    log(`[Fatal Error] ${error.message}`);
    return new Response(JSON.stringify({ error: error.message, debug_info, version: VERSION }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
