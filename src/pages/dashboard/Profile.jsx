
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/Button';
import { supabase } from '../../supabaseClient';
import { FaSave, FaCamera } from 'react-icons/fa';

const Profile = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState(null);

    const [profile, setProfile] = useState({
        username: '',
        website: '',
        bio: '',
        skills: ''
    });

    useEffect(() => {
        if (user && user.user_metadata) {
            setProfile({
                username: user.user_metadata.username || '',
                website: user.user_metadata.website || '',
                bio: user.user_metadata.bio || '',
                skills: user.user_metadata.skills || ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMsg(null);

        try {
            const { error } = await supabase.auth.updateUser({
                data: profile
            });

            if (error) throw error;
            setMsg({ type: 'success', text: 'Profile updated successfully!' });
        } catch (error) {
            setMsg({ type: 'error', text: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="profile-page">
            <h1 className="page-title">My Profile</h1>
            <p className="page-subtitle">Manage your public information and skills.</p>

            <div className="profile-grid">
                {/* Avatar Section */}
                <div className="card avatar-card">
                    <div className="avatar-preview">
                        {profile.username.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <button className="change-avatar-btn">
                        <FaCamera /> Change Avatar
                    </button>
                    <p className="helper-text">Recommended: 400x400px</p>
                </div>

                {/* Details Form */}
                <div className="card form-card">
                    {msg && <div className={`alert ${msg.type}`}>{msg.text}</div>}

                    <form onSubmit={handleSave}>
                        <div className="form-group">
                            <label>Username</label>
                            <input
                                type="text"
                                name="username"
                                value={profile.username}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Bio / Headline</label>
                            <textarea
                                name="bio"
                                rows="4"
                                value={profile.bio}
                                onChange={handleChange}
                                placeholder="Tell us about yourself..."
                            ></textarea>
                        </div>

                        <div className="form-group">
                            <label>Website / Portfolio</label>
                            <input
                                type="url"
                                name="website"
                                value={profile.website}
                                onChange={handleChange}
                                placeholder="https://..."
                            />
                        </div>

                        <div className="form-group">
                            <label>Skills <span className="sub-label">(Comma separated)</span></label>
                            <input
                                type="text"
                                name="skills"
                                value={profile.skills}
                                onChange={handleChange}
                                placeholder="React, Solidity, Rust..."
                            />
                        </div>

                        <div className="form-actions">
                            <Button variant="primary" type="submit" disabled={loading}>
                                <FaSave style={{ marginRight: '8px' }} />
                                {loading ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>

            <style>{`
                .profile-page {
                    max-width: 1000px;
                    margin: 0 auto;
                }
                .page-title {
                    font-size: 1.8rem;
                    margin-bottom: 0.5rem;
                }
                .page-subtitle {
                    color: #888;
                    margin-bottom: 2rem;
                }
                
                .profile-grid {
                    display: grid;
                    grid-template-columns: 250px 1fr;
                    gap: 2rem;
                }
                
                .card {
                    background: #111;
                    border: 1px solid #222;
                    border-radius: 12px;
                    padding: 2rem;
                }

                /* Avatar Card */
                .avatar-card {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                    height: fit-content;
                }
                .avatar-preview {
                    width: 100px;
                    height: 100px;
                    border-radius: 50%;
                    background: #222;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 2.5rem;
                    font-weight: 700;
                    color: var(--primary-orange);
                    margin-bottom: 1.5rem;
                    border: 2px solid #333;
                }
                .change-avatar-btn {
                    background: #222;
                    border: 1px solid #333;
                    color: #fff;
                    padding: 0.6rem 1rem;
                    border-radius: 6px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 0.9rem;
                    margin-bottom: 1rem;
                }
                .change-avatar-btn:hover { background: #333; }
                .helper-text { font-size: 0.8rem; color: #666; }

                /* Form */
                .form-group {
                    margin-bottom: 1.5rem;
                }
                .form-group label {
                    display: block;
                    margin-bottom: 0.5rem;
                    color: #aaa;
                    font-size: 0.9rem;
                }
                .sub-label { font-size: 0.8rem; color: #666; }
                
                .form-group input, .form-group textarea {
                    width: 100%;
                    padding: 0.8rem;
                    background: #080808;
                    border: 1px solid #333;
                    border-radius: 6px;
                    color: #fff;
                    font-size: 1rem;
                    font-family: inherit;
                }
                .form-group input:focus, .form-group textarea:focus {
                    outline: none;
                    border-color: var(--primary-orange);
                }

                .form-actions {
                    display: flex;
                    justify-content: flex-end;
                    padding-top: 1rem;
                    border-top: 1px solid #222;
                }

                .alert {
                    padding: 1rem;
                    border-radius: 6px;
                    margin-bottom: 1.5rem;
                    font-size: 0.9rem;
                }
                .alert.success {
                    background: rgba(76, 209, 55, 0.1);
                    color: #4cd137;
                    border: 1px solid #4cd137;
                }
                .alert.error {
                    background: rgba(231, 76, 60, 0.1);
                    color: #e74c3c;
                    border: 1px solid #e74c3c;
                }

                @media (max-width: 800px) {
                    .profile-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    );
};

export default Profile;
