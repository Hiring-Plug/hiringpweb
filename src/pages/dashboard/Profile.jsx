
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../supabaseClient';
import { FaCamera, FaMapMarkerAlt, FaLink, FaTwitter, FaGithub, FaLinkedin, FaPen, FaBriefcase, FaHeart, FaGlobe, FaStar } from 'react-icons/fa';
import Button from '../../components/Button';
import profileCover from '../../assets/7.jpg';

const Profile = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState({
        username: '',
        website: '',
        bio: '',
        skills: '',
        role: 'Product Designer', // Mock default
        location: 'San Francisco, CA', // Mock default
    });

    // Role-based Stats
    const getStats = () => {
        const role = user?.user_metadata?.role || 'talent';
        if (role === 'project') {
            return [
                { label: 'Total Value Locked', value: '$2.4M' },
                { label: 'Fundraising', value: 'Seed A' },
                { label: 'Rating', value: '4.9/5' },
            ];
        }
        return [
            { label: 'Job Success', value: '98%' },
            { label: 'On-time', value: '100%' },
            { label: 'Rating', value: '5.0' },
        ];
    };

    const stats = getStats();

    const portfolio = [
        { id: 1, title: 'DeFi Dashboard', image: 'https://placehold.co/600x400/111/333?text=DeFi+UI', likes: 234 },
        { id: 2, title: 'NFT Marketplace', image: 'https://placehold.co/600x400/111/333?text=NFT+App', likes: 189 },
        { id: 3, title: 'Wallet Mobile App', image: 'https://placehold.co/600x400/111/333?text=Wallet+UX', likes: 542 },
    ];

    useEffect(() => {
        if (user && user.user_metadata) {
            setProfile(prev => ({
                ...prev,
                username: user.user_metadata.username || '',
                website: user.user_metadata.website || '',
                bio: user.user_metadata.bio || '',
                skills: user.user_metadata.skills || prev.skills,
            }));
        }
    }, [user]);

    const handleSave = async () => {
        setLoading(true);
        try {
            const { error } = await supabase.auth.updateUser({
                data: profile
            });
            if (error) throw error;
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating profile:', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="profile-container">
            {/* Hero Banner */}
            <div className="profile-banner" style={{
                backgroundImage: `url(${profileCover})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}>
                <div className="banner-gradient"></div>
                <button className="cover-edit-btn"><FaCamera /> Edit Cover</button>
            </div>

            <div className="profile-content">
                {/* Header Section */}
                <div className="profile-header">
                    <div className="avatar-wrapper">
                        <div className="profile-avatar">
                            {profile.username.charAt(0).toUpperCase() || 'U'}
                        </div>
                        {isEditing && <button className="avatar-edit-btn"><FaCamera /></button>}
                    </div>

                    <div className="header-info">
                        <div className="info-main">
                            <div className="name-row">
                                <h1>{profile.username || 'Anonymous User'}</h1>
                                <span className="pro-badge"><FaStar className="gold-star" /> VERIFIED</span>
                            </div>
                            <p className="role-text">{profile.role} • {profile.location} • <span className="role-tag">{user?.user_metadata?.role || 'talent'}</span></p>

                            {!isEditing && (
                                <div className="social-links">
                                    <a href="#" className="social-link"><FaGithub /></a>
                                    <a href="#" className="social-link"><FaTwitter /></a>
                                    <a href="#" className="social-link"><FaLinkedin /></a>
                                    {profile.website && (
                                        <a href={profile.website} target="_blank" rel="noreferrer" className="website-link">
                                            <FaLink /> {profile.website.replace(/^https?:\/\//, '')}
                                        </a>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="header-stats">
                            {stats.map((stat, i) => (
                                <div key={i} className="stat-box">
                                    <span className="stat-value">{stat.value}</span>
                                    <span className="stat-label">{stat.label}</span>
                                </div>
                            ))}
                        </div>

                        <div className="header-actions">
                            {isEditing ? (
                                <>
                                    <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                                    <Button variant="primary" onClick={handleSave} disabled={loading}>
                                        {loading ? 'Saving...' : 'Save Profile'}
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button variant="primary">Hire Me</Button>
                                    <Button variant="outline" onClick={() => setIsEditing(true)}>
                                        <FaPen /> Edit Profile
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Main Grid Layout */}
                <div className="profile-grid">
                    {/* Left Sidebar */}
                    <div className="grid-sidebar">
                        {/* Bio Card */}
                        <div className="card info-card">
                            <h3>About</h3>
                            {isEditing ? (
                                <textarea
                                    className="edit-bio"
                                    rows="4"
                                    value={profile.bio}
                                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                    placeholder="Tell your story..."
                                />
                            ) : (
                                <p className="bio-text">
                                    {profile.bio || "No bio yet. Introduce yourself to the community!"}
                                </p>
                            )}

                            <div className="meta-list">
                                <div className="meta-item">
                                    <FaMapMarkerAlt />
                                    <span>{profile.location}</span>
                                </div>
                                <div className="meta-item">
                                    <FaBriefcase />
                                    <span>Open to Work</span>
                                </div>
                                <div className="meta-item">
                                    <FaGlobe />
                                    <span>English, Spanish</span>
                                </div>
                            </div>
                        </div>

                        {/* Skills Card */}
                        <div className="card skills-card">
                            <h3>Skills</h3>
                            {isEditing ? (
                                <input
                                    className="edit-input"
                                    value={profile.skills}
                                    onChange={(e) => setProfile({ ...profile, skills: e.target.value })}
                                    placeholder="React, Solidity (comma separated)"
                                />
                            ) : (
                                <div className="skills-tags">
                                    {(profile.skills ? profile.skills.split(',') : ['Design', 'Product', 'Strategy']).map(skill => (
                                        <span key={skill} className="skill-tag">{skill.trim()}</span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Content */}
                    <div className="grid-main">
                        <div className="content-tabs">
                            <button className="tab active">Work</button>
                            <button className="tab">Moodboards</button>
                            <button className="tab">Services</button>
                        </div>

                        <div className="portfolio-grid">
                            {portfolio.map(item => (
                                <div key={item.id} className="portfolio-item">
                                    <div className="portfolio-image" style={{ backgroundImage: `url(${item.image})` }}>
                                        <div className="portfolio-overlay">
                                            <button className="view-btn">View Case Study</button>
                                        </div>
                                    </div>
                                    <div className="portfolio-meta">
                                        <h4>{item.title}</h4>
                                        <div className="likes">
                                            <FaHeart /> {item.likes}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {/* Empty State / Add New */}
                            <div className="portfolio-item add-new">
                                <div className="add-content">
                                    <span className="plus">+</span>
                                    <span>Upload Project</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .profile-container {
                    /* Variable Definitions locally to ensure self-contained style */
                    --bg-dark: #0a0a0a;
                    --bg-card: #111;
                    --border: #222;
                    --accent: var(--primary-orange);
                    color: #fff;
                    padding-bottom: 4rem;
                }

                .gold-star { color: #f1c40f; margin-right: 4px; }

                /* Banner */
                .profile-banner {
                    height: 220px;
                    position: relative;
                    background: #111;
                    border-radius: 0 0 0 0; /* Or rounded if wanted */
                }
                .banner-gradient {
                    width: 100%;
                    height: 100%;
                    background: radial-gradient(circle at top right, rgba(237, 80, 0, 0.15), transparent 60%),
                                linear-gradient(to bottom, #1a1a1a, #0a0a0a);
                }
                .cover-edit-btn {
                    position: absolute;
                    top: 20px;
                    right: 20px;
                    background: rgba(0,0,0,0.5);
                    border: 1px solid rgba(255,255,255,0.1);
                    color: #fff;
                    padding: 8px 16px;
                    border-radius: 6px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 0.85rem;
                    backdrop-filter: blur(5px);
                    transition: all 0.2s;
                }
                .cover-edit-btn:hover { background: rgba(0,0,0,0.7); }

                /* Header */
                .profile-content {
                    max-width: 1100px;
                    margin: 0 auto;
                    padding: 0 2rem;
                    margin-top: -60px; /* Overlap banner */
                    position: relative;
                }

                .profile-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                    margin-bottom: 3rem;
                    flex-wrap: wrap;
                    gap: 2rem;
                }

                .avatar-wrapper {
                    position: relative;
                }
                .profile-avatar {
                    width: 140px;
                    height: 140px;
                    border-radius: 30%; /* Rounded square style like reference */
                    background: #111;
                    border: 4px solid #000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 3.5rem;
                    font-weight: 700;
                    color: var(--accent);
                    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                }
                .avatar-edit-btn {
                    position: absolute;
                    bottom: 0;
                    right: -10px;
                    background: var(--accent);
                    color: white;
                    border: 4px solid #000;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .header-info {
                    flex: 1;
                    display: flex;
                    align-items: flex-end;
                    justify-content: space-between;
                    padding-bottom: 10px;
                    flex-wrap: wrap;
                    gap: 2rem;
                }

                .info-main h1 {
                    font-size: 2rem;
                    margin: 0;
                    line-height: 1.2;
                }
                .name-row {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    margin-bottom: 0.5rem;
                }
                .pro-badge {
                    background: rgba(255,255,255,0.1);
                    border: 1px solid #333;
                    color: white;
                    font-size: 0.7rem;
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                .role-tag {
                    color: var(--primary-orange);
                    text-transform: capitalize;
                    font-weight: 600;
                }
                .role-text {
                    font-size: 1rem;
                    color: #888;
                    margin-bottom: 1rem;
                }

                .social-links {
                    display: flex;
                    gap: 1rem;
                }
                .social-link {
                    color: #aaa;
                    font-size: 1.2rem;
                    transition: color 0.2s;
                }
                .social-link:hover { color: white; }
                .website-link {
                    color: var(--accent);
                    text-decoration: none;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 0.9rem;
                }

                .header-stats {
                    display: flex;
                    gap: 2rem;
                }
                .stat-box {
                    text-align: center;
                }
                .stat-value {
                    display: block;
                    font-size: 1.4rem;
                    font-weight: 700;
                    color: #fff;
                }
                .stat-label {
                    font-size: 0.8rem;
                    color: #666;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .header-actions {
                    display: flex;
                    gap: 1rem;
                }

                /* Grid Layout */
                .profile-grid {
                    display: grid;
                    grid-template-columns: 320px 1fr;
                    gap: 2.5rem;
                }

                .card {
                    background: var(--bg-card);
                    border: 1px solid var(--border);
                    border-radius: 16px;
                    padding: 1.5rem;
                    margin-bottom: 1.5rem;
                }
                .card h3 {
                    font-size: 1.1rem;
                    margin-bottom: 1rem;
                    padding-bottom: 0.8rem;
                    border-bottom: 1px solid var(--border);
                }

                .bio-text {
                    color: #ccc;
                    line-height: 1.6;
                    font-size: 0.95rem;
                    margin-bottom: 1.5rem;
                }

                .meta-list {
                    display: flex;
                    flex-direction: column;
                    gap: 0.8rem;
                }
                .meta-item {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    color: #888;
                    font-size: 0.9rem;
                }
                .meta-item svg { color: #555; }

                .skills-tags {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.5rem;
                }
                .skill-tag {
                    background: rgba(255,255,255,0.05);
                    border: 1px solid #333;
                    padding: 6px 12px;
                    border-radius: 50px;
                    font-size: 0.85rem;
                    color: #ddd;
                }

                /* Main Content Tabs */
                .content-tabs {
                    display: flex;
                    gap: 2rem;
                    margin-bottom: 2rem;
                    border-bottom: 1px solid var(--border);
                }
                .tab {
                    background: none;
                    border: none;
                    padding: 1rem 0;
                    color: #666;
                    font-size: 1rem;
                    cursor: pointer;
                    position: relative;
                }
                .tab.active {
                    color: #fff;
                    font-weight: 600;
                }
                .tab.active::after {
                    content: '';
                    position: absolute;
                    bottom: -1px;
                    left: 0;
                    width: 100%;
                    height: 2px;
                    background: var(--accent);
                }

                /* Portfolio Grid */
                .portfolio-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                    gap: 1.5rem;
                }

                .portfolio-item {
                    background: var(--bg-card);
                    border: 1px solid var(--border);
                    border-radius: 16px;
                    overflow: hidden;
                    transition: transform 0.2s, box-shadow 0.2s;
                }
                .portfolio-item:hover {
                    border-color: #333;
                    transform: translateY(-4px);
                    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                }

                .portfolio-image {
                    height: 180px;
                    background-size: cover;
                    background-position: center;
                    position: relative;
                }
                .portfolio-overlay {
                    position: absolute;
                    inset: 0;
                    background: rgba(0,0,0,0.6);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 0;
                    transition: opacity 0.2s;
                }
                .portfolio-item:hover .portfolio-overlay { opacity: 1; }
                
                .view-btn {
                    background: white;
                    color: black;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 20px;
                    font-weight: 600;
                    cursor: pointer;
                    transform: translateY(10px);
                    transition: transform 0.2s;
                }
                .portfolio-item:hover .view-btn { transform: translateY(0); }

                .portfolio-meta {
                    padding: 1rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .portfolio-meta h4 {
                    margin: 0;
                    font-size: 1rem;
                }
                .likes {
                    font-size: 0.8rem;
                    color: #666;
                    display: flex;
                    align-items: center;
                    gap: 4px;
                }

                .add-new {
                    border: 1px dashed #333;
                    background: transparent;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    min-height: 236px; /* Match approx height of others */
                    color: #555;
                    transition: all 0.2s;
                }
                .add-new:hover {
                    border-color: var(--accent);
                    color: var(--accent);
                    background: rgba(237, 80, 0, 0.05);
                }
                .add-content {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 10px;
                }
                .plus { font-size: 2rem; font-weight: 300; }

                /* Inputs for edit mode */
                .edit-bio, .edit-input {
                    background: #000;
                    border: 1px solid #333;
                    color: #fff;
                    width: 100%;
                    padding: 10px;
                    border-radius: 8px;
                    font-family: inherit;
                }
                .edit-bio:focus, .edit-input:focus {
                    outline: none;
                    border-color: var(--accent);
                }

                @media (max-width: 900px) {
                    .profile-header {
                        justify-content: center;
                        text-align: center;
                    }
                    .header-info {
                        justify-content: center;
                    }
                    .info-main {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                    }
                    .profile-grid {
                        grid-template-columns: 1fr;
                    }
                    .grid-sidebar {
                        order: 2; /* Move below main content on mobile if desired, or keep top */
                    }
                }
            `}</style>
        </div >
    );
};

// Simple Bolt icon component for the PRO badge
const FaBoltIcon = () => (
    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 320 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
        <path d="M296 160H180.6l42.6-129.8C227.2 15 215.7 0 200 0H56C44 0 33.8 8.9 32.2 20.8l-32 240C-1.7 275.2 9.5 288 24 288h115.4L96.8 417.8C92.8 432.8 104.3 448 120 448h144c12 0 22.2-8.9 23.8-20.8l32-240c1.9-14.3-9.3-27.2-23.8-27.2z"></path>
    </svg>
);

export default Profile;
