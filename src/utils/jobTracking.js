import { supabase } from '../supabaseClient';

/**
 * Tracks a referral link click on an external/third-party job.
 * Attempts to use the Supabase RPC `increment_job_clicks` first.
 * Falls back to direct table update if RPC is unavailable.
 */
export const trackJobReferralClick = async (jobId, currentClicks = 0) => {
    if (!jobId || String(jobId).startsWith('mock-')) return;
    try {
        if (!supabase) return;

        // 1. Try calling the RPC function
        const { error: rpcError } = await supabase.rpc('increment_job_clicks', { target_job_id: jobId });

        if (rpcError) {
            // 2. Direct update fallback (works when user has update privileges)
            const { error: updateError } = await supabase
                .from('jobs')
                .update({ clicks_count: (currentClicks || 0) + 1 })
                .eq('id', jobId);

            if (updateError) {
                console.warn('Job click tracking update failed (non-critical):', updateError.message);
            }
        }
    } catch (err) {
        console.warn('Exception tracking job referral click:', err);
    }
};

/**
 * Sanitizes and opens an external referral URL in a new tab safely.
 */
export const openExternalJobUrl = (url) => {
    if (!url) return;
    let targetUrl = url.trim();
    if (!/^https?:\/\//i.test(targetUrl)) {
        targetUrl = 'https://' + targetUrl;
    }
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
};
