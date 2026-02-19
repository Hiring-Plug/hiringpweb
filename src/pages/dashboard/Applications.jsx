
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { FaFileAlt, FaUser, FaBuilding, FaCheck, FaTimes, FaClock, FaChevronRight, FaAddressCard, FaComments } from 'react-icons/fa';

const Applications = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const role = user?.user_metadata?.role || 'talent';

    useEffect(() => {
        if (user) fetchApplications();
    }, [user]);

    const fetchApplications = async () => {
        setLoading(true);
        try {
            if (role === 'talent') {
                // Get my applications
                const { data: appsData, error: appsError } = await supabase
                    .from('applications')
                    .select('*')
                    .eq('applicant_id', user.id)
                    .order('created_at', { ascending: false });

                if (appsError) throw appsError;

                if (appsData && appsData.length > 0) {
                    // 1. Get Job Details
                    const jobIds = appsData.map(a => a.job_id);
                    const { data: jobsData } = await supabase
                        .from('jobs')
                        .select('id, title, logo_url')
                        .in('id', jobIds);

                    // 2. Get Project Profiles directly via project_id from applications
                    const projectIds = appsData.map(a => a.project_id).filter(Boolean);
                    const { data: profilesData } = await supabase
                        .from('profiles')
                        .select('id, username, avatar_url, primary_skill')
                        .in('id', projectIds);

                    // 3. Map Data
                    const formatted = appsData.map(app => {
                        const job = jobsData?.find(j => j.id === app.job_id);
                        const company = profilesData?.find(p => p.id === app.project_id);

                        return {
                            ...app,
                            jobs: {
                                title: app.job_title || job?.title || 'Unknown Job', // Prioritize explicit title
                                logo_url: job?.logo_url,
                                company: {
                                    username: company?.username || 'Hiring Project',
                                    tagline: company?.primary_skill || 'Web3 Core',
                                    avatar_url: company?.avatar_url
                                }
                            }
                        };
                    });
                    setApplications(formatted);
                } else {
                    setApplications([]);
                }
            } else {
                // EMPLOYER: Get applications for MY project_id directly
                const { data: apps, error } = await supabase
                    .from('applications')
                    .select('*, profiles:applicant_id(username, avatar_url, primary_skill, bio), jobs:job_id(title)')
                    .eq('project_id', user.id)
                    .order('created_at', { ascending: false });

                if (error) throw error;

                // Format data with fallbacks
                const formatted = apps.map(app => {
                    const profile = app.profiles || {
                        username: 'New Applicant',
                        primary_skill: 'Candidate',
                        bio: 'No profile set up yet.'
                    };

                    return {
                        ...app,
                        job_title: app.job_title || app.jobs?.title || 'Unknown Job', // Prioritize explicit record
                        profiles: profile
                    };
                });
                setApplications(formatted);
            }

        } catch (error) {
            console.error('Error fetching applications:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (appId, newStatus) => {
        try {
            const { error } = await supabase
                .from('applications')
                .update({ status: newStatus })
                .eq('id', appId);

            if (error) throw error;

            // Optimistic update
            setApplications(prev => prev.map(app =>
                app.id === appId ? { ...app, status: newStatus } : app
            ));
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status. Please try again.');
        }
    };

    const handleStartChat = async (applicantId) => {
        try {
            // 1. Find the application for this candidate to get the cover letter
            const app = applications.find(a => a.applicant_id === applicantId);
            const coverLetter = app?.cover_letter || "Interested in this role.";

            // 2. Check if conversation already exists
            const { data: existingConv } = await supabase
                .from('conversations')
                .select('id')
                .or(`and(participant1_id.eq.${user.id},participant2_id.eq.${applicantId}),and(participant1_id.eq.${applicantId},participant2_id.eq.${user.id})`)
                .maybeSingle();

            if (existingConv) {
                navigate('/app/messages', { state: { conversationId: existingConv.id } });
                return;
            }

            // 3. Create new conversation
            const { data: newConv, error: convError } = await supabase
                .from('conversations')
                .insert([{
                    participant1_id: user.id,
                    participant2_id: applicantId,
                    last_message: coverLetter,
                    updated_at: new Date()
                }])
                .select()
                .maybeSingle();

            if (convError) throw convError;

            // 4. Insert the cover letter as the first message (from the applicant's perspective usually, 
            // but here the project owner is "starting" it, so we can set the applicant as sender 
            // or just put it as the first item in the thread)
            await supabase.from('messages').insert([{
                conversation_id: newConv.id,
                sender_id: applicantId, // The applicant "sent" the cover letter
                receiver_id: user.id,
                content: coverLetter
            }]);

            navigate('/app/messages', { state: { conversationId: newConv?.id } });
        } catch (error) {
            console.error('Error starting chat:', error);
            alert('Failed to start conversation. Please try again.');
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'pending': return <span className="status-badge pending"><FaClock /> Pending</span>;
            case 'interview': return <span className="status-badge interview"><FaUser /> Interview</span>;
            case 'rejected': return <span className="status-badge rejected"><FaTimes /> Rejected</span>;
            case 'hired': return <span className="status-badge hired"><FaCheck /> Hired</span>;
            default: return <span className="status-badge">{status}</span>;
        }
    };

    return (
        <div className="apps-page-container">
            <div className="page-header">
                <div>
                    <h1>{role === 'talent' ? 'My Applications' : 'Candidate Pipeline'}</h1>
                    <p>{role === 'talent'
                        ? 'Track the status of roles you have applied for.'
                        : `You have ${applications.length} active candidates in your pipeline.`}
                    </p>
                </div>
            </div>

            <div className="pipeline-grid">
                {loading ? (
                    <div className="loading-state">Syncing pipeline data...</div>
                ) : applications.length === 0 ? (
                    <div className="empty-state-view">
                        <FaAddressCard className="empty-icon" />
                        <p>No applications found in this view.</p>
                    </div>
                ) : (
                    applications.map(app => (
                        <div key={app.id} className="refined-app-card">
                            <div className="card-top">
                                <div className="entity-info">
                                    <div className="avatar-wrapper">
                                        {role === 'talent' ? (
                                            app.jobs?.logo_url || app.jobs?.company?.avatar_url ? (
                                                <img src={app.jobs?.logo_url || app.jobs?.company?.avatar_url} alt="Logo" />
                                            ) : <FaBuilding />
                                        ) : (
                                            app.profiles?.avatar_url ? (
                                                <img src={app.profiles?.avatar_url} alt="Avatar" />
                                            ) : <FaUser />
                                        )}
                                    </div>
                                    <div className="details">
                                        <h3>{role === 'talent' ? app.jobs?.title : app.profiles?.username}</h3>
                                        <p className="subtitle">
                                            {role === 'talent'
                                                ? `${app.jobs?.company?.username} • ${app.jobs?.company?.tagline}`
                                                : `${app.profiles?.primary_skill || 'Candidate'}`}
                                        </p>
                                    </div>
                                </div>
                                <div className="status-area">
                                    {getStatusBadge(app.status)}
                                </div>
                            </div>

                            <div className="card-bottom">
                                <div className="preview-content">
                                    {role === 'talent' ? (
                                        <div className="app-snippet">
                                            <span>Application ID: #{app.id.toString().slice(0, 8)}</span>
                                            <span>•</span>
                                            <span>Applied: {new Date(app.created_at).toLocaleDateString()}</span>
                                        </div>
                                    ) : (
                                        <div className="candidate-snippet">
                                            <p className="bio-preview cover-letter">{app.cover_letter || "No cover letter provided."}</p>
                                            <div className="date-tag">Applied: {new Date(app.created_at).toLocaleDateString()}</div>
                                        </div>
                                    )}
                                </div>
                                <div className="action-row">
                                    {role === 'project' && app.status === 'pending' && (
                                        <div className="status-actions">
                                            <button
                                                className="action-btn interview"
                                                onClick={() => handleUpdateStatus(app.id, 'interview')}
                                            >
                                                Interview
                                            </button>
                                            <button
                                                className="action-btn reject"
                                                onClick={() => handleUpdateStatus(app.id, 'rejected')}
                                            >
                                                Decline
                                            </button>
                                        </div>
                                    )}
                                    {role === 'project' && app.status === 'interview' && (
                                        <div className="status-actions">
                                            <button
                                                className="action-btn hired"
                                                onClick={() => handleUpdateStatus(app.id, 'hired')}
                                            >
                                                Hire Talent
                                            </button>
                                            <button
                                                className="action-btn message"
                                                onClick={() => handleStartChat(app.applicant_id)}
                                            >
                                                <FaComments /> Message
                                            </button>
                                        </div>
                                    )}
                                    <button className="text-action-btn">
                                        {role === 'talent' ? 'View Job Details' : 'Full Profile'}
                                        <FaChevronRight />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <style>{`
                .apps-page-container { max-width: 1000px; margin: 0 auto; padding-bottom: 3rem; }
                .page-header { margin-bottom: 2.5rem; display: flex; justify-content: space-between; align-items: flex-end; }
                .page-header h1 { font-size: 2.2rem; margin-bottom: 0.5rem; color: #fff; font-weight: 800; }
                .page-header p { color: #888; font-size: 1.1rem; margin: 0; }
                
                .pipeline-grid { display: flex; flex-direction: column; gap: 1.25rem; }
                
                .refined-app-card {
                    background: #0d0d0d;
                    border: 1px solid #1a1a1a;
                    border-radius: 16px;
                    padding: 1.5rem;
                    transition: all 0.3s ease;
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }
                .refined-app-card:hover { border-color: #333; transform: translateY(-2px); box-shadow: 0 10px 30px rgba(0,0,0,0.3); }

                .card-top { display: flex; justify-content: space-between; align-items: flex-start; }
                .entity-info { display: flex; align-items: center; gap: 1.25rem; }
                
                .avatar-wrapper {
                    width: 56px;
                    height: 56px;
                    background: #1a1a1a;
                    border: 1px solid #222;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #555;
                    font-size: 1.4rem;
                    overflow: hidden;
                }
                .avatar-wrapper img { width: 100%; height: 100%; object-fit: cover; }
                
                .details h3 { margin: 0 0 4px 0; font-size: 1.2rem; color: #fff; font-weight: 700; }
                .subtitle { color: #888; margin: 0; font-size: 0.95rem; }

                .status-badge {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 6px 14px;
                    border-radius: 99px;
                    font-size: 0.8rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                .status-badge.pending { background: rgba(241, 196, 15, 0.1); color: #f1c40f; border: 1px solid rgba(241, 196, 15, 0.2); }
                .status-badge.interview { background: rgba(52, 152, 219, 0.1); color: #3498db; border: 1px solid rgba(52, 152, 219, 0.2); }
                .status-badge.rejected { background: rgba(231, 76, 60, 0.1); color: #e74c3c; border: 1px solid rgba(231, 76, 60, 0.2); }
                .status-badge.hired { background: rgba(46, 204, 113, 0.1); color: #2ecc71; border: 1px solid rgba(46, 204, 113, 0.2); }

                .card-bottom {
                    background: rgba(255,255,255,0.02);
                    border-radius: 12px;
                    padding: 1.25rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 1rem;
                }
                
                .preview-content { flex: 1; }
                .bio-preview { 
                    color: #aaa; 
                    margin: 0 0 8px 0; 
                    font-size: 0.9rem; 
                    line-height: 1.5;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                .date-tag, .app-snippet { font-size: 0.8rem; color: #555; display: flex; gap: 8px; align-items: center; }

                .text-action-btn {
                    background: transparent;
                    border: none;
                    color: var(--primary-orange);
                    font-size: 0.9rem;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    cursor: pointer;
                    white-space: nowrap;
                    transition: gap 0.2s;
                }
                .text-action-btn:hover { gap: 12px; }

                .status-actions { display: flex; gap: 8px; flex: 1; }
                .action-btn {
                    padding: 8px 16px;
                    border-radius: 8px;
                    font-size: 0.85rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                    border: 1px solid transparent;
                }
                .action-btn.interview { background: #3498db; color: #fff; }
                .action-btn.interview:hover { background: #2980b9; }
                .action-btn.reject { background: #e74c3c; color: #fff; }
                .action-btn.reject:hover { background: #c0392b; }
                .action-btn.hired { background: #2ecc71; color: #fff; }
                .action-btn.hired:hover { background: #27ae60; }
                .action-btn.message { background: #9b59b6; color: #fff; display: flex; align-items: center; gap: 8px; }
                .action-btn.message:hover { background: #8e44ad; }

                .loading-state, .empty-state-view { 
                    text-align: center; 
                    padding: 5rem 2rem; 
                    color: #444; 
                    border: 1px dashed #222; 
                    border-radius: 20px;
                }
                .empty-icon { font-size: 3rem; opacity: 0.1; margin-bottom: 1rem; }

                @media (max-width: 768px) {
                    .card-top { flex-direction: column; gap: 1rem; }
                    .card-bottom { flex-direction: column; align-items: flex-start; }
                    .action-row { width: 100%; border-top: 1px solid #222; padding-top: 12px; margin-top: 8px; }
                    .page-header h1 { font-size: 1.8rem; }
                }
            `}</style>
        </div>
    );
};

export default Applications;
