
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../supabaseClient';
import { FaCamera, FaMapMarkerAlt, FaLink, FaTwitter, FaGithub, FaLinkedin, FaPen, FaBriefcase, FaHeart, FaGlobe, FaStar, FaCheckCircle, FaBuilding, FaDiscord } from 'react-icons/fa';
import Button from '../../components/Button';
import profileCover from '../../assets/7.jpg'; // Default fallback
import { useNavigate } from 'react-router-dom';
import Skeleton from '../../components/Skeleton';

const Profile = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
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
        social_links: {},
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
                    bio: data.bio,
                    skills: Array.isArray(data.skills) ? data.skills : (data.skills ? data.skills.split(',') : []),
                    services: data.services || '',
                    role: data.primary_skill || (isProject ? 'Web3 Protocol' : 'Product Designer'),
                    location: user.user_metadata?.location || 'Remote',
                    banner_url: data.banner_url || user.user_metadata?.banner_url,
                    avatar_url: data.avatar_url,
                    experience: data.experience || [],
                    custom_metrics: data.custom_metrics || {},
                    tvl: data.tvl,
                    funding: data.funding,
                    social_links: data.social_links || {},
                });
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            if (!isProject) setLoading(false);
        }
    };

    const fetchJobs = async () => {
        try {
            const { data } = await supabase.from('jobs').select('*').eq('project_id', user.id).eq('status', 'open');
            setJobs(data || []);
        } finally {
            setLoading(false);
        }
    };

    // Stats Logic
    const stats = isProject ? [
        profile.tvl ? { label: 'TVL', value: profile.tvl } : null,
        profile.funding ? { label: 'Funding', value: profile.funding } : null,
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
            </div>

            <div className="profile-content">
                {/* Header */}
                <div className="profile-header">
                    <div className="profile-header-top">
                        <div className="profile-avatar">
                            {loading ? (
                                <Skeleton width="100%" height="100%" circle />
                            ) : profile.avatar_url ? (
                                <img src={profile.avatar_url} alt="Profile" className="avatar-img" />
                            ) : (
                                isProject ? <FaBuilding /> : (profile.username?.charAt(0).toUpperCase() || 'U')
                            )}
                        </div>
                        <div className="header-actions">
                            {loading ? (
                                <>
                                    <Skeleton width="100px" height="36px" borderRadius="99px" />
                                    <Skeleton width="100px" height="36px" borderRadius="99px" />
                                </>
                            ) : isProject ? (
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

                    <div className="header-info">
                        <div className="name-block">
                            {loading ? (
                                <Skeleton width="200px" height="2rem" />
                            ) : (
                                <>
                                    <h1>{profile.username || 'Anonymous'}</h1>
                                    <span className="verified-badge">
                                        {isProject ? <FaCheckCircle /> : <FaStar />} {isProject ? 'VERIFIED PROJECT' : 'VERIFIED'}
                                    </span>
                                </>
                            )}
                        </div>

                        <p className="role-line">
                            {loading ? (
                                <Skeleton width="150px" height="1rem" />
                            ) : (
                                <>
                                    {profile.role} • {profile.location}
                                    {!isProject && <span className="role-tag"> • {roleLabel}</span>}
                                </>
                            )}
                        </p>

                        <div className="social-links">
                            {loading ? (
                                [1, 2, 3, 4].map(i => <Skeleton key={i} width="30px" height="30px" circle />)
                            ) : (
                                <>
                                    {profile.social_links?.twitter && (
                                        <a href={profile.social_links.twitter} target="_blank" rel="noreferrer" className="social-link"><FaTwitter /></a>
                                    )}
                                    {profile.social_links?.linkedin && (
                                        <a href={profile.social_links.linkedin} target="_blank" rel="noreferrer" className="social-link"><FaLinkedin /></a>
                                    )}
                                    {profile.social_links?.telegram && (
                                        <a href={profile.social_links.telegram} target="_blank" rel="noreferrer" className="social-link"><FaGlobe /></a>
                                    )}
                                    {profile.social_links?.discord && (
                                        <a href={profile.social_links.discord} target="_blank" rel="noreferrer" className="social-link"><FaDiscord /></a>
                                    )}
                                    {!isProject && !profile.social_links?.linkedin && <a href="#" className="social-link"><FaLinkedin /></a>}
                                    {profile.website && (
                                        <a href={profile.website} target="_blank" rel="noreferrer" className="website-link">
                                            <FaLink /> {profile.website.replace(/^https?:\/\//, '')}
                                        </a>
                                    )}
                                </>
                            )}
                        </div>

                        <div className="header-stats">
                            {loading ? (
                                [1, 2, 3].map(i => (
                                    <div key={i} className="stat-box">
                                        <Skeleton width="40px" height="1.5rem" style={{ marginBottom: '4px' }} />
                                        <Skeleton width="100%" height="0.6rem" />
                                    </div>
                                ))
                            ) : (
                                stats.map((stat, i) => (
                                    <div key={i} className="stat-box">
                                        <span className="stat-value">{stat.value}</span>
                                        <span className="stat-label">{stat.label}</span>
                                    </div>
                                ))
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
                            {loading ? (
                                <>
                                    <Skeleton width="100%" height="0.8rem" style={{ marginBottom: '0.5rem' }} />
                                    <Skeleton width="90%" height="0.8rem" style={{ marginBottom: '0.5rem' }} />
                                    <Skeleton width="80%" height="0.8rem" style={{ marginBottom: '1rem' }} />
                                    <div className="meta-list" style={{ marginTop: '1rem' }}>
                                        <Skeleton width="60%" height="0.9rem" />
                                        <Skeleton width="50%" height="0.9rem" />
                                    </div>
                                </>
                            ) : (
                                <>
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
                                </>
                            )}
                        </div>

                        <div className="card skills-card">
                            <h3>{isProject ? 'Services' : 'Skills'}</h3>
                            <div className="skills-tags">
                                {loading ? (
                                    [1, 2, 3, 4, 5].map(i => <Skeleton key={i} width="60px" height="1.5rem" borderRadius="20px" />)
                                ) : isProject ? (
                                    // Project Services
                                    (profile.services ? profile.services.split(',') : ['DeFi', 'NFTs', 'Smart Contracts']).map(s => <span key={s} className="skill-tag">{s.trim()}</span>)
                                ) : (
                                    // Talent Skills
                                    (profile.skills.length > 0 ? profile.skills : ['React', 'Solidity', 'Design']).map((s, i) => <span key={i} className="skill-tag">{typeof s === 'string' ? s.trim() : s}</span>)
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="grid-main">
                        {!isProject ? (
                            // TALENT VIEW
                            <>
                                {/* Experience Section */}
                                <div className="card experience-section" style={{ marginBottom: '2rem' }}>
                                    <h3>Experience</h3>
                                    {loading ? (
                                        [1, 2].map(i => (
                                            <div key={i} style={{ marginBottom: '1.5rem', paddingLeft: '1rem', borderLeft: '2px solid #222' }}>
                                                <Skeleton width="40%" height="1.1rem" style={{ marginBottom: '0.4rem' }} />
                                                <Skeleton width="30%" height="0.8rem" style={{ marginBottom: '0.8rem' }} />
                                                <Skeleton width="100%" height="0.8rem" style={{ marginBottom: '0.3rem' }} />
                                                <Skeleton width="90%" height="0.8rem" />
                                            </div>
                                        ))
                                    ) : profile.experience && profile.experience.length > 0 ? (
                                        <div className="experience-list">
                                            {profile.experience.map((exp, i) => (
                                                <div key={i} className="experience-item-display" style={{ marginBottom: '1.5rem', borderLeft: '2px solid #333', paddingLeft: '1rem' }}>
                                                    <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem' }}>{exp.title}</h4>
                                                    <div style={{ color: '#ED5000', fontSize: '0.9rem', marginBottom: '0.25rem' }}>{exp.company} • <span style={{ color: '#888' }}>{exp.duration}</span></div>
                                                    <p style={{ color: '#ccc', fontSize: '0.95rem' }}>{exp.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p style={{ color: '#666', fontStyle: 'italic' }}>No experience added yet.</p>
                                    )}
                                </div>

                                {/* Certifications / Take Test */}
                                <div className="card certification-card">
                                    <div className="certification-content">
                                        <h3><FaCheckCircle color="#ED5000" /> Verified Skills</h3>
                                        <p>Take a skill assessment to earn a badge and boost your credibility.</p>
                                    </div>
                                    <Button variant="glow" onClick={() => alert('Skill Verification Coming Soon!')}>Take Test</Button>
                                </div>

                                <div className="content-tabs">
                                    <button className="tab active">Portfolio</button>
                                    <button className="tab">Services</button>
                                </div>
                                <div className="portfolio-grid">
                                    {loading ? (
                                        [1, 2].map(i => (
                                            <div key={i} className="card" style={{ height: '150px' }}>
                                                <Skeleton width="100%" height="100%" />
                                            </div>
                                        ))
                                    ) : (
                                        /* Empty State for Portfolio */
                                        <div className="empty-portfolio" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: '#666', border: '1px dashed #333', borderRadius: '12px' }}>
                                            <p>No projects added to portfolio yet.</p>
                                            <Button size="sm" variant="outline">Add Project</Button>
                                        </div>
                                    )}
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
                    height: 200px;
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
                .profile-content { max-width: 1100px; margin: 0 auto; padding: 0 1.5rem; position: relative; }
                
                .profile-header {
                    margin-bottom: 2rem;
                }

                .profile-header-top {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                    margin-bottom: 1rem;
                }

                .profile-avatar {
                    width: 140px; height: 140px;
                    background: #000; border: 4px solid #000;
                    border-radius: 50%;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 3rem; color: var(--accent);
                    overflow: hidden;
                    box-shadow: 0 0 0 1px #333; /* Subtle outer ring like X */
                    background-color: #000;
                    z-index: 2;
                    margin-top: -70px; /* Overlap halfway */
                }
                .project-mode .profile-avatar { border-radius: 20%; }
                .avatar-img { width: 100%; height: 100%; object-fit: cover; }

                .header-actions { 
                    display: flex; 
                    gap: 12px; 
                    margin-bottom: 20px; 
                }
                .header-actions button {
                    border-radius: 999px !important; /* Force pill shape */
                    font-weight: 700;
                    padding: 8px 20px;
                    font-size: 0.95rem;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                /* Targeting variants if they use classes */
                .header-actions .primary, .header-actions button[class*="primary"] {
                    background: var(--accent) !important;
                    color: #000 !important;
                    border: none !important;
                }
                .header-actions .outline, .header-actions button[class*="outline"] {
                    background: transparent !important;
                    border: 1px solid #333 !important;
                    color: #fff !important;
                }
                .header-actions button:hover {
                    opacity: 0.9;
                    transform: scale(1.02);
                }

                .header-info { display: flex; flex-direction: column; gap: 0.5rem; }
                
                .name-block { display: flex; align-items: center; gap: 10px; }
                .name-block h1 { margin: 0; font-size: 1.8rem; font-weight: 800; letter-spacing: -0.02em; color: #fff; }
                
                .verified-badge {
                    background: rgba(237, 80, 0, 0.1); color: var(--accent); border: 1px solid rgba(237, 80, 0, 0.2);
                    font-size: 0.65rem; font-weight: 700; padding: 2px 8px; border-radius: 4px;
                    display: flex; align-items: center; gap: 5px;
                }
                .profile-container:not(.project-mode) .verified-badge {
                     background: rgba(241, 196, 15, 0.1); color: #f1c40f; border-color: rgba(241, 196, 15, 0.2);
                }

                .role-line { color: #888; font-size: 0.9rem; margin: 0; font-weight: 500; }
                
                .social-links { display: flex; flex-wrap: wrap; gap: 1.2rem; font-size: 1rem; color: #666; margin: 0.5rem 0; }
                .social-link { display: flex; align-items: center; gap: 6px; text-decoration: none; color: #666; transition: color 0.2s; }
                .social-link:hover { color: #fff; }
                .website-link { text-decoration: none; display: flex; align-items: center; gap: 6px; color: var(--accent); font-weight: 500; }

                .header-stats { display: flex; gap: 1.5rem; margin-top: 0.5rem; }
                .stat-box { display: flex; align-items: center; gap: 6px; }
                .stat-value { font-size: 1rem; font-weight: 700; color: #fff; }
                .stat-label { font-size: 0.9rem; color: #666; }

                /* Grid Layout: About/Skills Left, Experience/Projects Right */
                .profile-grid { display: grid; grid-template-columns: 340px 1fr; gap: 2rem; margin-top: 2rem; }
                .grid-sidebar { display: flex; flex-direction: column; gap: 1.5rem; }
                .grid-main { display: flex; flex-direction: column; gap: 1.5rem; }

                .card { background: #0a0a0a; border: 1px solid #1a1a1a; border-radius: 12px; padding: 1.5rem; transition: border-color 0.2s; }
                .card:hover { border-color: #222; }
                .card h3 { margin-top: 0; font-size: 1.1rem; border-bottom: 1px solid #1a1a1a; padding-bottom: 10px; margin-bottom: 1rem; color: #fff; }
                
                .bio-text { color: #ccc; line-height: 1.6; font-size: 0.95rem; white-space: pre-wrap; }
                
                .meta-list { display: flex; flex-direction: column; gap: 8px; margin-top: 1rem; }
                .meta-item { display: flex; align-items: center; gap: 10px; color: #888; font-size: 0.9rem; }
                
                .skills-tags { display: flex; flex-wrap: wrap; gap: 6px; }
                .skill-tag { 
                    background: rgba(255,255,255,0.03); 
                    padding: 4px 10px; 
                    border-radius: 99px; 
                    font-size: 0.8rem; 
                    border: 1px solid #1a1a1a;
                    color: #aaa;
                    font-weight: 500;
                }

                /* Certification & Empty Portfolio Refinements */
                .certification-card {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 1.5rem;
                    background: linear-gradient(135deg, #0a0a0a 0%, #050505 100%);
                }
                .certification-card h3 { border: none; padding: 0; margin-bottom: 0.5rem; }
                .certification-card p { font-size: 0.85rem; color: #888; margin: 0; }
                .certification-card button { border-radius: 99px !important; white-space: nowrap; }

                .empty-portfolio {
                    text-align: center; 
                    padding: 2rem; 
                    color: #666; 
                    border: 1px dashed #1a1a1a; 
                    border-radius: 12px;
                    background: rgba(255,255,255,0.01);
                }
                .empty-portfolio p { font-size: 0.9rem; margin-bottom: 1rem; }
                .empty-portfolio button { border-radius: 99px !important; }

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
                    .profile-grid { 
                        grid-template-columns: 35% 1fr; /* Two columns on mobile */
                        gap: 1rem; 
                        margin-top: 1.25rem; 
                    }
                    .profile-avatar { 
                        width: 100px; height: 100px; font-size: 2.2rem; 
                        margin-top: -50px; /* Overlap halfway */
                        border-width: 3px; 
                    }
                    .profile-header-top { margin-top: 0; } /* Clear negative margin so buttons stay below */
                    
                    .role-line { font-size: 0.8rem !important; opacity: 0.8; }
                    
                    /* Small, professional action buttons */
                    .header-actions { margin-bottom: 0px; gap: 6px; }
                    .header-actions button { 
                        padding: 2px 12px !important; 
                        font-size: 0.75rem !important; 
                        height: 30px !important; 
                        min-width: 75px;
                    }
                    
                    .card { padding: 1rem; }
                    .card h3 { font-size: 0.85rem; margin-bottom: 0.5rem; }
                    .bio-text { font-size: 0.8rem; }
                    .skill-tag { font-size: 0.72rem; padding: 3px 8px; }
                    .name-block h1 { font-size: 1.3rem; }
                    .header-stats { gap: 1rem; margin-top: 0.25rem; }
                    .stat-value { font-size: 0.85rem; }
                    .stat-label { font-size: 0.7rem; }
                    .meta-item { font-size: 0.75rem; }
                    
                    /* Secondary Buttons Professional Sizing */
                    .certification-card { flex-direction: column; align-items: flex-start; gap: 1rem; }
                    .certification-card button { width: 100%; height: 34px !important; font-size: 0.8rem !important; }
                    .empty-portfolio { padding: 1.5rem; }
                    .empty-portfolio button { height: 32px !important; font-size: 0.8rem !important; padding: 0 15px !important; }

                    /* Refined mobile list font sizes */
                    .experience-item-display h4 { font-size: 0.9rem !important; }
                    .experience-item-display div { font-size: 0.75rem !important; }
                    .experience-item-display p { font-size: 0.8rem !important; }

                    /* Project Jobs List Mobile Refinements */
                    .project-jobs-section { padding: 1rem; }
                    .job-card-row { padding: 0.75rem; gap: 0.75rem; }
                    .job-info h4 { font-size: 0.9rem !important; }
                    .job-type { font-size: 0.75rem !important; }
                    .project-jobs-section .section-header h3 { font-size: 0.9rem; }
                }

                @media (max-width: 480px) {
                    .profile-banner { height: 120px; }
                    .profile-grid { 
                         grid-template-columns: 100px 1fr; /* Slightly smaller left column for 360px support */
                         gap: 0.6rem;
                    }
                    .profile-avatar { 
                        width: 75px; height: 75px; 
                        margin-top: -37.5px; /* Overlap halfway */
                        font-size: 1.6rem; 
                    }
                    .profile-header-top { margin-top: 0; }
                    .profile-content { padding: 0 0.75rem; } /* Reduced padding for 360px */
                    .header-actions button { 
                        padding: 2px 6px !important; 
                        font-size: 0.7rem !important; 
                        height: 26px !important; 
                        min-width: 60px;
                    }
                    .name-block h1 { font-size: 1.1rem; }
                    .verified-badge { font-size: 0.65rem; padding: 1px 6px; }
                    .role-line { font-size: 0.75rem !important; }
                    .header-stats { gap: 0.8rem; }
                    .stat-box { gap: 4px; }
                    .stat-value { font-size: 0.8rem; }
                    .stat-label { font-size: 0.65rem; }

                    /* Narrow screen Project Roles scaling */
                    .job-card-row { padding: 0.6rem; }
                    .job-info h4 { font-size: 0.85rem !important; }
                    .job-type { font-size: 0.7rem !important; }
                    .project-jobs-section .section-header h3 { font-size: 0.85rem; }
                    .count-badge { font-size: 0.7rem; padding: 1px 6px; }
                }
            `}</style>
        </div>
    );
};

export default Profile;
