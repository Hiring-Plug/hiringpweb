
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../supabaseClient';
import { FaCamera, FaMapMarkerAlt, FaLink, FaTwitter, FaGithub, FaLinkedin, FaPen, FaBriefcase, FaHeart, FaGlobe, FaStar, FaCheckCircle, FaBuilding } from 'react-icons/fa';
import Button from '../../components/Button';
import profileCover from '../../assets/7.jpg'; // Default fallback
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [jobs, setJobs] = useState([]);

    // Profile State
    const [profile, setProfile] = useState({
        username: '',
        website: '',
        bio: '',
        skills: '',       // Talent
        services: '',     // Project
        role: '',         // Talent Job Title
        location: '',
        banner_url: '',
        avatar_url: '',
        custom_metrics: {}, // { tvl: '$10M', funding: 'Series A' }
        bg_color: '',     // Project Branding ?
    });

    const isProject = user?.user_metadata?.role === 'project';
    const roleLabel = isProject ? 'Project' : 'Talent';

    useEffect(() => {
        if (user) {
            fetchProfile();
            if (isProject) fetchJobs();
        }
    }, [user]);

    const fetchProfile = async () => {
        try {
            const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single();
            if (data) {
                setProfile({
                    username: data.username || user.user_metadata?.username,
                    website: data.website,
                    bio: data.bio,
                    skills: data.skills || '', // database might be array or string, let's assume string for simple input
                    services: data.services || '',
                    role: data.primary_skill || (isProject ? 'Web3 Protocol' : 'Product Designer'),
                    location: user.user_metadata?.location || 'Remote',
                    banner_url: data.banner_url || user.user_metadata?.banner_url,
                    avatar_url: data.avatar_url,
                    custom_metrics: data.custom_metrics || {},
                });
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    const fetchJobs = async () => {
        const { data } = await supabase.from('jobs').select('*').eq('project_id', user.id).eq('status', 'open');
        setJobs(data || []);
    };

    // Stats Logic
    const stats = isProject ? [
        // Only show if they exist in custom_metrics
        profile.custom_metrics?.tvl ? { label: 'TVL', value: profile.custom_metrics.tvl } : null,
        profile.custom_metrics?.funding ? { label: 'Funding', value: profile.custom_metrics.funding } : null,
        { label: 'Rating', value: '4.9/5' }, // Mock rating for now
    ].filter(Boolean) : [
        { label: 'Job Success', value: '98%' },
        { label: 'On-time', value: '100%' },
        { label: 'Rating', value: '5.0' },
    ];

    const handleEdit = () => navigate('/app/settings');

    return (
        <div className={`profile-container ${isProject ? 'project-mode' : ''}`}>
            {/* Banner */}
            <div className="profile-banner" style={{
                backgroundImage: `url(${profile.banner_url || profileCover})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}>
                <div className="banner-gradient"></div>
                <button className="cover-edit-btn" onClick={handleEdit}><FaCamera /> Edit Cover</button>
            </div>

            <div className="profile-content">
                {/* Header */}
                <div className="profile-header">
                    <div className="avatar-section">
                        <div className="profile-avatar">
                            {/* Logo / Avatar Logic */}
                            {profile.avatar_url ? (
                                <img src={profile.avatar_url} alt="Profile" className="avatar-img" />
                            ) : (
                                isProject ? <FaBuilding /> : (profile.username?.charAt(0).toUpperCase() || 'U')
                            )}
                        </div>
                    </div>

                    <div className="header-info">
                        <div className="info-main">
                            {/* Project Layout: Username below Logo, Verified Badge */}
                            <div className="name-block">
                                <h1>{profile.username || 'Anonymous'}</h1>
                                <span className="verified-badge">
                                    {isProject ? <FaCheckCircle /> : <FaStar />} {isProject ? 'VERIFIED PROJECT' : 'VERIFIED'}
                                </span>
                            </div>

                            <p className="role-line">
                                {profile.role} • {profile.location}
                                {!isProject && <span className="role-tag"> • {roleLabel}</span>}
                            </p>

                            {/* Socials */}
                            <div className="social-links">
                                <a href="#" className="social-link"><FaTwitter /></a>
                                {isProject ? <a href="#" className="social-link"><FaGlobe /></a> : <a href="#" className="social-link"><FaGithub /></a>}
                                {profile.website && (
                                    <a href={profile.website} target="_blank" rel="noreferrer" className="website-link">
                                        <FaLink /> {profile.website.replace(/^https?:\/\//, '')}
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="header-stats">
                            {stats.map((stat, i) => (
                                <div key={i} className="stat-box">
                                    <span className="stat-value">{stat.value}</span>
                                    <span className="stat-label">{stat.label}</span>
                                </div>
                            ))}
                        </div>

                        {/* Actions */}
                        <div className="header-actions">
                            {isProject ? (
                                <>
                                    <Button variant="primary" onClick={() => window.open(profile.website, '_blank')}>Visit Website</Button>
                                    <Button variant="outline" onClick={handleEdit}><FaPen /> Settings</Button>
                                </>
                            ) : (
                                <>
                                    <Button variant="primary">Hire Me</Button>
                                    <Button variant="outline" onClick={handleEdit}><FaPen /> Edit Profile</Button>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Grid Content */}
                <div className="profile-grid">
                    {/* Sidebar */}
                    <div className="grid-sidebar">
                        <div className="card info-card">
                            <h3>{isProject ? 'About Project' : 'About'}</h3>
                            <p className="bio-text">
                                {profile.bio || (isProject ? "Introduce your project to the world." : "Tell your story...")}
                            </p>

                            <div className="meta-list">
                                <div className="meta-item">
                                    <FaMapMarkerAlt />
                                    <span>{profile.location}</span>
                                </div>
                                {isProject && (
                                    <div className="meta-item">
                                        <FaGlobe />
                                        <span>Blockchain Services</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="card skills-card">
                            <h3>{isProject ? 'Services' : 'Skills'}</h3>
                            <div className="skills-tags">
                                {isProject ? (
                                    // Project Services
                                    (profile.services ? profile.services.split(',') : ['DeFi', 'NFTs', 'Smart Contracts']).map(s => <span key={s} className="skill-tag">{s.trim()}</span>)
                                ) : (
                                    // Talent Skills
                                    (profile.skills ? profile.skills.split(',') : ['React', 'Solidity', 'Design']).map(s => <span key={s} className="skill-tag">{s.trim()}</span>)
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="grid-main">
                        {!isProject ? (
                            // TALENT VIEW
                            <>
                                <div className="content-tabs">
                                    <button className="tab active">Work</button>
                                    <button className="tab">Moodboards</button>
                                    <button className="tab">Services</button>
                                </div>
                                <div className="portfolio-grid">
                                    {/* Mock Portfolio for Talent */}
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="portfolio-item">
                                            <div className="portfolio-image" style={{ backgroundColor: '#222' }}></div>
                                            <div className="portfolio-meta"><h4>Project {i}</h4> <FaHeart /> 24</div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            // PROJECT VIEW
                            <div className="project-jobs-section">
                                <div className="section-header">
                                    <h3>Active Roles</h3>
                                    {jobs.length > 0 && <span className="count-badge">{jobs.length}</span>}
                                </div>

                                {jobs.length === 0 ? (
                                    <div className="empty-jobs">
                                        <p>No active jobs posted.</p>
                                        <Button size="sm" onClick={() => navigate('/app/jobs')}>Post a Job</Button>
                                    </div>
                                ) : (
                                    <div className="jobs-list-simple">
                                        {jobs.map(job => (
                                            <div key={job.id} className="job-card-row">
                                                <div className="job-info">
                                                    <h4>{job.title}</h4>
                                                    <span className="job-type">{job.type} • {job.location}</span>
                                                </div>
                                                <Button size="sm" variant="outline" onClick={() => navigate(`/app/jobs/${job.id}`)}>Apply</Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
                .profile-container {
                    --accent: var(--primary-orange);
                    padding-bottom: 4rem;
                }

                /* Banner & Header */
                .profile-banner {
                    height: 240px;
                    background: #111;
                    position: relative;
                }
                .banner-gradient {
                    width: 100%; height: 100%;
                    background: linear-gradient(to bottom, transparent 50%, #0a0a0a);
                }
                .cover-edit-btn {
                    position: absolute; top: 20px; right: 20px;
                    background: rgba(0,0,0,0.6); border: 1px solid rgba(255,255,255,0.2);
                    color: white; padding: 6px 14px; border-radius: 6px; cursor: pointer;
                    display: flex; gap: 8px; align-items: center;
                }

                /* Header Layout */
                .profile-content { max-width: 1100px; margin: 0 auto; padding: 0 2rem; position: relative; margin-top: -80px; }
                
                .profile-header {
                    display: flex; align-items: flex-end; gap: 2rem; margin-bottom: 3rem; flex-wrap: wrap;
                }

                .profile-avatar {
                    width: 150px; height: 150px;
                    background: #111; border: 4px solid #0a0a0a;
                    border-radius: 24px; /* Squircle for Projects */
                    display: flex; align-items: center; justify-content: center;
                    font-size: 3rem; color: var(--accent);
                    overflow: hidden;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                }
                .avatar-img { width: 100%; height: 100%; object-fit: cover; }

                .header-info { flex: 1; display: flex; align-items: flex-end; justify-content: space-between; gap: 2rem; padding-bottom: 10px; flex-wrap: wrap; }
                
                .name-block { display: flex; align-items: center; gap: 10px; margin-bottom: 5px; }
                .name-block h1 { margin: 0; font-size: 2.2rem; line-height: 1; }
                
                .verified-badge {
                    background: rgba(76, 209, 55, 0.1); color: #4cd137; border: 1px solid rgba(76, 209, 55, 0.2);
                    font-size: 0.7rem; font-weight: 700; padding: 4px 8px; border-radius: 4px;
                    display: flex; align-items: center; gap: 5px;
                }
                /* Talent Badge Override */
                .profile-container:not(.project-mode) .verified-badge {
                     background: rgba(241, 196, 15, 0.1); color: #f1c40f; border-color: rgba(241, 196, 15, 0.2);
                }

                .role-line { color: #888; font-size: 1rem; margin-bottom: 1rem; }
                
                .social-links { display: flex; gap: 1rem; font-size: 1.2rem; color: #666; }
                .social-link:hover { color: var(--accent); }
                .website-link { font-size: 0.9rem; text-decoration: none; display: flex; align-items: center; gap: 6px; color: var(--accent); }

                .header-stats { display: flex; gap: 2rem; }
                .stat-box { text-align: center; }
                .stat-value { display: block; font-size: 1.3rem; font-weight: 700; color: #fff; }
                .stat-label { font-size: 0.75rem; text-transform: uppercase; color: #666; letter-spacing: 0.5px; }

                .header-actions { display: flex; gap: 10px; }

                /* Grid */
                .profile-grid { display: grid; grid-template-columns: 320px 1fr; gap: 2.5rem; }
                .card { background: #111; border: 1px solid #222; border-radius: 12px; padding: 1.5rem; margin-bottom: 1.5rem; }
                .card h3 { margin-top: 0; font-size: 1.1rem; border-bottom: 1px solid #222; padding-bottom: 10px; margin-bottom: 1rem; }
                
                .bio-text { color: #ccc; line-height: 1.6; font-size: 0.95rem; white-space: pre-wrap; }
                
                .meta-list { display: flex; flex-direction: column; gap: 10px; margin-top: 1.5rem; }
                .meta-item { display: flex; align-items: center; gap: 10px; color: #888; font-size: 0.9rem; }
                
                .skills-tags { display: flex; flex-wrap: wrap; gap: 8px; }
                .skill-tag { background: rgba(255,255,255,0.05); padding: 5px 12px; border-radius: 20px; font-size: 0.85rem; border: 1px solid #333; }

                /* Project Jobs List */
                .project-jobs-section { background: #111; border: 1px solid #222; border-radius: 12px; padding: 1.5rem; }
                .section-header { display: flex; align-items: center; gap: 10px; margin-bottom: 1.5rem; }
                .count-badge { background: #333; color: #fff; padding: 2px 8px; border-radius: 10px; font-size: 0.8rem; }
                
                .jobs-list-simple { display: flex; flex-direction: column; gap: 1rem; }
                .job-card-row {
                    display: flex; justify-content: space-between; align-items: center;
                    background: #161616; padding: 1rem; border-radius: 8px; border: 1px solid #222;
                }
                .job-info h4 { margin: 0 0 5px 0; color: #fff; }
                .job-type { color: #666; font-size: 0.85rem; }
                
                .empty-jobs { text-align: center; padding: 2rem; color: #666; }

                @media (max-width: 900px) {
                    .profile-header { flex-direction: column; align-items: center; text-align: center; }
                    .header-info { width: 100%; justify-content: center; }
                    .profile-grid { grid-template-columns: 1fr; }
                    .name-block { justify-content: center; }
                }
            `}</style>
        </div>
    );
};

export default Profile;
