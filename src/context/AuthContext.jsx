import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check active session
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user || null);
            setLoading(false);
        };

        getSession();

        // Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user || null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signUp = async (email, password, metadata) => {
        return supabase.auth.signUp({
            email,
            password,
            options: {
                data: metadata,
            },
        });
    };

    const signIn = async (email, password) => {
        return supabase.auth.signInWithPassword({
            email,
            password,
        });
    };

    const signInWithWallet = async (address, signature, message, siwe = false) => {
        const { data, error } = await supabase.functions.invoke('wallet-login', {
            body: { address, signature, message, siwe }
        });

        if (data?.debug_info) {
            console.log(`[Wallet-Debug] API v${data.version || 'LEGACY'}`, data.debug_info);
        }

        if (error) throw error;
        
        // Version Check: If target_email is missing and it's a success, it's a legacy function
        if (data?.action_link && (!data.version || parseInt(data.version.split('.')[0]) < 8)) {
            const legacyErr = new Error(`LEGACY_FUNCTION_DETECTED: Your Edge Function is version ${data.version || 'LEGACY'}. Please run 'supabase functions deploy wallet-login' to deploy version 8.0.0+`);
            legacyErr.debug_info = data.debug_info || ["No debug info"];
            throw legacyErr;
        }

        if (data?.error) {
            const err = new Error(data.error);
            err.debug_info = data.debug_info;
            err.version = data.version;
            throw err;
        }

        if (data?.action_link) {
            console.log("[Wallet-Auth] Established target:", data.target_email, "User ID:", data.user_id, "v:", data.version);
            
            // Extract token from action_link to verify in-place
            const url = new URL(data.action_link);
            const token = url.searchParams.get('token');
            const type = url.searchParams.get('type') || 'magiclink';

            if (token) {
                console.log("[Wallet-Auth] Verifying OTP token_hash in-place...");
                const { error: verifyError } = await supabase.auth.verifyOtp({
                    token_hash: token,
                    type: type
                });
                
                if (verifyError) throw verifyError;
                console.log("[Wallet-Auth] Session established successfully.");
            } else {
                // Fallback to direct redirect if token extraction fails
                window.location.href = data.action_link;
            }
        }
        
        return { data, error: null };
    };

    const signOut = async () => {
        return supabase.auth.signOut();
    };

    const value = {
        user,
        loading,
        signUp,
        signIn,
        signInWithWallet,
        signOut,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
