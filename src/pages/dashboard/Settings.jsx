
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase, supabaseUrl, supabaseAnonKey } from '../../supabaseClient';
import Button from '../../components/Button';
import { FaUser, FaSave, FaGlobe, FaTwitter, FaImage, FaCoins, FaRocket, FaUserCheck, FaUserTimes, FaUsers, FaTelegram, FaDiscord, FaLinkedin, FaWallet, FaSpinner } from 'react-icons/fa';
import { useAccount, useSignMessage, useDisconnect } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';

const Settings = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);

    const role = user?.user_metadata?.role || 'talent';
    const isProject = role === 'project';

    // Unified Form State
    const [formData, setFormData] = useState({
        username: '',
        full_name: '',
        website: '',
        bio: '',
        primary_skill: '', // Role for talent, Category for project
        location: '',
        // Project Specifics
        banner_url: '',
        avatar_url: '',
        services: '',
        tvl: '',
        funding: '',
        // Social Links
        social_links: {
            linkedin: '',
            twitter: '',
            telegram: '',
            discord: '',
            website: '' // Separate website field if needed, or sync with main website
        },
        // Talent Specifics
        skills: '', // Comma separated for editing
        experience: [] // Array of objects
    });

    const [uploading, setUploading] = useState(false);
    const [pendingConnections, setPendingConnections] = useState([]);
    const [fetchingConnections, setFetchingConnections] = useState(false);

    // Auth Data (Email / Password)
    const [authData, setAuthData] = useState({
        email: '',
        password: '',
        message: ''
    });

    // Wallet linking state
    const [userWallets, setUserWallets] = useState([]);
    const [isLinkingWallet, setIsLinkingWallet] = useState(false);
    const [linkingLoading, setLinkingLoading] = useState(false); // New loading state for UX

    // Web3 Hooks
    const { address, isConnected } = useAccount();
    const { signMessageAsync } = useSignMessage();
    const { openConnectModal } = useConnectModal();
    const { disconnect } = useDisconnect();

    useEffect(() => {
        if (user) {
            fetchProfile();
            fetchWallets();
            if (role === 'talent') {
                fetchPendingConnections();
            }
            setAuthData(prev => ({
                ...prev,
                email: user.email?.endsWith('@wallet.local') ? '' : user.email
            }));
        }
    }, [user, role]);

    const fetchWallets = async () => {
        const { data } = await supabase.from('wallets').select('*').eq('user_id', user.id);
        if (data) setUserWallets(data);
    };

    // Linking Wallet Effect
    useEffect(() => {
        console.log("Wallet Status (Settings):", { isConnected, address });
        if (isLinkingWallet && isConnected && address) {
            handleLinkWallet();
        }
    }, [isConnected, address, isLinkingWallet]);

    const handleLinkWallet = async () => {
        if (!address || !user) return;

        // "Change wallet" logic: if user already has wallets, ask to replace
        if (userWallets.length > 0) {
            const currentWallet = userWallets[0].wallet_address;
            if (currentWallet.toLowerCase() === address.toLowerCase()) {
                alert("This wallet is already linked to your account.");
                setIsLinkingWallet(false);
                return;
            }

            const confirmReplace = window.confirm(
                `You already have a wallet linked (${currentWallet.substring(0, 6)}...). \n\nDo you want to REPLACE it with your current wallet (${address.substring(0, 6)}...)?`
            );

            if (!confirmReplace) {
                setIsLinkingWallet(false);
                return;
            }

            setLinkingLoading(true);
            try {
                for (const w of userWallets) {
                    await removeWallet(w.id, true); // Silent remove
                }
            } catch (err) {
                console.error("Replacement failed:", err);
                setLinkingLoading(false);
                setIsLinkingWallet(false);
                return;
            }
        }

        try {
            setLinkingLoading(true);
            console.log("Starting wallet linking for:", address);

            const { data: { session } } = await supabase.auth.getSession();
            if (!session) throw new Error("No active session found. Please login again.");

            const domain = window.location.host;
            const message = `Sign in to Hiring Plug with your wallet\n\nDomain: ${domain}\nAddress: ${address}\nStatement: I am linking this wallet to my Hiring Plug account.\n\nNonce: ${session.user.id}\nIssued At: ${new Date().toISOString()}`;

            console.log("Requesting SIWE signature...");
            const signature = await signMessageAsync({ message });
            console.log("Signature received:", signature.substring(0, 10) + "...");

            console.log("Requesting wallet-login via fetch (Bypass Mode)...");
            const response = await fetch(`${supabaseUrl}/functions/v1/wallet-login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${supabaseAnonKey}`,
                    'apikey': supabaseAnonKey
                },
                body: JSON.stringify({
                    address,
                    signature,
                    message,
                    siwe: true,
                    user_token: session.access_token
                })
            });

            const responseData = await response.json().catch(() => ({}));
            if (!response.ok) throw new Error(responseData.message || responseData.error || `Server returned ${response.status}`);

            console.log("Wallet linked successfully result:", responseData);
            alert(responseData.message || 'Wallet linked successfully!');
            await fetchWallets();
        } catch (error) {
            console.error("Linking error:", error);
            alert(error.message || "Failed to link wallet. Please try again.");
        } finally {
            setLinkingLoading(false);
            setIsLinkingWallet(false);
        }
    };

    const startWalletLink = () => {
        if (linkingLoading) return;
        setIsLinkingWallet(true);

        if (!isConnected) {
            openConnectModal?.();
        }
    };

    const getWalletButtonText = () => {
        if (linkingLoading) return "Linking...";
        if (!isConnected) return "Connect & Link";
        
        const isLinked = userWallets.some(w => w.wallet_address.toLowerCase() === address.toLowerCase());
        if (isLinked) return "Connected";
        
        if (userWallets.length > 0) return "Replace Wallet";
        return "Link Wallet";
    };

    const removeWallet = async (walletId, silent = false) => {
        if (!silent && !confirm("Remove this wallet?")) return;
        if (!silent) setLoading(true);
        try {
            const { error } = await supabase.from('wallets').delete().eq('id', walletId);
            if (error) throw error;
            await fetchWallets();
        } catch (err) {
            if (!silent) alert('Error removing wallet: ' + err.message);
            throw err;
        } finally {
            if (!silent) setLoading(false);
        }
    };

    const fetchProfile = async () => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (data) {
                setFormData({
                    username: data.username || '',
                    full_name: data.full_name || '',
                    website: data.website || '',
                    bio: data.bio || '',
                    primary_skill: data.primary_skill || '',
                    location: user.user_metadata?.location || '',
                    banner_url: data.banner_url || '',
                    avatar_url: data.avatar_url || '',
                    services: data.services || '',
                    tvl: data.tvl || '',
                    funding: data.funding || '',
                    avatar_url: data.avatar_url || '',
                    custom_metrics: data.custom_metrics || {},
                    skills: Array.isArray(data.skills) ? data.skills.join(', ') : (data.skills || ''),
                    experience: data.experience || [],
                    social_links: data.social_links || {
                        linkedin: '',
                        twitter: '',
                        telegram: '',
                        discord: '',
                        website: ''
                    }
                });
            } else {
                // Fallback
                console.log("No profile found, using auth meta");
                setFormData(prev => ({ ...prev, username: user.user_metadata?.username || '' }));
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };
    const fetchPendingConnections = async () => {
        setFetchingConnections(true);
        try {
            // Manual join since standard relationship join is failing due to schema cache/FK issues
            const { data: followsData, error: followsError } = await supabase
                .from('follows')
                .select('id, follower_id')
                .eq('following_id', user.id)
                .eq('status', 'pending');

            if (followsError) throw followsError;

            if (followsData && followsData.length > 0) {
                const followerIds = followsData.map(f => f.follower_id);
                const { data: profilesData, error: profilesError } = await supabase
                    .from('profiles')
                    .select('id, username, avatar_url, full_name')
                    .in('id', followerIds);

                if (profilesError) {
                    console.warn("Error fetching follower profiles:", profilesError);
                    setPendingConnections(followsData.map(f => ({ ...f, profiles: null })));
                } else {
                    const profilesMap = profilesData.reduce((acc, p) => ({ ...acc, [p.id]: p }), {});
                    const combinedData = followsData.map(f => ({
                        ...f,
                        profiles: profilesMap[f.follower_id] || null
                    }));
                    setPendingConnections(combinedData);
                }
            } else {
                setPendingConnections([]);
            }
        } catch (error) {
            console.error('Error fetching pending connections:', error);
        } finally {
            setFetchingConnections(false);
        }
    };

    const handleApproveConnection = async (followId, followerId) => {
        try {
            const { error } = await supabase
                .from('follows')
                .update({ status: 'connected' })
                .eq('id', followId);

            if (error) throw error;

            // Notify follower
            await supabase.from('notifications').insert([{
                user_id: followerId,
                type: 'system',
                content: `${user.user_metadata?.username || 'Some talent'} approved your connection request!`,
                link: `/u/${user.user_metadata?.username}`
            }]);

            setPendingConnections(prev => prev.filter(c => c.id !== followId));
            alert('Connection approved!');
        } catch (error) {
            console.error('Error approving connection:', error);
        }
    };

    const handleDeclineConnection = async (followId) => {
        try {
            const { error } = await supabase
                .from('follows')
                .delete()
                .eq('id', followId);

            if (error) throw error;
            setPendingConnections(prev => prev.filter(c => c.id !== followId));
            alert('Connection declined.');
        } catch (error) {
            console.error('Error declining connection:', error);
        }
    };

    const handleAuthChange = (e) => {
        setAuthData({ ...authData, [e.target.name]: e.target.value });
    };

    const handleSaveAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setAuthData(prev => ({ ...prev, message: '' }));
        try {
            const updates = {};
            if (authData.email && authData.email !== user.email) updates.email = authData.email;
            if (authData.password) updates.password = authData.password;

            if (Object.keys(updates).length > 0) {
                const { error } = await supabase.auth.updateUser(updates, {
                    emailRedirectTo: window.location.origin + '/app/settings'
                });
                if (error) throw error;
                setAuthData(prev => ({
                    ...prev,
                    password: '',
                    message: updates.email ? 'Check your new email to confirm the change.' : 'Account credentials updated.'
                }));
            }
        } catch (err) {
            setAuthData(prev => ({ ...prev, message: 'Error: ' + err.message }));
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        if (e.target.name.startsWith('social_')) {
            const socialKey = e.target.name.replace('social_', '');
            setFormData(prev => ({
                ...prev,
                social_links: {
                    ...prev.social_links,
                    [socialKey]: e.target.value
                }
            }));
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleImageUpload = async (event, bucket, field) => {
        try {
            setUploading(true);
            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('You must select an image to upload.');
            }

            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}/${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            let { error: uploadError } = await supabase.storage
                .from(bucket)
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from(bucket)
                .getPublicUrl(filePath);

            setFormData(prev => ({ ...prev, [field]: publicUrl }));

            // Auto-save the image URL to the database immediately
            const updates = {
                id: user.id,
                [field]: publicUrl,
                updated_at: new Date(),
            };
            const { error: dbError } = await supabase.from('profiles').upsert(updates);
            if (dbError) throw dbError;

            // Update Auth Metadata if it's the avatar or banner
            // Note: Supabase Auth metadata is separate from the profiles table
            if (field === 'avatar_url' || field === 'banner_url') {
                await supabase.auth.updateUser({
                    data: { [field]: publicUrl }
                });
            }

            alert('Upload successful! Saved to profile.');
        } catch (error) {
            console.error('Upload error:', error);
            alert('Error uploading image: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    // Experience Handlers
    const handleAddExperience = () => {
        setFormData(prev => ({
            ...prev,
            experience: [...prev.experience, { title: '', company: '', duration: '', description: '' }]
        }));
    };

    const handleExperienceChange = (index, field, value) => {
        const newExp = [...formData.experience];
        newExp[index][field] = value;
        setFormData(prev => ({ ...prev, experience: newExp }));
    };

    const handleRemoveExperience = (index) => {
        const newExp = [...formData.experience];
        newExp.splice(index, 1);
        setFormData(prev => ({ ...prev, experience: newExp }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Update Auth Metadata (fast UI reflection)
            const { error: authError } = await supabase.auth.updateUser({
                data: {
                    username: formData.username,
                    full_name: formData.full_name,
                    website: formData.website,
                    bio: formData.bio,
                    location: formData.location
                }
            });
            if (authError) throw authError;

            // Prepare DB Updates
            const updates = {
                id: user.id,
                username: formData.username,
                full_name: formData.full_name,
                website: formData.website,
                bio: formData.bio,
                primary_skill: formData.primary_skill,
                banner_url: formData.banner_url,
                avatar_url: formData.avatar_url,
                // Handle JSONB metrics
                tvl: formData.tvl,
                funding: formData.funding,
                custom_metrics: {},
                social_links: formData.social_links,
                services: formData.services,
                role: role, // Ensure this is saved
                skills: isProject ? null : formData.skills.split(',').map(s => s.trim()).filter(Boolean),
                experience: isProject ? null : formData.experience,
                updated_at: new Date(),
            };

            const { error: dbError } = await supabase.from('profiles').upsert(updates);
            if (dbError) throw dbError;

            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating:', error);
            alert('Error updating profile: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="settings-page">
            <div className="settings-container">
                <div className="settings-header">
                    <h1>{isProject ? 'Organization Settings' : 'Profile Settings'}</h1>
                    <p>Manage your public identity and account details.</p>
                </div>

                <form onSubmit={handleSave} className="settings-grid">

                    {/* Public Info Card */}
                    <div className="settings-card">
                        <div className="card-header">
                            <h3>General Info</h3>
                        </div>
                        <div className="card-body">
                            <div className="form-group">
                                <label>Username / Handle</label>
                                <div className="input-icon">
                                    <FaUser />
                                    <input name="username" value={formData.username} onChange={handleChange} />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>{isProject ? 'Tagline / Industry' : 'Title / Role'}</label>
                                    <input name="primary_skill" value={formData.primary_skill} onChange={handleChange} placeholder={isProject ? "e.g. DeFi Protocol" : "e.g. Solidity Dev"} />
                                </div>
                                <div className="form-group">
                                    <label>Location</label>
                                    <input name="location" value={formData.location} onChange={handleChange} placeholder="e.g. Remote, Berlin" />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>{isProject ? 'About Project' : 'Bio'}</label>
                                <textarea name="bio" rows="4" value={formData.bio} onChange={handleChange} />
                            </div>
                        </div>
                    </div>

                    {/* Socials & Links */}
                    <div className="settings-card">
                        <div className="card-header">
                            <h3>Links & Assets</h3>
                        </div>
                        <div className="card-body">
                            <div className="form-group">
                                <label>Website</label>
                                <div className="input-icon">
                                    <FaGlobe />
                                    <input name="website" value={formData.website} onChange={handleChange} placeholder="https://..." />
                                </div>
                            </div>

                            {/* Social Links Sub-section */}
                            <div className="form-row">
                                <div className="form-group">
                                    <label>LinkedIn</label>
                                    <div className="input-icon">
                                        <FaLinkedin />
                                        <input name="social_linkedin" value={formData.social_links.linkedin} onChange={handleChange} placeholder="LinkedIn Profile URL" />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Twitter / X</label>
                                    <div className="input-icon">
                                        <FaTwitter />
                                        <input name="social_twitter" value={formData.social_links.twitter} onChange={handleChange} placeholder="Twitter / X Handle" />
                                    </div>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Telegram</label>
                                    <div className="input-icon">
                                        <FaTelegram />
                                        <input name="social_telegram" value={formData.social_links.telegram} onChange={handleChange} placeholder="Telegram Handle" />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Discord</label>
                                    <div className="input-icon">
                                        <FaDiscord />
                                        <input name="social_discord" value={formData.social_links.discord} onChange={handleChange} placeholder="Discord Invite URL" />
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Banner Image {uploading && '(Uploading...)'}</label>
                                <div className="input-icon">
                                    <FaImage />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleImageUpload(e, 'banners', 'banner_url')}
                                        disabled={uploading}
                                    />
                                </div>
                                {formData.banner_url && <small className="hint">Current: <a href={formData.banner_url} target="_blank">View Banner</a></small>}
                            </div>

                            <div className="form-group">
                                <label>{isProject ? 'Logo' : 'Avatar'} {uploading && '(Uploading...)'}</label>
                                <div className="input-icon">
                                    <FaImage />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleImageUpload(e, 'avatars', 'avatar_url')}
                                        disabled={uploading}
                                    />
                                </div>
                                {formData.avatar_url && <small className="hint">Current: <a href={formData.avatar_url} target="_blank">View Image</a></small>}
                            </div>
                        </div>
                    </div>

                    {/* Connected Wallets Card */}
                    <div className="settings-card">
                        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3>Connected Wallets</h3>
                            <Button type="button" onClick={startWalletLink} size="sm" variant="outline" disabled={linkingLoading}>
                                {linkingLoading ? <FaSpinner className="spin" style={{ marginRight: '8px' }} /> : <FaWallet style={{ marginRight: '8px' }} />}
                                {getWalletButtonText()}
                            </Button>
                        </div>
                        <div className="card-body">
                            {userWallets.length === 0 ? (
                                <p style={{ color: '#666', fontStyle: 'italic' }}>No wallets connected yet.</p>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {userWallets.map(w => (
                                        <div key={w.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#1a1a1a', padding: '12px 16px', borderRadius: '8px', border: '1px solid #333' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <FaWallet color="#aaa" />
                                                <span style={{ fontFamily: 'monospace', color: '#fff', fontSize: '0.95rem' }}>
                                                    {w.wallet_address.substring(0, 6)}...{w.wallet_address.substring(38)}
                                                </span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeWallet(w.id)}
                                                style={{ color: '#ff4444', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem', textDecoration: 'underline' }}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Role Specifics */}
                    {isProject && (
                        <div className="settings-card">
                            <div className="card-header">
                                <h3>Project Metrics</h3>
                            </div>
                            <div className="card-body">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>TVL (Total Value Locked)</label>
                                        <div className="input-icon">
                                            <FaCoins />
                                            <input name="tvl" value={formData.tvl} onChange={handleChange} placeholder="$10M" />
                                        </div>
                                        <small className="hint">Leave empty to hide.</small>
                                    </div>
                                    <div className="form-group">
                                        <label>Fundraising Round</label>
                                        <div className="input-icon">
                                            <FaRocket />
                                            <input name="funding" value={formData.funding} onChange={handleChange} placeholder="Series A" />
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Services Offered</label>
                                    <textarea name="services" rows="2" value={formData.services} onChange={handleChange} placeholder="e.g. Smart Contract Audit, Marketing, Advisory..." />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Talent Specifics: Skills & Experience */}
                    {!isProject && (
                        <>
                            <div className="settings-card">
                                <div className="card-header">
                                    <h3>Skills & Expertise</h3>
                                </div>
                                <div className="card-body">
                                    <div className="form-group">
                                        <label>Skills (Comma separated)</label>
                                        <textarea
                                            name="skills"
                                            rows="2"
                                            value={formData.skills}
                                            onChange={handleChange}
                                            placeholder="e.g. React, Solidity, UI Design, Community Management"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="settings-card">
                                <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h3>Work Experience</h3>
                                    <Button type="button" onClick={handleAddExperience} size="sm" variant="outline">+ Add</Button>
                                </div>
                                <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    {formData.experience.map((exp, index) => (
                                        <div key={index} className="experience-item" style={{ background: '#1a1a1a', padding: '1rem', borderRadius: '8px', border: '1px solid #333' }}>
                                            <div className="form-row">
                                                <div className="form-group">
                                                    <label>Job Title</label>
                                                    <input
                                                        value={exp.title}
                                                        onChange={(e) => handleExperienceChange(index, 'title', e.target.value)}
                                                        placeholder="e.g. Senior Frontend Dev"
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label>Company</label>
                                                    <input
                                                        value={exp.company}
                                                        onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                                                        placeholder="e.g. Acme DAO"
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label>Duration</label>
                                                <input
                                                    value={exp.duration}
                                                    onChange={(e) => handleExperienceChange(index, 'duration', e.target.value)}
                                                    placeholder="e.g. 2023 - Present"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Description</label>
                                                <textarea
                                                    rows="2"
                                                    value={exp.description}
                                                    onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                                                    placeholder="Briefly describe your role and achievements..."
                                                />
                                            </div>
                                            <div style={{ textAlign: 'right', marginTop: '0.5rem' }}>
                                                <button type="button" onClick={() => handleRemoveExperience(index)} style={{ color: '#ff4444', fontSize: '0.9rem', textDecoration: 'underline' }}>Remove</button>
                                            </div>
                                        </div>
                                    ))}
                                    {formData.experience.length === 0 && <p style={{ color: '#666', fontStyle: 'italic' }}>No experience added yet.</p>}
                                </div>
                            </div>
                        </>
                    )}

                    {/* Connections Section (Only for Talents) */}
                    {!isProject && (
                        <div className="settings-card">
                            <div className="card-header">
                                <h3>Pending Connect Requests</h3>
                            </div>
                            <div className="card-body">
                                {fetchingConnections ? (
                                    <p>Loading requests...</p>
                                ) : pendingConnections.length > 0 ? (
                                    <div className="connections-list">
                                        {pendingConnections.map(conn => (
                                            <div key={conn.id} className="connection-item">
                                                <div className="connection-user">
                                                    <div className="avatar-mini">
                                                        {conn.profiles?.avatar_url ? (
                                                            <img src={conn.profiles.avatar_url} alt="" />
                                                        ) : (
                                                            <FaUser />
                                                        )}
                                                    </div>
                                                    <div className="user-info">
                                                        <p className="username">{conn.profiles?.username}</p>
                                                        <p className="fullname">{conn.profiles?.full_name}</p>
                                                    </div>
                                                </div>
                                                <div className="connection-actions">
                                                    <Button
                                                        type="button"
                                                        variant="primary"
                                                        size="sm"
                                                        onClick={() => handleApproveConnection(conn.id, conn.follower_id)}
                                                    >
                                                        <FaUserCheck /> Approve
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleDeclineConnection(conn.id)}
                                                    >
                                                        <FaUserTimes /> Decline
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="empty-state">No pending requests.</p>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="form-actions">
                        <Button type="submit" variant="glow" disabled={loading} size="lg">
                            {loading ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>

                </form>

                {/* Account Security Card - Separate Form */}
                <form onSubmit={handleSaveAuth} className="settings-card" style={{ marginTop: '2rem' }}>
                    <div className="card-header">
                        <h3>Account & Security</h3>
                    </div>
                    <div className="card-body">
                        <p style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '1rem' }}>
                            Add an email and password to secure your account, especially if you signed up with a Web3 wallet.
                        </p>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={authData.email}
                                    onChange={handleAuthChange}
                                    placeholder="you@example.com"
                                />
                            </div>
                            <div className="form-group">
                                <label>New Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={authData.password}
                                    onChange={handleAuthChange}
                                    placeholder="Leave blank to keep unchanged"
                                    minLength="6"
                                />
                            </div>
                        </div>

                        {authData.message && (
                            <div style={{ marginBottom: '1rem', padding: '10px', borderRadius: '8px', background: authData.message.startsWith('Error') ? 'rgba(231, 76, 60, 0.1)' : 'rgba(74, 222, 128, 0.1)', color: authData.message.startsWith('Error') ? '#e74c3c' : '#4ade80', fontSize: '0.9rem' }}>
                                {authData.message}
                            </div>
                        )}

                        <div className="form-actions">
                            <Button type="submit" variant="outline" disabled={loading}>
                                {loading ? 'Updating...' : 'Update Credentials'}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>

            <style>{`
                .settings-page { max-width: 900px; margin: 0 auto; padding-bottom: 4rem; }
                .settings-header { margin-bottom: 2rem; }
                .settings-header h1 { font-size: 2rem; margin: 0 0 0.5rem 0; }
                .settings-header p { color: #888; }

                .settings-grid { display: flex; flex-direction: column; gap: 2rem; }

                .settings-card {
                    background: #111;
                    border: 1px solid #222;
                    border-radius: 12px;
                    overflow: hidden;
                }
                .card-header { padding: 1rem 1.5rem; border-bottom: 1px solid #222; background: #161616; }
                .card-header h3 { margin: 0; font-size: 1.1rem; }
                .card-body { padding: 1.5rem; }

                .form-group { margin-bottom: 1.5rem; }
                .form-group label { display: block; margin-bottom: 0.5rem; color: #ccc; font-size: 0.9rem; font-weight: 500; }
                .form-row { display: flex; gap: 1.5rem; }
                .form-row .form-group { flex: 1; }

                input, textarea {
                    width: 100%; background: #0a0a0a; border: 1px solid #333; padding: 12px; border-radius: 8px; color: white; transition: border-color 0.2s;
                }
                input:focus, textarea:focus { outline: none; border-color: var(--primary-orange); }

                .input-icon { position: relative; }
                .input-icon svg { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #666; }
                .input-icon input { padding-left: 42px; }

                .hint { display: block; margin-top: 5px; color: #666; font-size: 0.8rem; }
                .form-actions { display: flex; justify-content: flex-end; }

                @media(max-width: 600px) { .form-row { flex-direction: column; gap: 0; } }

                /* Connections Styles */
                .connections-list { display: flex; flex-direction: column; gap: 1rem; }
                .connection-item { 
                    display: flex; justify-content: space-between; align-items: center; 
                    background: #1a1a1a; padding: 1rem; border-radius: 8px; border: 1px solid #333;
                }
                .connection-user { display: flex; align-items: center; gap: 12px; }
                .avatar-mini { 
                    width: 32px; height: 32px; border-radius: 50%; overflow: hidden; background: #222;
                    display: flex; align-items: center; justify-content: center; font-size: 0.8rem;
                }
                .avatar-mini img { width: 100%; height: 100%; object-fit: cover; }
                .user-info .username { font-weight: 600; font-size: 0.95rem; margin: 0; }
                .user-info .fullname { font-size: 0.8rem; color: #666; margin: 0; }
                .connection-actions { display: flex; gap: 8px; }
                .empty-state { color: #666; font-style: italic; }
            `}</style>
        </div>
    );
};

export default Settings;
