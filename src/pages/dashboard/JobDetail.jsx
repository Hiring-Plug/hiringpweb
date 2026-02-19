
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/Button';
import { FaBuilding, FaMapMarkerAlt, FaMoneyBillWave, FaArrowLeft, FaCheckCircle, FaLock } from 'react-icons/fa';
import { sendEmailNotification, EMAIL_TEMPLATES } from '../../services/email';

const JobDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);
    const [hasApplied, setHasApplied] = useState(false);
    const [coverLetter, setCoverLetter] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        fetchJob();
        checkApplicationStatus();
    }, [id, user]);

    const fetchJob = async () => {
        try {
            // 1. Fetch job (flat query)
            const { data: jobData, error: jobError } = await supabase
                .from('jobs')
                .select('*')
                .eq('id', id)
                .single();

            if (jobError) throw jobError;

            if (jobData) {
                // 2. Fetch profile separately (manual join)
                const { data: profileData, error: profileError } = await supabase
                    .from('profiles')
                    .select('username, avatar_url, website')
                    .eq('id', jobData.project_id)
                    .single();

                if (profileError) {
                    console.warn('Profile fetch error:', profileError);
                    setJob({ ...jobData, profiles: { username: 'Unknown Project' } });
                } else {
                    setJob({ ...jobData, profiles: profileData });
                }
            }
        } catch (error) {
            console.error('Error loading job:', error);
        } finally {
            setLoading(false);
        }
    };

    const checkApplicationStatus = async () => {
        if (!user) return;
        const { data } = await supabase
            .from('applications')
            .select('id')
            .eq('job_id', id)
            .eq('applicant_id', user.id)
            .single();

        if (data) setHasApplied(true);
    };

    const handleApply = async () => {
        if (!user) return navigate('/login');

        setApplying(true);
        try {
            const { error } = await supabase.from('applications').insert([{
                job_id: id,
                applicant_id: user.id,
                project_id: job.project_id,
                job_title: job.title, // Critical fix: store job title on the record
                cover_letter: coverLetter,
                job_type: 'job',
                status: 'pending'
            }]);

            if (error) throw error;

            // Trigger Notification for Job Owner
            if (job.project_id) {
                // 1. In-App Notification
                await supabase.from('notifications').insert([{
                    user_id: job.project_id,
                    type: 'application',
                    content: `New application for ${job.title}`,
                    link: '/app/applications',
                    is_read: false
                }]);

                // 2. Email Notification
                const applicantName = user.user_metadata?.username || user.email?.split('@')[0] || 'A Candidate';
                const template = EMAIL_TEMPLATES.NEW_APPLICATION(job.title, applicantName);

                sendEmailNotification({
                    recipientUserId: job.project_id,
                    ...template
                }).then(res => {
                    if (!res) console.log("Email notification skipped or failed (Silent fallback)");
                });

                // 3. Automated Message (Start Conversation)
                // Check if conversation exists
                const { data: existingConv } = await supabase
                    .from('conversations')
                    .select('id')
                    .or(`and(participant1_id.eq.${user.id},participant2_id.eq.${job.project_id}),and(participant1_id.eq.${job.project_id},participant2_id.eq.${user.id})`)
                    .single();

                let conversationId = existingConv?.id;

                if (!conversationId) {
                    const { data: newConv, error: convError } = await supabase
                        .from('conversations')
                        .insert([{
                            participant1_id: user.id,
                            participant2_id: job.project_id,
                            last_message: coverLetter || `New application for ${job.title}`,
                            updated_at: new Date()
                        }])
                        .select()
                        .maybeSingle();

                    if (!convError && newConv) conversationId = newConv.id;
                }

                if (conversationId) {
                    await supabase.from('messages').insert([{
                        conversation_id: conversationId,
                        sender_id: user.id,
                        receiver_id: job.project_id,
                        content: coverLetter || `Hi, I'm interested in the ${job.title} role.`
                    }]);
                }
            }

            setHasApplied(true);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 5000);
        } catch (error) {
            console.error('Application error:', error);
            // In a real app we'd use a toast component
        } finally {
            setApplying(false);
        }
    };

    const parseMarkdown = (text) => {
        if (!text) return null;
        // Simple regex to find **bold** and wrap in <strong>
        const parts = text.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={i}>{part.slice(2, -2)}</strong>;
            }
            return part;
        });
    };

    if (loading) return <div className="loading-state">Loading job details...</div>;
    if (!job) return <div className="error-state">Job not found.</div>;

    const isOwner = user?.id === job.project_id;

    return (
        <div className="job-detail-page">
            <button onClick={() => navigate('/app/jobs')} className="back-btn">
                <FaArrowLeft /> Back to Jobs
            </button>

            <div className="job-header">
                <div className="header-main">
                    <div className="company-logo-lg">
                        {job.logo_url ? (
                            <img src={job.logo_url} alt={job.profiles?.username} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }} />
                        ) : job.profiles?.avatar_url ? (
                            <img src={job.profiles.avatar_url} alt={job.profiles.username} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }} />
                        ) : (
                            <FaBuilding />
                        )}
                    </div>
                    <div>
                        <h1>{job.title}</h1>
                        <div className="job-meta">
                            <span className="company-name">{job.profiles?.username}</span>
                            <span className="dot">•</span>
                            <span className="meta-tag">{job.type}</span>
                            <span className="dot">•</span>
                            <span>{job.location}</span>
                        </div>
                    </div>
                </div>

                <div className="header-actions">
                    {hasApplied ? (
                        <div className="applied-badge">
                            <FaCheckCircle /> Applied
                        </div>
                    ) : isOwner ? (
                        <Button variant="outline" onClick={() => navigate('/app/jobs')}>Manage Job</Button>
                    ) : (
                        <div className="apply-desktop-btn">
                            {user ? (
                                <Button variant="primary" onClick={() => document.getElementById('apply-section')?.scrollIntoView({ behavior: 'smooth' })}>
                                    Apply Now
                                </Button>
                            ) : (
                                <Button variant="primary" onClick={() => navigate('/login')}>Login to Apply</Button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {showSuccess && (
                <div className="success-toast">
                    <FaCheckCircle /> Application submitted successfully!
                </div>
            )}

            <div className="job-layout">
                <div className="job-content">
                    <div className="detail-section">
                        <h3>About the Role</h3>
                        <p className="description-text">{parseMarkdown(job.description)}</p>
                    </div>

                    {job.requirements && (
                        <div className="detail-section">
                            <h3>Requirements</h3>
                            <p className="description-text">{parseMarkdown(job.requirements)}</p>
                        </div>
                    )}

                    <section className="detail-section">
                        <h3>Compensation</h3>
                        <div className="salary-box">
                            <FaMoneyBillWave />
                            <span>{job.salary_range}</span>
                        </div>
                    </section>

                    {/* Application Form */}
                    {!hasApplied && !isOwner && user && (
                        <section id="apply-section" className="apply-section">
                            <h3>Apply for this position</h3>
                            <div className="apply-form">
                                <label>Cover Letter / Note</label>
                                <textarea
                                    rows="6"
                                    placeholder="Introduce yourself and explain why you're a good fit..."
                                    value={coverLetter}
                                    onChange={(e) => setCoverLetter(e.target.value)}
                                />
                                <div className="form-footer">
                                    <Button variant="primary" onClick={handleApply} disabled={applying}>
                                        {applying ? 'Sending...' : 'Submit Application'}
                                    </Button>
                                </div>
                            </div>
                        </section>
                    )}
                </div>

                <div className="job-sidebar">
                    <div className="sidebar-card company-card">
                        <h4>Company</h4>
                        <div className="company-mini-profile">
                            <div className="company-avatar">
                                {job.logo_url || job.profiles?.avatar_url ? (
                                    <img src={job.logo_url || job.profiles?.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                                ) : (
                                    <FaBuilding />
                                )}
                            </div>
                            <div className="company-info-text">
                                <strong>{job.profiles?.username}</strong>
                                {job.profiles?.website && (
                                    <a href={job.profiles.website} target="_blank" rel="noreferrer" className="website-link">Visit Website</a>
                                )}
                            </div>
                        </div>
                        <div className="divider"></div>
                        <div className="safety-badge">
                            <FaLock /> Verified Payment
                        </div>
                    </div>
                </div>
            </div>

            {/* Sticky Mobile CTA */}
            {!hasApplied && !isOwner && !loading && (
                <div className="mobile-sticky-cta">
                    {user ? (
                        <Button variant="primary" onClick={() => document.getElementById('apply-section')?.scrollIntoView({ behavior: 'smooth' })}>
                            Apply to {job.profiles?.username}
                        </Button>
                    ) : (
                        <Button variant="primary" onClick={() => navigate('/login')}>Login to Apply</Button>
                    )}
                </div>
            )}

            <style>{`
                .job-detail-page {
                    max-width: 1000px;
                    margin: 0 auto;
                    padding: 1.5rem 1.5rem 6rem 1.5rem;
                }
                .back-btn {
                    background: none;
                    border: none;
                    color: #666;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    cursor: pointer;
                    margin-bottom: 2rem;
                    font-size: 0.95rem;
                    padding: 0;
                    transition: color 0.2s;
                }
                .back-btn:hover { color: var(--primary-orange); }

                .job-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2.5rem;
                    background: #0d0d0d;
                    border: 1px solid #1a1a1a;
                    padding: 2rem;
                    border-radius: 16px;
                }
                .header-main {
                    display: flex;
                    gap: 1.5rem;
                    align-items: center;
                }
                .company-logo-lg {
                    width: 72px;
                    height: 72px;
                    background: #1a1a1a;
                    border: 1px solid #333;
                    border-radius: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.8rem;
                    color: #555;
                    flex-shrink: 0;
                    overflow: hidden;
                }
                .job-header h1 {
                    font-size: 1.75rem;
                    margin: 0 0 0.5rem 0;
                    font-weight: 800;
                    letter-spacing: -0.02em;
                }
                .job-meta {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    color: #888;
                    font-size: 0.9rem;
                    flex-wrap: wrap;
                }
                .meta-tag {
                    color: #fff;
                    font-weight: 500;
                }
                .company-name {
                    color: var(--primary-orange);
                    font-weight: 600;
                    font-size: 1rem;
                }

                .job-layout {
                    display: grid;
                    grid-template-columns: 1fr 340px;
                    gap: 2.5rem;
                }

                .detail-section {
                    background: #0d0d0d;
                    border: 1px solid #1a1a1a;
                    border-radius: 16px;
                    padding: 2rem;
                    margin-bottom: 2rem;
                }
                .detail-section h3 {
                    font-size: 1.25rem;
                    margin-bottom: 1.5rem;
                    color: #fff;
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                .description-text {
                    color: #bbb;
                    line-height: 1.8;
                    font-size: 1.05rem;
                }

                .salary-box {
                    display: inline-flex;
                    align-items: center;
                    gap: 1rem;
                    background: rgba(76, 209, 55, 0.05);
                    border: 1px solid rgba(76, 209, 55, 0.1);
                    padding: 1rem 1.75rem;
                    border-radius: 12px;
                    color: #4cd137;
                    font-weight: 700;
                    font-size: 1.25rem;
                }

                .sidebar-card {
                    background: #0d0d0d;
                    border: 1px solid #1a1a1a;
                    border-radius: 16px;
                    padding: 1.5rem;
                    position: sticky;
                    top: 2rem;
                }
                .sidebar-card h4 {
                    margin-top: 0;
                    margin-bottom: 1.25rem;
                    color: #666;
                    font-size: 0.8rem;
                    text-transform: uppercase;
                    letter-spacing: 1.5px;
                    font-weight: 700;
                }
                .company-mini-profile {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    margin-bottom: 1.5rem;
                }
                .company-avatar {
                    width: 48px;
                    height: 48px;
                    background: #1a1a1a;
                    border: 1px solid #333;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.2rem;
                    color: #555;
                    overflow: hidden;
                }
                .company-info-text strong { display: block; font-size: 1.1rem; margin-bottom: 4px; }
                .divider { height: 1px; background: #1a1a1a; margin: 1.5rem 0; }
                .website-link { color: var(--primary-orange); text-decoration: none; font-size: 0.9rem; font-weight: 500; }
                .safety-badge {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    color: #4cd137;
                    font-size: 0.9rem;
                    background: rgba(76, 209, 55, 0.05);
                    padding: 12px;
                    border-radius: 10px;
                    font-weight: 600;
                }

                .apply-section {
                    background: linear-gradient(180deg, #0d0d0d 0%, #050505 100%);
                    border: 1px solid var(--primary-orange);
                    padding: 2.5rem;
                    border-radius: 20px;
                    box-shadow: 0 10px 40px rgba(237, 80, 0, 0.1);
                }
                .apply-section h3 { border: none; padding: 0; font-size: 1.5rem; text-align: center; margin-bottom: 2rem; }
                .apply-form label { display: block; margin-bottom: 0.75rem; color: #888; font-size: 0.9rem; font-weight: 500; }
                .apply-form textarea {
                    width: 100%;
                    background: #000;
                    border: 1px solid #222;
                    padding: 1.25rem;
                    border-radius: 12px;
                    color: white;
                    resize: vertical;
                    margin-bottom: 1.5rem;
                    font-size: 1rem;
                    transition: all 0.2s;
                }
                .apply-form textarea:focus { border-color: var(--primary-orange); background: #050505; }
                .form-footer { display: flex; justify-content: center; }
                .form-footer button { width: 100%; max-width: 400px; height: 50px !important; font-size: 1.1rem !important; }

                .applied-badge {
                    background: rgba(76, 209, 55, 0.1);
                    color: #4cd137;
                    padding: 12px 24px;
                    border-radius: 99px;
                    border: 1px solid rgba(76, 209, 55, 0.3);
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-weight: 700;
                }

                .success-toast {
                    position: fixed;
                    bottom: 2rem;
                    left: 50%;
                    transform: translateX(-50%);
                    background: #4cd137;
                    color: white;
                    padding: 1rem 2rem;
                    border-radius: 12px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.4);
                    z-index: 2000;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-weight: 600;
                    animation: slideUp 0.3s ease-out;
                }

                .mobile-sticky-cta { display: none; }

                @keyframes slideUp {
                    from { transform: translate(-50%, 100%); opacity: 0; }
                    to { transform: translate(-50%, 0); opacity: 1; }
                }

                @media (max-width: 900px) {
                    .job-layout { grid-template-columns: 1fr; }
                    .job-header { flex-direction: column; align-items: flex-start; gap: 1.5rem; padding: 1.5rem; }
                    .header-actions { width: 100%; display: none; } /* Hide in header on mobile, use bottom sticky */
                    .sidebar-card { position: static; }
                    
                    .mobile-sticky-cta {
                        display: block;
                        position: fixed;
                        bottom: 0;
                        left: 0;
                        right: 0;
                        background: rgba(0, 0, 0, 0.8);
                        backdrop-filter: blur(10px);
                        padding: 1rem 1.5rem;
                        border-top: 1px solid #222;
                        z-index: 1000;
                    }
                    .mobile-sticky-cta button { width: 100%; height: 52px !important; font-size: 1.1rem !important; }
                    .job-detail-page { padding-bottom: 8rem; }
                    .job-header h1 { font-size: 1.5rem; }
                }

                @media (max-width: 480px) {
                    .detail-section { padding: 1.5rem; }
                    .detail-section h3 { font-size: 1.1rem; }
                    .description-text { font-size: 0.95rem; }
                    .company-logo-lg { width: 60px; height: 60px; }
                }
            `}</style>
        </div>
    );
};

export default JobDetail;