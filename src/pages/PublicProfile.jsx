
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import { FaMapMarkerAlt, FaLink, FaTwitter, FaGithub, FaLinkedin, FaCheckCircle, FaStar, FaBuilding, FaDiscord, FaGlobe, FaUserPlus, FaUserCheck, FaClock } from 'react-icons/fa';
import Button from '../components/Button';
import profileCover from '../assets/7.jpg'; // Default fallback
import Skeleton from '../components/Skeleton';
import SEO from '../components/SEO';

const PublicProfile = () => {
    const { username } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [error, setError] = useState(null);
    const [followStatus, setFollowStatus] = useState(null); // 'following', 'pending', 'connected', or null
    const [followCounts, setFollowCounts] = useState({ followers: 0, following: 0 });
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        if (username) {
            fetchPublicProfile();
        }
    }, [username]);

    const fetchPublicProfile = async () => {
        try {
            setLoading(true);
            const { data, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('username', username)
                .single();

            if (profileError) throw profileError;

            if (data) {
                // Robust check: use database role if set, otherwise infer from services (projects have services)
                const isProject = data.role === 'project' || (data.services && data.services.trim() !== '');
                setProfile({
                    ...data,
                    skills: Array.isArray(data.skills) ? data.skills : (data.skills ? data.skills.split(',') : []),
                    experience: data.experience || [],
                    social_links: data.social_links || {},
                });

                if (isProject) {
                    fetchProjectJobs(data.id);
                }

                fetchFollowData(data.id);
            } else {
                setError('Profile not found');
            }
        } catch (err) {
            console.error('Error fetching public profile:', err);
            setError('Could not load profile. It may not exist or is private.');
        } finally {
            setLoading(false);
        }
    };

    const fetchProjectJobs = async (projectId) => {
        try {
            const { data } = await supabase
                .from('jobs')
                .select('*')
                .eq('project_id', projectId)
                .eq('status', 'open');
            setJobs(data || []);
        } catch (err) {
            console.error('Error fetching jobs:', err);
        }
    };

    const fetchFollowData = async (targetId) => {
        try {
            // Fetch counts
            const { count: followersCount } = await supabase
                .from('follows')
                .select('*', { count: 'exact', head: true })
                .eq('following_id', targetId)
                .in('status', ['following', 'connected']);

            const { count: followingCount } = await supabase
                .from('follows')
                .select('*', { count: 'exact', head: true })
                .eq('follower_id', targetId)
                .in('status', ['following', 'connected']);

            setFollowCounts({ followers: followersCount || 0, following: followingCount || 0 });

            // Fetch current user's relationship with target
            if (user) {
                const { data: followData } = await supabase
                    .from('follows')
                    .select('status')
                    .eq('follower_id', user.id)
                    .eq('following_id', targetId)
                    .maybeSingle();

                setFollowStatus(followData?.status || null);
            }
        } catch (err) {
            console.error('Error fetching follow data:', err);
        }
    };

    const handleFollowAction = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        if (user.id === profile.id) return;

        setActionLoading(true);
        try {
            const isProject = profile.role === 'project' || (profile.services && profile.services.trim() !== '');
            const initialStatus = isProject ? 'following' : 'pending';

            if (followStatus) {
                // Handle unfollow/disconnect
                const { error } = await supabase
                    .from('follows')
                    .delete()
                    .eq('follower_id', user.id)
                    .eq('following_id', profile.id);

                if (error) throw error;
                setFollowStatus(null);
            } else {
                // Handle follow/connect
                const { error } = await supabase
                    .from('follows')
                    .insert([{
                        follower_id: user.id,
                        following_id: profile.id,
                        status: initialStatus
                    }]);

                if (error) throw error;
                setFollowStatus(initialStatus);

                // Get the follow record id for notification metadata
                const { data: newFollow } = await supabase
                    .from('follows')
                    .select('id')
                    .eq('follower_id', user.id)
                    .eq('following_id', profile.id)
                    .single();

                // Create notification with metadata
                await supabase.from('notifications').insert([{
                    user_id: profile.id,
                    type: initialStatus === 'pending' ? 'application' : 'system',
                    content: `${user.user_metadata?.username || 'Someone'} ${isProject ? 'started following' : 'wants to connect with'} you.`,
                    link: `/u/${user.user_metadata?.username}`,
                    metadata: initialStatus === 'pending' ? { follow_id: newFollow?.id, follower_id: user.id } : {}
                }]);
            }

            // Refresh counts
            fetchFollowData(profile.id);
        } catch (err) {
            console.error('Error in follow action:', err);
            alert('Failed to update follow status. Please try again.');
        } finally {
            setActionLoading(false);
        }
    };

    const handleHireMe = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        if (user.id === profile.id) return;

        setActionLoading(true);
        try {
            // 1. Check if conversation already exists
            const { data: existing } = await supabase
                .from('conversations')
                .select('id')
                .or(`and(participant1_id.eq.${user.id},participant2_id.eq.${profile.id}),and(participant1_id.eq.${profile.id},participant2_id.eq.${user.id})`)
                .maybeSingle();

            if (existing) {
                navigate('/app/messages', { state: { conversationId: existing.id } });
            } else {
                // 2. Create new conversation
                const { data: newConv, error } = await supabase
                    .from('conversations')
                    .insert([{
                        participant1_id: user.id,
                        participant2_id: profile.id,
                        last_message: 'Hi, I would like to hire you!'
                    }])
                    .select()
                    .single();

                if (error) throw error;

                // 3. Send initial message
                await supabase.from('messages').insert([{
                    conversation_id: newConv.id,
                    sender_id: user.id,
                    receiver_id: profile.id,
                    content: 'Hi, I would like to hire you!'
                }]);

                navigate('/app/messages', { state: { conversationId: newConv.id } });
            }
        } catch (err) {
            console.error('Error starting chat:', err);
            alert('Could not start chat. Please try again.');
        } finally {
            setActionLoading(false);
        }
    };

    if (error) {
        return (
            <div className="error-container" style={{ textAlign: 'center', padding: '100px 20px' }}>
                <h2>{error}</h2>
                <Button onClick={() => navigate('/')} variant="outline" style={{ marginTop: '20px' }}>Back to Home</Button>
            </div>
        );
    }

    const isProject = profile?.role === 'project' || (profile?.services && profile?.services.trim() !== '');
    const roleLabel = isProject ? 'Project' : 'Talent';

    const stats = isProject ? [
        profile?.tvl ? { label: 'TVL', value: profile.tvl } : null,
        profile?.funding ? { label: 'Funding', value: profile.funding } : null,
        { label: 'Rating', value: '4.9/5' }, // Mock
    ].filter(Boolean) : [
        { label: 'Job Success', value: '98%' },
        { label: 'On-time', value: '100%' },
        { label: 'Rating', value: '5.0' },
    ];

    return (
        <div className={`profile-container ${isProject ? 'project-mode' : ''}`}>
            <SEO
                title={`${profile?.username || 'Profile'} | Hiring Plug`}
                description={profile?.bio || `View ${profile?.username}'s professional profile on Hiring Plug.`}
                url={`/u/${username}`}
            />

            {/* Banner */}
            <div className="profile-banner" style={{
                backgroundImage: `url(${profile?.banner_url || profileCover})`,
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
                            ) : profile?.avatar_url ? (
                                <img src={profile.avatar_url} alt="Profile" className="avatar-img" />
                            ) : (
                                isProject ? <FaBuilding /> : (profile?.username?.charAt(0).toUpperCase() || 'U')
                            )}
                        </div>
                        <div className="header-actions">
                            {loading ? (
                                <Skeleton width="120px" height="40px" borderRadius="99px" />
                            ) : (
                                <>
                                    {isProject ? (
                                        <Button variant="primary" onClick={() => window.open(profile.website, '_blank')}>Visit Website</Button>
                                    ) : (
                                        <Button variant="primary" onClick={handleHireMe} disabled={actionLoading}>
                                            {actionLoading ? 'Loading...' : 'Hire Me'}
                                        </Button>
                                    )}
                                    {user?.id !== profile.id && (
                                        <Button
                                            variant={followStatus ? "outline" : (isProject ? "primary" : "outline")}
                                            onClick={handleFollowAction}
                                            disabled={actionLoading}
                                            style={!followStatus && !isProject ? { background: 'white', color: 'black', border: 'none' } : {}}
                                        >
                                            {actionLoading ? '...' : (
                                                followStatus === 'following' ? <><FaUserCheck /> Following</> :
                                                    followStatus === 'pending' ? <><FaClock /> Pending</> :
                                                        followStatus === 'connected' ? <><FaUserCheck /> Connected</> :
                                                            (isProject ? <><FaUserPlus /> Follow</> : <><FaUserPlus /> Connect</>)
                                            )}
                                        </Button>
                                    )}
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
                                    <h1>{profile?.username || 'Anonymous'}</h1>
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
                                    {profile?.primary_skill} • {profile?.location || 'Remote'}
                                    {!isProject && <span className="role-tag"> • {roleLabel}</span>}
                                </>
                            )}
                        </p>

                        <div className="social-links">
                            {loading ? (
                                [1, 2, 3].map(i => <Skeleton key={i} width="30px" height="30px" circle />)
                            ) : (
                                <>
                                    {profile?.social_links?.twitter && (
                                        <a href={profile.social_links.twitter} target="_blank" rel="noreferrer" className="social-link"><FaTwitter /></a>
                                    )}
                                    {profile?.social_links?.linkedin && (
                                        <a href={profile.social_links.linkedin} target="_blank" rel="noreferrer" className="social-link"><FaLinkedin /></a>
                                    )}
                                    {profile?.social_links?.telegram && (
                                        <a href={profile.social_links.telegram} target="_blank" rel="noreferrer" className="social-link"><FaGlobe /></a>
                                    )}
                                    {profile?.social_links?.discord && (
                                        <a href={profile.social_links.discord} target="_blank" rel="noreferrer" className="social-link"><FaDiscord /></a>
                                    )}
                                    {profile?.website && (
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
                            {!loading && (
                                <div className="stat-box">
                                    <span className="stat-value">{followCounts.followers}</span>
                                    <span className="stat-label">{isProject ? 'Followers' : 'Connections'}</span>
                                </div>
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
                                <Skeleton width="100%" height="100px" />
                            ) : (
                                <>
                                    <p className="bio-text">
                                        {profile?.bio || "No bio available."}
                                    </p>
                                    <div className="meta-list">
                                        <div className="meta-item">
                                            <FaMapMarkerAlt />
                                            <span>{profile?.location || 'Remote'}</span>
                                        </div>
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
                                    (profile?.services ? profile.services.split(',') : ['DeFi', 'NFTs', 'Smart Contracts']).map(s => <span key={s} className="skill-tag">{s.trim()}</span>)
                                ) : (
                                    (profile?.skills?.length > 0 ? profile.skills : ['React', 'Solidity', 'Design']).map((s, i) => <span key={i} className="skill-tag">{typeof s === 'string' ? s.trim() : s}</span>)
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="grid-main">
                        {!isProject ? (
                            <div className="card experience-section" style={{ marginBottom: '2rem' }}>
                                <h3>Experience</h3>
                                {loading ? (
                                    <Skeleton width="100%" height="150px" />
                                ) : profile?.experience && profile.experience.length > 0 ? (
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
                                    <p style={{ color: '#666', fontStyle: 'italic' }}>No experience listed.</p>
                                )}
                            </div>
                        ) : (
                            <div className="project-jobs-section">
                                <div className="section-header">
                                    <h3>Active Roles</h3>
                                    {jobs.length > 0 && <span className="count-badge">{jobs.length}</span>}
                                </div>

                                {jobs.length === 0 ? (
                                    <div className="empty-jobs">
                                        <p>No active jobs posted.</p>
                                    </div>
                                ) : (
                                    <div className="jobs-list-simple">
                                        {jobs.map(job => (
                                            <div key={job.id} className="job-item-display" style={{ marginBottom: '1.5rem', borderLeft: '2px solid #333', paddingLeft: '1rem' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                    <div>
                                                        <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem' }}>{job.title}</h4>
                                                        <div style={{ color: '#ED5000', fontSize: '0.9rem', marginBottom: '0.25rem' }}>{job.type} • <span style={{ color: '#888' }}>{job.location}</span></div>
                                                    </div>
                                                    <Button size="sm" variant="outline" onClick={() => navigate('/signup')}>Apply Now</Button>
                                                </div>
                                                <p style={{ color: '#ccc', fontSize: '0.95rem', marginTop: '0.5rem', lineHeight: '1.5' }}>
                                                    {job.description ? (job.description.length > 250 ? job.description.substring(0, 250) + '...' : job.description) : 'No description provided.'}
                                                </p>
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
                .profile-container { --accent: var(--primary-orange); padding-bottom: 4rem; margin-top: 60px; }
                .profile-banner { height: 200px; background: #111; position: relative; }
                .banner-gradient { width: 100%; height: 100%; background: linear-gradient(to bottom, transparent 50%, #0a0a0a); }
                .profile-content { max-width: 1100px; margin: 0 auto; padding: 0 1.5rem; position: relative; }
                .profile-header { margin-bottom: 2rem; }
                .profile-header-top { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 1rem; }
                .profile-avatar { width: 140px; height: 140px; background: #000; border: 4px solid #000; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 3rem; color: var(--accent); overflow: hidden; box-shadow: 0 0 0 1px #333; z-index: 2; margin-top: -70px; }
                .project-mode .profile-avatar { border-radius: 20%; }
                .avatar-img { width: 100%; height: 100%; object-fit: cover; }
                .header-actions { display: flex; gap: 12px; margin-bottom: 20px; }
                .header-actions button { border-radius: 999px !important; font-weight: 700; padding: 8px 20px; font-size: 0.95rem; height: 40px; }
                .header-info { display: flex; flex-direction: column; gap: 0.5rem; }
                .name-block { display: flex; align-items: center; gap: 10px; }
                .name-block h1 { margin: 0; font-size: 1.8rem; font-weight: 800; color: #fff; }
                .verified-badge { background: rgba(237, 80, 0, 0.1); color: var(--accent); border: 1px solid rgba(237, 80, 0, 0.2); font-size: 0.65rem; font-weight: 700; padding: 2px 8px; border-radius: 4px; display: flex; align-items: center; gap: 5px; }
                .profile-container:not(.project-mode) .verified-badge { background: rgba(241, 196, 15, 0.1); color: #f1c40f; border-color: rgba(241, 196, 15, 0.2); }
                .role-line { color: #888; font-size: 0.9rem; margin: 0; }
                .social-links { display: flex; flex-wrap: wrap; gap: 1.2rem; font-size: 1rem; color: #666; margin: 0.5rem 0; }
                .social-link { color: #666; transition: color 0.2s; }
                .social-link:hover { color: #fff; }
                .website-link { text-decoration: none; color: var(--accent); font-weight: 500; display: flex; align-items: center; gap: 6px; }
                .header-stats { display: flex; gap: 1.5rem; margin-top: 0.5rem; }
                .stat-box { display: flex; align-items: center; gap: 6px; }
                .stat-value { font-size: 1rem; font-weight: 700; color: #fff; }
                .stat-label { font-size: 0.9rem; color: #666; }
                .profile-grid { display: grid; grid-template-columns: 340px 1fr; gap: 2rem; margin-top: 2rem; }
                .card { background: #0a0a0a; border: 1px solid #1a1a1a; border-radius: 12px; padding: 1.5rem; }
                .card h3 { margin-top: 0; font-size: 1.1rem; border-bottom: 1px solid #1a1a1a; padding-bottom: 10px; margin-bottom: 1rem; color: #fff; }
                .bio-text { color: #ccc; line-height: 1.6; font-size: 0.95rem; white-space: pre-wrap; }
                .meta-list { margin-top: 1rem; }
                .meta-item { display: flex; align-items: center; gap: 10px; color: #888; font-size: 0.9rem; }
                .skills-tags { display: flex; flex-wrap: wrap; gap: 6px; }
                .skill-tag { background: rgba(255,255,255,0.03); padding: 4px 10px; border-radius: 99px; font-size: 0.8rem; border: 1px solid #1a1a1a; color: #aaa; }
                .project-jobs-section { background: #111; border: 1px solid #222; border-radius: 12px; padding: 1.5rem; }
                .section-header { display: flex; align-items: center; gap: 10px; margin-bottom: 1.5rem; }
                .count-badge { background: #333; color: #fff; padding: 2px 8px; border-radius: 10px; font-size: 0.8rem; }
                .jobs-list-simple { display: flex; flex-direction: column; gap: 1rem; }
                .job-card-row { display: flex; justify-content: space-between; align-items: center; background: #161616; padding: 1rem; border-radius: 8px; border: 1px solid #222; }
                .job-info h4 { margin: 0 0 5px 0; color: #fff; }
                .job-type { color: #666; font-size: 0.85rem; }
                .empty-jobs { text-align: center; padding: 2rem; color: #666; }

                @media (max-width: 900px) {
                    .profile-grid { grid-template-columns: 1fr; }
                    .header-actions { flex-direction: column; align-items: stretch; }
                }
            `}</style>
        </div >
    );
};

export default PublicProfile;
