
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../supabaseClient';
import Button from '../../components/Button';
import { FaUser, FaSave, FaGlobe, FaTwitter, FaImage, FaCoins, FaRocket } from 'react-icons/fa';

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
        funding: ''
    });

    useEffect(() => {
        if (user) fetchProfile();
    }, [user]);

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
                    tvl: data.custom_metrics?.tvl || '',
                    funding: data.custom_metrics?.funding || ''
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

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
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
                custom_metrics: {
                    tvl: formData.tvl,
                    funding: formData.funding
                },
                services: formData.services,
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

                            <div className="form-group">
                                <label>Banner Image URL</label>
                                <div className="input-icon">
                                    <FaImage />
                                    <input name="banner_url" value={formData.banner_url} onChange={handleChange} placeholder="https://... (1200x400 approx)" />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>{isProject ? 'Logo URL' : 'Avatar URL'}</label>
                                <div className="input-icon">
                                    <FaImage />
                                    <input name="avatar_url" value={formData.avatar_url} onChange={handleChange} placeholder="https://..." />
                                </div>
                            </div>
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

                    <div className="form-actions">
                        <Button type="submit" variant="glow" disabled={loading} size="lg">
                            {loading ? 'Saving...' : 'Save Changes'}
                        </Button>
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
            `}</style>
        </div>
    );
};

export default Settings;
