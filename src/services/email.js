
import { supabase } from '../supabaseClient';

export const sendEmailNotification = async ({ recipientUserId, subject, html, text }) => {
    try {
        const { data, error } = await supabase.functions.invoke('send-email', {
            body: { recipientUserId, subject, html, text }
        });

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Email service error:', error);
        // Don't block UI flow if email fails
        return null;
    }
};

export const EMAIL_TEMPLATES = {
    NEW_MESSAGE: (senderName, preview) => ({
        subject: `New message from ${senderName}`,
        html: `
            <div style="font-family: sans-serif; color: #333;">
                <h2>You have a new message</h2>
                <p><strong>${senderName}</strong> sent you a message:</p>
                <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
                    "${preview}"
                </div>
                <a href="${window.location.origin}/app/messages" style="background: #ed5000; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reply Now</a>
            </div>
        `
    }),
    NEW_APPLICATION: (jobTitle, applicantName) => ({
        subject: `New Application for ${jobTitle}`,
        html: `
            <div style="font-family: sans-serif; color: #333;">
                <h2>New Candidate!</h2>
                <p><strong>${applicantName}</strong> has applied for <strong>${jobTitle}</strong>.</p>
                <a href="${window.location.origin}/app/applications" style="background: #ed5000; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Application</a>
            </div>
        `
    })
};
