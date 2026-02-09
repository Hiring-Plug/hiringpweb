
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
                cover_letter: coverLetter,
                job_type: 'job',
                job_type: 'job',
                status: 'pending'
            }]);

            if (error) throw error;

            // Trigger Notification for Job Owner
            if (job.project_id) {
                await supabase.from('notifications').insert([{
                    user_id: job.project_id,
                    type: 'application',
                    content: `New application for ${job.title}`,
                    link: '/app/applications',
                    is_read: false
                }]);

                // Trigger Email
                const template = EMAIL_TEMPLATES.NEW_APPLICATION(job.title, user.user_metadata?.username || 'A Candidate');
                sendEmailNotification({
                    recipientUserId: job.project_id,
                    ...template
                });
            }

            setHasApplied(true);
            alert('Application submitted successfully!');
        } catch (error) {
            console.error('Application error:', error);
            alert('Error applying: ' + error.message);
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
                        <Button variant="outline">Edit Job</Button>
                    ) : (
                        <div className="apply-box">
                            {user ? (
                                <Button variant="primary" onClick={() => document.getElementById('apply-section').scrollIntoView({ behavior: 'smooth' })}>
                                    Apply Now
                                </Button>
                            ) : (
                                <Button variant="primary" onClick={() => navigate('/login')}>Login to Apply</Button>
                            )}
                        </div>
                    )}
                </div>
            </div>

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
                    <div className="sidebar-card">
                        <h4>About the Company</h4>
                        <div className="company-mini-profile">
                            <div className="company-avatar">
                                {job.logo_url || job.profiles?.avatar_url ? (
                                    <img src={job.logo_url || job.profiles?.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                                ) : (
                                    <FaBuilding />
                                )}
                            </div>
                            <div>
                                <strong>{job.profiles?.username}</strong>
                                {job.profiles?.website && (
                                    <a href={job.profiles.website} target="_blank" rel="noreferrer" className="website-link">Visit Website</a>
                                )}
                            </div>
                        </div>
                        <div className="safety-badge">
                            <FaLock /> Verified Payment
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .job-detail-page {
                    max-width: 1000px;
                    margin: 0 auto;
                    padding-bottom: 4rem;
                }
                .back-btn {
                    background: none;
                    border: none;
                    color: #888;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    cursor: pointer;
                    margin-bottom: 2rem;
                    font-size: 0.9rem;
                    padding: 0;
                }
                .back-btn:hover { color: var(--primary-orange); }

                .job-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 3rem;
                    border-bottom: 1px solid #222;
                    padding-bottom: 2rem;
                }
                .header-main {
                    display: flex;
                    gap: 1.5rem;
                }
                .company-logo-lg {
                    width: 64px;
                    height: 64px;
                    background: #222;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.5rem;
                    color: #666;
                }
                .job-header h1 {
                    font-size: 2rem;
                    margin: 0 0 0.5rem 0;
                }
                .job-meta {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    color: #aaa;
                    font-size: 1rem;
                }
                .dot { color: #444; }
                .meta-tag {
                    background: rgba(255,255,255,0.1);
                    padding: 2px 8px;
                    border-radius: 4px;
                    font-size: 0.85rem;
                }
                .company-name {
                    color: var(--primary-orange);
                    font-weight: 500;
                }

                .job-layout {
                    display: grid;
                    grid-template-columns: 1fr 300px;
                    gap: 3rem;
                }

                .detail-section {
                    margin-bottom: 2.5rem;
                }
                .detail-section h3 {
                    font-size: 1.2rem;
                    margin-bottom: 1rem;
                    color: #fff;
                    border-left: 3px solid var(--primary-orange);
                    padding-left: 1rem;
                }
                .description-text {
                    color: #ccc;
                    line-height: 1.7;
                    font-size: 1.05rem;
                }
                .whitespace-pre-wrap { white-space: pre-wrap; }

                .salary-box {
                    display: inline-flex;
                    align-items: center;
                    gap: 1rem;
                    background: #111;
                    border: 1px solid #333;
                    padding: 1rem 1.5rem;
                    border-radius: 8px;
                    color: #4cd137;
                    font-weight: 600;
                    font-size: 1.1rem;
                }

                .sidebar-card {
                    background: #111;
                    border: 1px solid #222;
                    border-radius: 12px;
                    padding: 1.5rem;
                }
                .sidebar-card h4 {
                    margin-top: 0;
                    margin-bottom: 1rem;
                    color: #888;
                    font-size: 0.9rem;
                    text-transform: uppercase;
                }
                .company-mini-profile {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    margin-bottom: 1.5rem;
                }
                .company-avatar {
                    width: 40px;
                    height: 40px;
                    background: #222;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #666;
                }
                .website-link {
                    display: block;
                    font-size: 0.85rem;
                    color: var(--primary-orange);
                    text-decoration: none;
                    margin-top: 2px;
                }
                .safety-badge {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    color: #aaa;
                    font-size: 0.9rem;
                    background: rgba(255,255,255,0.05);
                    padding: 8px;
                    border-radius: 6px;
                }

                .apply-section {
                    margin-top: 3rem;
                    background: #111;
                    border: 1px solid #333;
                    padding: 2rem;
                    border-radius: 12px;
                }
                .apply-form label {
                    display: block;
                    margin-bottom: 1rem;
                    color: #ccc;
                }
                .apply-form textarea {
                    width: 100%;
                    background: #000;
                    border: 1px solid #333;
                    padding: 1rem;
                    border-radius: 8px;
                    color: white;
                    resize: vertical;
                    margin-bottom: 1.5rem;
                }
                .apply-form textarea:focus {
                     outline: none;
                     border-color: var(--primary-orange);
                }
                .applied-badge {
                    background: rgba(76, 209, 55, 0.1);
                    color: #4cd137;
                    padding: 10px 20px;
                    border-radius: 8px;
                    border: 1px solid #4cd137;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-weight: 600;
                }

                @media (max-width: 900px) {
                    .job-layout { grid-template-columns: 1fr; }
                    .job-header { flex-direction: column; gap: 1.5rem; }
                    .header-actions { width: 100%; }
                    .apply-box, .apply-box button { width: 100%; }
                }
            `}</style>
        </div>
    );
};

export default JobDetail;
