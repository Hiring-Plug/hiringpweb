import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';
import Button from '../components/Button';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { 
    FaTrash, FaEdit, FaPlus, FaLock, FaUser, FaBriefcase, 
    FaComments, FaFilePdf, FaClock, FaCheck, FaTimes, FaGlobe, 
    FaEnvelope, FaChevronDown, FaArrowLeft, FaBan, FaExternalLinkAlt, FaMousePointer 
} from 'react-icons/fa';

const Admin = () => {
    const { user, signOut } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('projects'); // projects, applicants
    const [loadingData, setLoadingData] = useState(false);

    // Supabase Data States
    const [dbJobs, setDbJobs] = useState([]);
    const [dbApplications, setDbApplications] = useState([]);

    // Form / Modal States
    const [isJobModalOpen, setIsJobModalOpen] = useState(false);
    const [currentJob, setCurrentJob] = useState(null); // null for new, object for edit
    const [uploadedLogo, setUploadedLogo] = useState(null);
    const [logoPreview, setLogoPreview] = useState(null);
    const [jobApplyMode, setJobApplyMode] = useState('internal'); // 'internal' | 'external'

    // Selected Applicant for Detail View
    const [selectedApplicant, setSelectedApplicant] = useState(null);

    // Admin email whitelist — read exclusively from VITE_ADMIN_EMAILS env var.
    // No hardcoded fallback: if the env var is missing, no one is granted access.
    const adminEmails = (import.meta.env.VITE_ADMIN_EMAILS || '')
        .toLowerCase()
        .split(',')
        .map(email => email.trim())
        .filter(Boolean);

    const isAuthorized = user && adminEmails.length > 0 && adminEmails.includes(user.email?.toLowerCase());

    // Fetch data if authorized
    useEffect(() => {
        if (isAuthorized) {
            fetchData();
        }
    }, [user, isAuthorized]);

    const fetchData = async () => {
        setLoadingData(true);
        try {
            await Promise.all([fetchJobs(), fetchApplications()]);
        } catch (err) {
            console.error('Error fetching admin data:', err);
            showToast('Failed to load database records.', 'error');
        } finally {
            setLoadingData(false);
        }
    };

    const fetchJobs = async () => {
        if (!supabase) return;
        const { data, error } = await supabase
            .from('jobs')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching jobs:', error);
            throw error;
        }
        setDbJobs(data || []);
    };

    const fetchApplications = async () => {
        if (!supabase) return;
        const { data, error } = await supabase
            .from('applications')
            .select(`
                *,
                profiles:applicant_id(username, avatar_url, primary_skill, full_name),
                jobs:job_id(title, category)
            `)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching applications:', error);
            throw error;
        }
        setDbApplications(data || []);
    };

    const handleLogoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 500000) { // 500KB limit
                alert("File is too large. Max size is 500KB.");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result);
                setUploadedLogo(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const openJobModal = (job = null) => {
        setCurrentJob(job);
        setJobApplyMode(job?.external_apply_url ? 'external' : 'internal');
        setUploadedLogo(job?.logo_url || null);
        setLogoPreview(job?.logo_url || null);
        setIsJobModalOpen(true);
    };

    const handleJobSubmit = async (e) => {
        e.preventDefault();
        if (!supabase || !user) return;

        const formData = new FormData(e.target);
        const tagsString = formData.get('tags') || '';
        const isExternal = jobApplyMode === 'external';
        const externalPlatform = isExternal ? (formData.get('external_platform')?.trim() || 'Partner') : null;
        const externalApplyUrl = isExternal ? (formData.get('external_apply_url')?.trim() || null) : null;

        const jobData = {
            project_id: user.id,
            title: formData.get('role'),
            category: formData.get('category'),
            location: formData.get('location'),
            type: formData.get('type').toLowerCase(),
            salary_range: formData.get('salary'),
            tags: tagsString.split(',').map(tag => tag.trim()).filter(Boolean),
            description: formData.get('description'),
            requirements: formData.get('requirements') || '',
            logo_url: uploadedLogo || formData.get('logoUrl') || '',
            status: 'open',
            external_platform: externalPlatform,
            external_apply_url: externalApplyUrl,
            clicks_count: currentJob?.clicks_count || 0
        };

        try {
            if (currentJob) {
                // Update existing job
                const { error } = await supabase
                    .from('jobs')
                    .update(jobData)
                    .eq('id', currentJob.id);

                if (error) throw error;
                showToast('Job updated successfully!', 'success');
            } else {
                // Insert new job
                const { error } = await supabase
                    .from('jobs')
                    .insert([jobData]);

                if (error) throw error;
                showToast('Job posted successfully!', 'success');
            }
            setIsJobModalOpen(false);
            setCurrentJob(null);
            setUploadedLogo(null);
            setLogoPreview(null);
            fetchJobs();
        } catch (error) {
            console.error('Error saving job:', error);
            showToast('Error saving job: ' + error.message, 'error');
        }
    };

    const handleDeleteJob = async (id) => {
        if (!supabase) return;
        if (window.confirm('Delete this job? This will remove all associated applications.')) {
            try {
                const { error } = await supabase
                    .from('jobs')
                    .delete()
                    .eq('id', id);

                if (error) throw error;
                showToast('Job deleted successfully.', 'success');
                fetchJobs();
                fetchApplications();
                if (selectedApplicant?.job_id === id) {
                    setSelectedApplicant(null);
                }
            } catch (error) {
                console.error('Error deleting job:', error);
                showToast('Failed to delete job: ' + error.message, 'error');
            }
        }
    };

    const handleUpdateAppStatus = async (appId, newStatus) => {
        if (!supabase) return;
        try {
            const { error } = await supabase
                .from('applications')
                .update({ status: newStatus })
                .eq('id', appId);

            if (error) throw error;
            showToast(`Status updated to ${newStatus}.`, 'success');
            fetchApplications();
            if (selectedApplicant?.id === appId) {
                setSelectedApplicant(prev => ({ ...prev, status: newStatus }));
            }
        } catch (error) {
            console.error('Error updating status:', error);
            showToast('Failed to update status.', 'error');
        }
    };

    const handleDeleteApplication = async (appId) => {
        if (!supabase) return;
        if (window.confirm('Delete this application permanently?')) {
            try {
                const { error } = await supabase
                    .from('applications')
                    .delete()
                    .eq('id', appId);

                if (error) throw error;
                showToast('Application deleted.', 'success');
                fetchApplications();
                if (selectedApplicant?.id === appId) {
                    setSelectedApplicant(null);
                }
            } catch (error) {
                console.error('Error deleting application:', error);
                showToast('Failed to delete application.', 'error');
            }
        }
    };

    const handleStartChat = async (applicantId, coverLetterText) => {
        if (!supabase || !user) return;
        try {
            const coverLetter = coverLetterText || "Interested in this role.";

            // 1. Check if conversation already exists
            const { data: existingConv } = await supabase
                .from('conversations')
                .select('id')
                .or(`and(participant1_id.eq.${user.id},participant2_id.eq.${applicantId}),and(participant1_id.eq.${applicantId},participant2_id.eq.${user.id})`)
                .maybeSingle();

            if (existingConv) {
                navigate('/app/messages', { state: { conversationId: existingConv.id } });
                return;
            }

            // 2. Create new conversation
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

            // 3. Insert initial cover letter message
            await supabase.from('messages').insert([{
                conversation_id: newConv.id,
                sender_id: applicantId, // The applicant "sent" the cover letter
                receiver_id: user.id,
                content: coverLetter
            }]);

            navigate('/app/messages', { state: { conversationId: newConv?.id } });
        } catch (error) {
            console.error('Error starting chat:', error);
            showToast('Failed to start conversation.', 'error');
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

    // Access Denied / Login checks
    if (!user) {
        return (
            <div className="admin-access-denied-page">
                <div className="denied-card">
                    <h2><FaLock /> Admin Console</h2>
                    <p>You must be logged in to your account to access the Admin Console.</p>
                    <div className="btn-row">
                        <Button variant="primary" onClick={() => navigate('/login')}>Go to Login</Button>
                        <Button variant="outline" onClick={() => navigate('/')}>Back to Home</Button>
                    </div>
                </div>
                <style>{`
                    .admin-access-denied-page {
                        height: 80vh;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background: #000;
                    }
                    .denied-card {
                        background: #111;
                        padding: 3rem;
                        border-radius: 12px;
                        border: 1px solid #333;
                        width: 100%;
                        max-width: 420px;
                        text-align: center;
                    }
                    .denied-card h2 {
                        text-align: center;
                        margin-bottom: 1.5rem;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        gap: 0.5rem;
                        color: #fff;
                    }
                    .denied-card p {
                        color: #aaa;
                        margin-bottom: 2rem;
                        line-height: 1.5;
                    }
                    .btn-row {
                        display: flex;
                        gap: 1rem;
                        justify-content: center;
                    }
                `}</style>
            </div>
        );
    }

    if (!isAuthorized) {
        return (
            <div className="admin-access-denied-page">
                <div className="denied-card unauthorized">
                    <h2><FaBan /> Access Denied</h2>
                    <p>Your account (<strong>{user.email}</strong>) does not have administrator privileges to access this console.</p>
                    <div className="env-info">
                        <code>
                            To authorize this email, add it to the <strong>VITE_ADMIN_EMAILS</strong> variable in your environment (e.g. <code>VITE_ADMIN_EMAILS={user.email}</code>).
                        </code>
                    </div>
                    <div className="btn-row">
                        <Button variant="primary" onClick={() => navigate('/')}>Back to Home</Button>
                        <Button variant="outline" onClick={signOut}>Sign Out / Switch User</Button>
                    </div>
                </div>
                <style>{`
                    .admin-access-denied-page {
                        height: 80vh;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background: #000;
                    }
                    .denied-card {
                        background: #111;
                        padding: 3rem;
                        border-radius: 12px;
                        border: 1px solid #ff4444;
                        width: 100%;
                        max-width: 480px;
                        text-align: center;
                    }
                    .denied-card h2 {
                        text-align: center;
                        margin-bottom: 1.5rem;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        gap: 0.5rem;
                        color: #ff4444;
                    }
                    .denied-card p {
                        color: #aaa;
                        margin-bottom: 1.5rem;
                        line-height: 1.5;
                    }
                    .env-info {
                        background: #000;
                        padding: 1rem;
                        border-radius: 6px;
                        border: 1px solid #222;
                        text-align: left;
                        margin-bottom: 2rem;
                    }
                    .env-info code {
                        font-size: 0.8rem;
                        color: #888;
                        word-break: break-all;
                    }
                    .btn-row {
                        display: flex;
                        gap: 1rem;
                        justify-content: center;
                    }
                `}</style>
            </div>
        );
    }

    return (
        <div className="admin-dashboard">
            <header className="admin-header">
                <div className="admin-header-title">
                    <h2>Admin Console</h2>
                    <span className="admin-user-tag">Admin: {user.email}</span>
                </div>
                <div className="admin-nav">
                    <button
                        className={activeTab === 'projects' ? 'active' : ''}
                        onClick={() => { setActiveTab('projects'); setSelectedApplicant(null); }}
                    >
                        <FaBriefcase /> Jobs
                    </button>
                    <button
                        className={activeTab === 'applicants' ? 'active' : ''}
                        onClick={() => { setActiveTab('applicants'); setSelectedApplicant(null); }}
                    >
                        <FaUser /> Applicants
                        {dbApplications.filter(a => a.status === 'pending').length > 0 && (
                            <span className="pending-badge">
                                {dbApplications.filter(a => a.status === 'pending').length}
                            </span>
                        )}
                    </button>
                    <button onClick={signOut} className="logout-btn">Logout</button>
                </div>
            </header>

            <div className="admin-content">
                {loadingData ? (
                    <div className="admin-loading-screen">
                        <div className="spinner"></div>
                        <p>Syncing with Supabase database...</p>
                    </div>
                ) : (
                    <>
                        {/* Tab 1: Jobs */}
                        {activeTab === 'projects' && (
                            <div className="data-section">
                                <div className="section-header">
                                    <h3>Manage Job Listings</h3>
                                    <Button
                                        variant="secondary"
                                        onClick={() => openJobModal(null)}
                                    >
                                        <FaPlus /> Post a Job
                                    </Button>
                                </div>
                                <div className="data-table-wrapper">
                                    <table className="data-table">
                                        <thead>
                                            <tr>
                                                <th>Title / Role</th>
                                                <th>Category</th>
                                                <th>Type</th>
                                                <th>Location</th>
                                                <th>Salary Range</th>
                                                <th>Apply Method / Clicks</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {dbJobs.map(job => {
                                                const isMyJob = job.project_id === user.id;
                                                return (
                                                    <tr key={job.id} className={isMyJob ? "my-row" : "community-row"}>
                                                        <td>
                                                            <div className="job-title-cell">
                                                                {job.logo_url && <img src={job.logo_url} alt="" className="table-logo" />}
                                                                <div>
                                                                    <strong>{job.title}</strong>
                                                                    {isMyJob ? (
                                                                        <span className="owner-badge">My Post</span>
                                                                    ) : (
                                                                        <span className="community-badge">Community</span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>{job.category}</td>
                                                        <td><span className="type-tag">{job.type}</span></td>
                                                        <td>{job.location}</td>
                                                        <td>{job.salary_range}</td>
                                                        <td>
                                                            {job.external_apply_url ? (
                                                                <div className="external-tracking-cell">
                                                                    <span className="platform-tag" title={job.external_apply_url}>
                                                                        <FaExternalLinkAlt style={{ fontSize: '0.65rem', marginRight: '4px' }} />
                                                                        {job.external_platform || 'External'}
                                                                    </span>
                                                                    <div className="clicks-badge" title="Total referral link clicks">
                                                                        <FaMousePointer style={{ fontSize: '0.7rem', color: 'var(--primary-orange, #ff6b00)' }} />
                                                                        <span><strong>{job.clicks_count || 0}</strong> clicks</span>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <span className="internal-app-badge">Internal Direct</span>
                                                            )}
                                                        </td>
                                                        <td>
                                                            {isMyJob ? (
                                                                <div className="table-actions">
                                                                    <button className="action-btn edit" onClick={() => openJobModal(job)} title="Edit Job">
                                                                        <FaEdit />
                                                                    </button>
                                                                    <button className="action-btn delete" onClick={() => handleDeleteJob(job.id)} title="Delete Job">
                                                                        <FaTrash />
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <span className="no-perm-tag" title="Only the job poster can edit or delete this job.">Read-Only</span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                            {dbJobs.length === 0 && (
                                                <tr>
                                                    <td colSpan="7" className="empty-table-cell">No jobs found in the database.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Tab 2: Applicants */}
                        {activeTab === 'applicants' && (
                            <div className="applicants-grid">
                                <div className="data-section applicants-list-section">
                                    <div className="section-header">
                                        <h3>Applications received</h3>
                                        <span className="count-label">{dbApplications.length} Total</span>
                                    </div>
                                    <div className="data-table-wrapper">
                                        <table className="data-table selectable">
                                            <thead>
                                                <tr>
                                                    <th>Applicant</th>
                                                    <th>Role Applied</th>
                                                    <th>Status</th>
                                                    <th>Date</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {dbApplications.map(app => {
                                                    const name = app.profiles?.username || app.profiles?.full_name || 'Anonymous';
                                                    const role = app.job_title || app.jobs?.title || 'Unknown Job';
                                                    const isSelected = selectedApplicant?.id === app.id;

                                                    return (
                                                        <tr 
                                                            key={app.id} 
                                                            onClick={() => setSelectedApplicant(app)}
                                                            className={isSelected ? 'selected-row' : ''}
                                                        >
                                                            <td>
                                                                <div className="applicant-cell">
                                                                    <div className="avatar-mini">
                                                                        {app.profiles?.avatar_url ? (
                                                                            <img src={app.profiles.avatar_url} alt="" />
                                                                        ) : (
                                                                            name.charAt(0).toUpperCase()
                                                                        )}
                                                                    </div>
                                                                    <strong>{name}</strong>
                                                                </div>
                                                            </td>
                                                            <td>{role}</td>
                                                            <td>{getStatusBadge(app.status)}</td>
                                                            <td>{new Date(app.created_at).toLocaleDateString()}</td>
                                                        </tr>
                                                    );
                                                })}
                                                {dbApplications.length === 0 && (
                                                    <tr>
                                                        <td colSpan="4" className="empty-table-cell">No applications received yet.</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Applicant Detail Pane */}
                                <div className="applicant-detail-pane">
                                    {selectedApplicant ? (
                                        <div className="detail-card">
                                            <div className="detail-header">
                                                <div className="applicant-main-info">
                                                    <div className="avatar-large">
                                                        {selectedApplicant.profiles?.avatar_url ? (
                                                            <img src={selectedApplicant.profiles.avatar_url} alt="" />
                                                        ) : (
                                                            <FaUser />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <h3>{selectedApplicant.profiles?.username || 'Anonymous User'}</h3>
                                                        <p className="primary-skill">{selectedApplicant.profiles?.primary_skill || 'Web3 Candidate'}</p>
                                                        {selectedApplicant.profiles?.full_name && (
                                                            <p className="fullname">Name: {selectedApplicant.profiles.full_name}</p>
                                                        )}
                                                    </div>
                                                </div>
                                                <button className="delete-app-btn" onClick={() => handleDeleteApplication(selectedApplicant.id)} title="Delete Application">
                                                    <FaTrash />
                                                </button>
                                            </div>

                                            <div className="detail-body">
                                                <div className="detail-section">
                                                    <span className="label font-bold">Applying For</span>
                                                    <div className="applied-job-box">
                                                        <strong>{selectedApplicant.job_title || selectedApplicant.jobs?.title || 'Unknown Job'}</strong>
                                                        <span className="category-tag">{selectedApplicant.jobs?.category || 'General'}</span>
                                                    </div>
                                                </div>

                                                <div className="detail-section">
                                                    <span className="label font-bold">Cover Letter</span>
                                                    <p className="cover-letter-text">{selectedApplicant.cover_letter || 'No cover letter provided.'}</p>
                                                </div>

                                                {selectedApplicant.resume_url && (
                                                    <div className="detail-section">
                                                        <span className="label font-bold">Attachment</span>
                                                        <div className="attachment-box">
                                                            <a href={selectedApplicant.resume_url} target="_blank" rel="noopener noreferrer" className="cv-link">
                                                                <FaFilePdf /> View / Download Resume (CV)
                                                            </a>
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="detail-section">
                                                    <span className="label font-bold">Application Status</span>
                                                    <div className="status-updater">
                                                        <label>Move Candidate To:</label>
                                                        <div className="status-buttons">
                                                            <button 
                                                                className={`status-btn pending ${selectedApplicant.status === 'pending' ? 'active' : ''}`}
                                                                onClick={() => handleUpdateAppStatus(selectedApplicant.id, 'pending')}
                                                            >
                                                                Pending
                                                            </button>
                                                            <button 
                                                                className={`status-btn interview ${selectedApplicant.status === 'interview' ? 'active' : ''}`}
                                                                onClick={() => handleUpdateAppStatus(selectedApplicant.id, 'interview')}
                                                            >
                                                                Interview
                                                            </button>
                                                            <button 
                                                                className={`status-btn rejected ${selectedApplicant.status === 'rejected' ? 'active' : ''}`}
                                                                onClick={() => handleUpdateAppStatus(selectedApplicant.id, 'rejected')}
                                                            >
                                                                Decline
                                                            </button>
                                                            <button 
                                                                className={`status-btn hired ${selectedApplicant.status === 'hired' ? 'active' : ''}`}
                                                                onClick={() => handleUpdateAppStatus(selectedApplicant.id, 'hired')}
                                                            >
                                                                Hire
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="detail-footer">
                                                <Button 
                                                    variant="primary" 
                                                    onClick={() => handleStartChat(selectedApplicant.applicant_id, selectedApplicant.cover_letter)}
                                                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                                                >
                                                    <FaComments /> Message Candidate
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="no-selection-placeholder">
                                            <FaUser className="placeholder-icon" />
                                            <p>Select an applicant from the list to view details, update their status, and start a conversation.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Post/Edit Job Modal Overlay */}
            {isJobModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>{currentJob ? 'Edit Job Listing' : 'Post a New Job'}</h3>
                        <form onSubmit={handleJobSubmit}>
                            <div className="form-grid">
                                <div className="form-group span-2 notice-box">
                                    <p>
                                        <strong>Notice:</strong> This job will be posted under your admin profile <strong>{user.email}</strong>. 
                                        Only your account will have permissions to edit or delete it.
                                    </p>
                                </div>

                                <div className="form-group span-2 apply-mode-selector-group">
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '700', color: '#fff' }}>
                                        Application Method
                                    </label>
                                    <div className="apply-mode-pill-toggle">
                                        <label className={`mode-pill ${jobApplyMode === 'internal' ? 'active' : ''}`}>
                                            <input
                                                type="radio"
                                                name="job_mode_radio"
                                                checked={jobApplyMode === 'internal'}
                                                onChange={() => setJobApplyMode('internal')}
                                                style={{ display: 'none' }}
                                            />
                                            <span>Internal (Hiring Plug Profile / Guest Apply)</span>
                                        </label>
                                        <label className={`mode-pill ${jobApplyMode === 'external' ? 'active' : ''}`}>
                                            <input
                                                type="radio"
                                                name="job_mode_radio"
                                                checked={jobApplyMode === 'external'}
                                                onChange={() => setJobApplyMode('external')}
                                                style={{ display: 'none' }}
                                            />
                                            <span>Third-Party Referral (e.g. micro1)</span>
                                        </label>
                                    </div>
                                    <small style={{ color: '#888', marginTop: '6px', display: 'block' }}>
                                        {jobApplyMode === 'internal' 
                                            ? 'Candidates apply directly on Hiring Plug with Fast Apply or Guest Application.'
                                            : 'Candidates see a direct "Apply via [Platform]" button that redirects to your referral link and tracks clicks.'}
                                    </small>
                                </div>

                                {jobApplyMode === 'external' && (
                                    <>
                                        <div className="form-group">
                                            <label>Third-Party Platform Name *</label>
                                            <input
                                                name="external_platform"
                                                defaultValue={currentJob?.external_platform || ''}
                                                placeholder="e.g. micro1"
                                                required={jobApplyMode === 'external'}
                                            />
                                            <small style={{ color: '#aaa', fontSize: '0.75rem' }}>
                                                The button will display: "Apply via [Platform Name]"
                                            </small>
                                        </div>
                                        <div className="form-group">
                                            <label>Referral / Job Apply URL *</label>
                                            <input
                                                name="external_apply_url"
                                                type="url"
                                                defaultValue={currentJob?.external_apply_url || ''}
                                                placeholder="https://www.micro1.ai/jobs/... or your referral link"
                                                required={jobApplyMode === 'external'}
                                            />
                                            <small style={{ color: '#aaa', fontSize: '0.75rem' }}>
                                                The link candidates will be taken to when clicking Apply.
                                            </small>
                                        </div>
                                        {currentJob && (
                                            <div className="form-group span-2 current-clicks-stat">
                                                <span>Total Referral Clicks: <strong style={{ color: 'var(--primary-orange, #ff6b00)' }}>{currentJob.clicks_count || 0}</strong> clicks recorded</span>
                                            </div>
                                        )}
                                    </>
                                )}
                                <div className="form-group">
                                    <label>Job Title / Role</label>
                                    <input name="role" defaultValue={currentJob?.title} placeholder="e.g. Lead Smart Contract Engineer" required />
                                </div>
                                <div className="form-group">
                                    <label>Category</label>
                                    <select name="category" defaultValue={currentJob?.category || 'DeFi'}>
                                        <option value="DeFi">DeFi</option>
                                        <option value="NFT">NFT</option>
                                        <option value="DAO">DAO</option>
                                        <option value="Infrastructure">Infrastructure</option>
                                        <option value="GameFi">GameFi</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Location</label>
                                    <input name="location" defaultValue={currentJob?.location} placeholder="e.g. Remote / New York" required />
                                </div>
                                <div className="form-group">
                                    <label>Type</label>
                                    <select name="type" defaultValue={currentJob?.type || 'full-time'}>
                                        <option value="full-time">Full-time</option>
                                        <option value="contract">Contract</option>
                                        <option value="freelance">Freelance</option>
                                        <option value="dao">DAO</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Salary Range</label>
                                    <input name="salary" defaultValue={currentJob?.salary_range} placeholder="e.g. $120k - $150k + Tokens" required />
                                </div>
                                <div className="form-group">
                                    <label>Company Logo Source</label>
                                    <div className="logo-upload-wrapper">
                                        <div className="file-upload-btn-container">
                                            <label className="custom-file-upload">
                                                <input type="file" accept="image/*" onChange={handleLogoUpload} />
                                                <span className="upload-btn-text">
                                                    {logoPreview ? 'Change Image' : 'Upload Image'}
                                                </span>
                                            </label>
                                            <span className="file-info-text">(Max 500KB)</span>
                                        </div>
                                        {logoPreview && (
                                            <div className="logo-preview-container">
                                                <img src={logoPreview} alt="Preview" />
                                                <button type="button" className="remove-logo-btn" onClick={() => { setLogoPreview(null); setUploadedLogo(null); }}><FaTrash /></button>
                                            </div>
                                        )}
                                    </div>
                                    <div className="or-divider"><span>OR</span></div>
                                    <input name="logoUrl" defaultValue={currentJob?.logo_url} placeholder="Paste Image URL..." />
                                </div>
                                <div className="form-group span-2">
                                    <label>Tags / Skills (comma separated)</label>
                                    <input name="tags" defaultValue={currentJob?.tags?.join(', ')} placeholder="Solidity, Rust, Auditing" required />
                                </div>
                                <div className="form-group span-2">
                                    <label>Job Description (Markdown Supported)</label>
                                    <textarea name="description" rows="4" defaultValue={currentJob?.description} placeholder="Describe the responsibilities and daily tasks..." required></textarea>
                                </div>
                                <div className="form-group span-2">
                                    <label>Requirements (One per line / comma separated)</label>
                                    <textarea name="requirements" rows="3" defaultValue={currentJob?.requirements} placeholder="e.g.&#10;- 3+ years experience with Solidity&#10;- Familiarity with Hardhat/Foundry"></textarea>
                                </div>
                            </div>
                            <div className="modal-actions">
                                <button type="button" onClick={() => setIsJobModalOpen(false)}>Cancel</button>
                                <Button variant="primary" type="submit">Save Job Listing</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style>{`

                .external-tracking-cell {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }
                .platform-tag {
                    display: inline-flex;
                    align-items: center;
                    background: rgba(237, 80, 0, 0.15);
                    color: var(--primary-orange, #ff6b00);
                    border: 1px solid rgba(237, 80, 0, 0.3);
                    padding: 2px 8px;
                    border-radius: 4px;
                    font-size: 0.75rem;
                    font-weight: 700;
                    width: fit-content;
                }
                .clicks-badge {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    color: #aaa;
                    font-size: 0.75rem;
                }
                .internal-app-badge {
                    display: inline-block;
                    background: #1c1c1c;
                    color: #777;
                    border: 1px solid #2a2a2a;
                    padding: 2px 8px;
                    border-radius: 4px;
                    font-size: 0.75rem;
                }
                .apply-mode-pill-toggle {
                    display: flex;
                    gap: 10px;
                    background: #111;
                    padding: 6px;
                    border-radius: 8px;
                    border: 1px solid #252525;
                }
                .mode-pill {
                    flex: 1;
                    text-align: center;
                    padding: 8px 12px;
                    border-radius: 6px;
                    font-size: 0.85rem;
                    font-weight: 600;
                    color: #888;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                .mode-pill:hover {
                    color: #fff;
                    background: #191919;
                }
                .mode-pill.active {
                    background: #222;
                    color: var(--primary-orange, #ff6b00);
                    border: 1px solid rgba(237, 80, 0, 0.4);
                }
                .current-clicks-stat {
                    background: #111;
                    border: 1px dashed #333;
                    padding: 10px 14px;
                    border-radius: 6px;
                    font-size: 0.85rem;
                    color: #bbb;
                }

                .admin-dashboard {
                    min-height: 100vh;
                    background: #000;
                    color: #fff;
                    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                }
                .admin-header {
                    padding: 1rem 2rem;
                    border-bottom: 1px solid #1a1a1a;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background: #0d0d0d;
                }
                .admin-header-title {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }
                .admin-header-title h2 {
                    margin: 0;
                    font-size: 1.4rem;
                    font-weight: 800;
                    color: #fff;
                }
                .admin-user-tag {
                    font-size: 0.75rem;
                    color: #777;
                }
                .admin-nav {
                    display: flex;
                    align-items: center;
                    gap: 1.25rem;
                }
                .admin-nav button {
                    background: none;
                    border: 1px solid transparent;
                    color: #aaa;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.6rem 1.2rem;
                    border-radius: 8px;
                    font-size: 0.9rem;
                    font-weight: 600;
                    transition: all 0.2s;
                }
                .admin-nav button:hover {
                    color: #fff;
                    background: #161616;
                }
                .admin-nav button.active {
                    background: #1c1c1c;
                    border-color: #333;
                    color: #fff;
                }
                .logout-btn {
                    border: 1px solid #444 !important;
                    background: transparent !important;
                }
                .logout-btn:hover {
                    background: #ff4444 !important;
                    border-color: #ff4444 !important;
                    color: #fff !important;
                }
                .pending-badge {
                    background: #f1c40f;
                    color: #000;
                    border-radius: 99px;
                    padding: 1px 6px;
                    font-size: 0.7rem;
                    font-weight: 800;
                }

                .admin-content {
                    padding: 2rem;
                    max-width: 1200px;
                    margin: 0 auto;
                }

                .admin-loading-screen {
                    padding: 5rem 0;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 1rem;
                }
                .spinner {
                    width: 40px;
                    height: 40px;
                    border: 3px solid #222;
                    border-top: 3px solid var(--primary-orange);
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                .data-section {
                    background: #0d0d0d;
                    border: 1px solid #1c1c1c;
                    border-radius: 12px;
                    overflow: hidden;
                }
                .section-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1.5rem 2rem;
                    border-bottom: 1px solid #1c1c1c;
                }
                .section-header h3 {
                    margin: 0;
                    font-size: 1.1rem;
                    font-weight: 700;
                }
                .count-label {
                    background: #222;
                    padding: 4px 10px;
                    border-radius: 99px;
                    font-size: 0.8rem;
                    color: #888;
                }

                /* Tables */
                .data-table-wrapper {
                    overflow-x: auto;
                }
                .data-table {
                    width: 100%;
                    border-collapse: collapse;
                }
                .data-table th, .data-table td {
                    text-align: left;
                    padding: 1.2rem 1.5rem;
                    border-bottom: 1px solid #161616;
                    font-size: 0.9rem;
                }
                .data-table th {
                    color: #666;
                    font-weight: 600;
                    text-transform: uppercase;
                    font-size: 0.75rem;
                    letter-spacing: 0.05em;
                }
                .data-table tbody tr {
                    transition: background-color 0.2s;
                }
                .data-table.selectable tbody tr {
                    cursor: pointer;
                }
                .data-table.selectable tbody tr:hover {
                    background: #121212;
                }
                .data-table tbody tr.selected-row {
                    background: rgba(237, 80, 0, 0.05);
                    border-left: 3px solid var(--primary-orange);
                }
                .empty-table-cell {
                    text-align: center !important;
                    color: #555;
                    padding: 3rem !important;
                    font-style: italic;
                }

                /* Cells */
                .job-title-cell {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                .table-logo {
                    width: 36px;
                    height: 36px;
                    border-radius: 6px;
                    object-fit: cover;
                    border: 1px solid #222;
                }
                .owner-badge {
                    display: inline-block;
                    background: rgba(237, 80, 0, 0.1);
                    color: var(--primary-orange);
                    font-size: 0.7rem;
                    font-weight: 700;
                    padding: 1px 6px;
                    border-radius: 4px;
                    margin-left: 8px;
                    text-transform: uppercase;
                }
                .community-badge {
                    display: inline-block;
                    background: #1c1c1c;
                    color: #777;
                    font-size: 0.7rem;
                    font-weight: 700;
                    padding: 1px 6px;
                    border-radius: 4px;
                    margin-left: 8px;
                    text-transform: uppercase;
                }
                .type-tag {
                    display: inline-block;
                    background: #181818;
                    color: #aaa;
                    font-size: 0.8rem;
                    font-weight: 600;
                    padding: 2px 8px;
                    border-radius: 6px;
                    border: 1px solid #222;
                }
                .no-perm-tag {
                    font-size: 0.8rem;
                    color: #444;
                    font-style: italic;
                }

                .table-actions {
                    display: flex;
                    gap: 0.5rem;
                }
                .action-btn {
                    background: #1a1a1a;
                    border: 1px solid #333;
                    cursor: pointer;
                    padding: 0.5rem;
                    border-radius: 6px;
                    color: #ccc;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s;
                }
                .action-btn.edit:hover { background: #2980b9; border-color: #2980b9; color: #fff; }
                .action-btn.delete:hover { background: #e74c3c; border-color: #e74c3c; color: #fff; }

                /* Applicants Layout Grid */
                .applicants-grid {
                    display: grid;
                    grid-template-columns: 1.2fr 1fr;
                    gap: 2rem;
                }
                .applicant-cell {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                .avatar-mini {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    background: #222;
                    color: #888;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                    font-weight: 700;
                    font-size: 0.85rem;
                }
                .avatar-mini img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                /* Status Badges */
                .status-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    padding: 4px 10px;
                    border-radius: 99px;
                    font-size: 0.75rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                .status-badge.pending { background: rgba(241, 196, 15, 0.1); color: #f1c40f; border: 1px solid rgba(241, 196, 15, 0.15); }
                .status-badge.interview { background: rgba(52, 152, 219, 0.1); color: #3498db; border: 1px solid rgba(52, 152, 219, 0.15); }
                .status-badge.rejected { background: rgba(231, 76, 60, 0.1); color: #e74c3c; border: 1px solid rgba(231, 76, 60, 0.15); }
                .status-badge.hired { background: rgba(46, 204, 113, 0.1); color: #2ecc71; border: 1px solid rgba(46, 204, 113, 0.15); }

                /* Detail Pane */
                .applicant-detail-pane {
                    position: sticky;
                    top: 20px;
                    height: fit-content;
                }
                .no-selection-placeholder {
                    border: 1px dashed #222;
                    padding: 4rem 2rem;
                    border-radius: 12px;
                    text-align: center;
                    color: #555;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 1rem;
                }
                .placeholder-icon {
                    font-size: 3rem;
                    opacity: 0.15;
                }
                .no-selection-placeholder p {
                    font-size: 0.95rem;
                    line-height: 1.5;
                    max-width: 300px;
                    margin: 0;
                }

                .detail-card {
                    background: #0d0d0d;
                    border: 1px solid #1c1c1c;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.5);
                }
                .detail-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    padding: 1.5rem;
                    border-bottom: 1px solid #1c1c1c;
                    background: #111;
                }
                .applicant-main-info {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                .avatar-large {
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    background: #222;
                    color: #888;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                    font-size: 1.5rem;
                }
                .avatar-large img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                .detail-header h3 {
                    margin: 0 0 2px 0;
                    font-size: 1.1rem;
                    color: #fff;
                }
                .primary-skill {
                    margin: 0;
                    font-size: 0.85rem;
                    color: var(--primary-orange);
                    font-weight: 500;
                }
                .fullname {
                    margin: 2px 0 0 0;
                    font-size: 0.75rem;
                    color: #777;
                }
                .delete-app-btn {
                    background: transparent;
                    border: none;
                    color: #777;
                    cursor: pointer;
                    padding: 8px;
                    transition: color 0.2s;
                }
                .delete-app-btn:hover {
                    color: #e74c3c;
                }

                .detail-body {
                    padding: 1.5rem;
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }
                .detail-section {
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                }
                .detail-section .label {
                    font-size: 0.75rem;
                    text-transform: uppercase;
                    color: #555;
                    font-weight: 700;
                    letter-spacing: 0.05em;
                }
                .applied-job-box {
                    background: #141414;
                    padding: 10px 14px;
                    border-radius: 8px;
                    border: 1px solid #222;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .category-tag {
                    background: #222;
                    color: #999;
                    font-size: 0.75rem;
                    padding: 2px 8px;
                    border-radius: 4px;
                    font-weight: 600;
                }
                .cover-letter-text {
                    background: #141414;
                    padding: 12px 16px;
                    border-radius: 8px;
                    border: 1px solid #222;
                    font-size: 0.9rem;
                    color: #ccc;
                    line-height: 1.5;
                    margin: 0;
                    white-space: pre-wrap;
                }
                .attachment-box {
                    background: #141414;
                    padding: 10px 14px;
                    border-radius: 8px;
                    border: 1px solid #222;
                }
                .cv-link {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    color: #e67e22;
                    text-decoration: none;
                    font-size: 0.85rem;
                    font-weight: 600;
                }
                .cv-link:hover {
                    text-decoration: underline;
                }

                /* Status Changer Buttons */
                .status-updater {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                .status-updater label {
                    font-size: 0.8rem;
                    color: #888;
                }
                .status-buttons {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 4px;
                    background: #141414;
                    padding: 3px;
                    border-radius: 8px;
                    border: 1px solid #222;
                }
                .status-btn {
                    background: transparent;
                    border: none;
                    color: #888;
                    padding: 6px;
                    font-size: 0.8rem;
                    font-weight: 600;
                    border-radius: 6px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .status-btn:hover {
                    color: #fff;
                    background: #222;
                }
                .status-btn.pending.active { background: #f1c40f; color: #000; }
                .status-btn.interview.active { background: #3498db; color: #fff; }
                .status-btn.rejected.active { background: #e74c3c; color: #fff; }
                .status-btn.hired.active { background: #2ecc71; color: #fff; }

                .detail-footer {
                    padding: 1rem 1.5rem;
                    border-top: 1px solid #1c1c1c;
                    background: #111;
                }

                /* Modals & Popups */
                .modal-overlay {
                    position: fixed;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(0, 0, 0, 0.85);
                    backdrop-filter: blur(5px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 2000;
                    padding: 20px;
                }
                .modal-content {
                    background: #161616;
                    border-radius: 12px;
                    width: 700px;
                    max-width: 100%;
                    max-height: 90vh;
                    border: 1px solid #333;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    animation: modalFadeIn 0.3s ease;
                }
                @keyframes modalFadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .modal-content h3 {
                    padding: 1.5rem 2rem;
                    border-bottom: 1px solid #282828;
                    margin: 0;
                    background: #161616;
                    color: #fff;
                    font-size: 1.25rem;
                }

                .modal-content form {
                    display: flex;
                    flex-direction: column;
                    flex: 1;
                    overflow: hidden;
                }
                .form-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1.5rem;
                    padding: 2rem;
                    overflow-y: auto;
                }
                .span-2 { grid-column: span 2; }
                
                .notice-box {
                    background: rgba(237, 80, 0, 0.05);
                    border: 1px solid rgba(237, 80, 0, 0.15);
                    border-radius: 8px;
                    padding: 1rem;
                }
                .notice-box p {
                    margin: 0;
                    font-size: 0.85rem;
                    color: #aaa;
                    line-height: 1.5;
                }

                .form-group label {
                    display: block;
                    margin-bottom: 0.6rem;
                    color: #888;
                    font-size: 0.75rem;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                .form-group input, 
                .form-group textarea, 
                .form-group select {
                    width: 100%;
                    padding: 0.8rem 1rem;
                    background-color: #0a0a0a !important;
                    border: 1px solid #333;
                    border-radius: 6px;
                    color: #eee;
                    font-size: 0.95rem;
                    transition: border-color 0.2s;
                    font-family: inherit;
                }
                .form-group input:focus, 
                .form-group textarea:focus, 
                .form-group select:focus {
                    border-color: var(--primary-orange);
                    outline: none;
                    background-color: #050505 !important;
                }
                
                .logo-upload-wrapper {
                    background: #0a0a0a;
                    border: 1px solid #333;
                    border-radius: 6px;
                    padding: 1rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .file-upload-btn-container {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }
                .custom-file-upload {
                    display: inline-block;
                    cursor: pointer;
                    background: #222;
                    padding: 0.5rem 1rem;
                    border-radius: 4px;
                    border: 1px solid #444;
                    transition: all 0.2s;
                }
                .custom-file-upload:hover {
                    background: #333;
                    border-color: #666;
                }
                .custom-file-upload input[type="file"] {
                    display: none;
                }
                .upload-btn-text {
                    font-size: 0.85rem;
                    color: #fff;
                }
                .file-info-text {
                    font-size: 0.8rem;
                    color: #555;
                }
                .logo-preview-container {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
                .logo-preview-container img {
                    width: 48px;
                    height: 48px;
                    border-radius: 6px;
                    object-fit: cover;
                    border: 1px solid #444;
                }
                .remove-logo-btn {
                    background: none;
                    border: none;
                    color: #e74c3c;
                    cursor: pointer;
                    padding: 4px;
                }
                .or-divider {
                    display: flex;
                    align-items: center;
                    margin: 0.8rem 0;
                    color: #444;
                    font-size: 0.8rem;
                }
                .or-divider::before, .or-divider::after {
                    content: '';
                    flex: 1;
                    height: 1px;
                    background: #222;
                }
                .or-divider span {
                    padding: 0 10px;
                }

                .modal-actions {
                    display: flex;
                    justify-content: flex-end;
                    gap: 1rem;
                    padding: 1.5rem 2rem;
                    background: #161616;
                    border-top: 1px solid #282828;
                }
                .modal-actions button {
                    padding: 0.8rem 1.5rem;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: 500;
                    transition: all 0.2s;
                    font-size: 0.95rem;
                }
                .modal-actions button:first-child {
                    background: transparent;
                    border: 1px solid #333;
                    color: #aaa;
                }
                .modal-actions button:first-child:hover {
                    border-color: #666;
                    color: #fff;
                }
                
                @media (max-width: 900px) {
                    .applicants-grid {
                        grid-template-columns: 1fr;
                        gap: 2rem;
                    }
                    .applicant-detail-pane {
                        position: relative;
                        top: 0;
                    }
                }
                @media (max-width: 768px) {
                    .form-grid {
                        grid-template-columns: 1fr;
                        padding: 1.5rem;
                    }
                    .span-2 { grid-column: span 1; }
                    .admin-header {
                        flex-direction: column;
                        gap: 1rem;
                        align-items: flex-start;
                        padding: 1rem;
                    }
                    .admin-nav {
                        width: 100%;
                        overflow-x: auto;
                        padding-bottom: 5px;
                    }
                }
            `}</style>
        </div>
    );
};

export default Admin;
