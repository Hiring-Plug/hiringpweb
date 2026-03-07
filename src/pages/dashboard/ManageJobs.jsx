
import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import { useConfirm } from '../../components/ConfirmDialog';
import Button from '../../components/Button';
import { FaPlus, FaEye, FaEdit, FaTrash, FaBriefcase, FaUsers } from 'react-icons/fa';

const ManageJobs = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const { confirm } = useConfirm();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) fetchMyJobs();
    }, [user]);

    const handleDeleteJob = async (jobId) => {
        const isConfirmed = await confirm('Are you sure you want to delete this job posting? All associated applications will also be removed.', {
            variant: 'error',
            confirmText: 'Delete Job',
            title: 'Delete Posting'
        });

        if (!isConfirmed) return;

        try {
            const { error } = await supabase
                .from('jobs')
                .delete()
                .eq('id', jobId);

            if (error) throw error;

            showToast('Job deleted successfully.', 'success');
            fetchMyJobs(); // Refresh local list
        } catch (err) {
            showToast('Error deleting job: ' + err.message, 'error');
        }
    };

    const fetchMyJobs = async () => {
        try {
            // Fetch jobs
            const { data: jobsData, error: jobsError } = await supabase
                .from('jobs')
                .select('*')
                .eq('project_id', user.id)
                .order('created_at', { ascending: false });

            if (jobsError) throw jobsError;

            if (jobsData && jobsData.length > 0) {
                // Fetch application counts for these jobs
                const jobIds = jobsData.map(j => j.id);
                const { data: appData, error: appError } = await supabase
                    .from('applications')
                    .select('job_id')
                    .in('job_id', jobIds);

                if (!appError && appData) {
                    // Map counts to jobs
                    const jobsWithCounts = jobsData.map(job => {
                        const count = appData.filter(app => app.job_id === job.id).length;
                        return { ...job, applicant_count: count };
                    });
                    setJobs(jobsWithCounts);
                    return;
                }
            }

            setJobs(jobsData || []);
        } catch (error) {
            console.error('Error fetching jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="manage-jobs-panel">
            <div className="panel-header">
                <div>
                    <h3>Company Roles</h3>
                    <p>Manage and track your active job listings.</p>
                </div>
                <Button variant="primary" size="sm" onClick={() => navigate('/app/jobs')}>
                    <FaPlus /> Create New Role
                </Button>
            </div>

            {loading ? (
                <div className="loading-state">Loading your roles...</div>
            ) : jobs.length === 0 ? (
                <div className="empty-state">
                    <FaBriefcase className="empty-icon" />
                    <p>No active job listings. Start by creating your first role.</p>
                    <Button variant="outline" size="sm" onClick={() => navigate('/app/jobs')}>
                        Post a Job
                    </Button>
                </div>
            ) : (
                <div className="jobs-list-vertical">
                    {jobs.map(job => (
                        <div key={job.id} className="professional-job-card">
                            <div className="card-content">
                                <div className="card-info">
                                    <div className="title-row">
                                        <h4>{job.title}</h4>
                                        <span className={`status-pill ${job.status}`}>{job.status}</span>
                                    </div>
                                    <div className="stats-row">
                                        <div className="stat-pill">
                                            <span className="label">Type:</span>
                                            <span className="val">{job.type}</span>
                                        </div>
                                        <div className="stat-pill highlight" onClick={() => navigate('/app/applications')}>
                                            <FaUsers />
                                            <span className="val">{job.applicant_count || 0} Applicants</span>
                                        </div>
                                        <div className="stat-pill">
                                            <span className="label">Posted:</span>
                                            <span className="val">{new Date(job.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-actions">
                                    <Button variant="outline" size="sm" onClick={() => navigate(`/app/jobs/${job.id}`)}>
                                        <FaEye /> View
                                    </Button>
                                    <Button variant="secondary" size="sm" onClick={() => navigate('/app/jobs', { state: { editJob: job } })}>
                                        <FaEdit /> Edit
                                    </Button>
                                    <Button variant="outline" size="sm" className="delete-btn" onClick={(e) => { e.stopPropagation(); handleDeleteJob(job.id); }}>
                                        <FaTrash />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <style>{`
                .manage-jobs-panel {
                    background: #0d0d0d;
                    border: 1px solid #1a1a1a;
                    border-radius: 16px;
                    padding: 1.5rem;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.2);
                }
                .panel-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2rem;
                    gap: 1rem;
                }
                .panel-header h3 { margin: 0 0 4px 0; font-size: 1.25rem; color: #fff; }
                .panel-header p { margin: 0; color: #666; font-size: 0.9rem; }
                
                .loading-state { text-align: center; color: #555; padding: 2rem; }
                
                .empty-state {
                    color: #555;
                    text-align: center;
                    padding: 3rem 1rem;
                    background: rgba(255,255,255,0.02);
                    border: 1px dashed #222;
                    border-radius: 12px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 1rem;
                }
                .empty-icon { font-size: 2.5rem; opacity: 0.2; }

                .jobs-list-vertical {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                
                .professional-job-card {
                    background: #111;
                    border: 1px solid #1a1a1a;
                    border-radius: 12px;
                    padding: 1.25rem;
                    transition: all 0.2s ease;
                }
                .professional-job-card:hover {
                    border-color: #333;
                    background: #141414;
                    transform: translateX(4px);
                }
                
                .card-content {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 1.5rem;
                }
                
                .card-info { flex: 1; }
                .title-row { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
                .title-row h4 { margin: 0; font-size: 1.1rem; color: #fff; font-weight: 600; }
                
                .status-pill {
                    font-size: 0.7rem;
                    text-transform: uppercase;
                    padding: 2px 8px;
                    border-radius: 20px;
                    font-weight: 700;
                    letter-spacing: 0.5px;
                }
                .status-pill.open { color: #4cd137; background: rgba(76, 209, 55, 0.1); border: 1px solid rgba(76, 209, 55, 0.2); }
                .status-pill.closed { color: #e74c3c; background: rgba(231, 76, 60, 0.1); border: 1px solid rgba(231, 76, 60, 0.2); }

                .stats-row {
                    display: flex;
                    gap: 1.5rem;
                    flex-wrap: wrap;
                }
                .stat-pill {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 0.85rem;
                    color: #888;
                }
                .stat-pill.highlight {
                    color: var(--primary-orange);
                    background: rgba(237, 80, 0, 0.05);
                    padding: 2px 10px;
                    border-radius: 6px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .stat-pill.highlight:hover { background: rgba(237, 80, 0, 0.1); }
                .stat-pill .label { color: #555; }
                .stat-pill .val { font-weight: 500; }

                .card-actions {
                    display: flex;
                    gap: 8px;
                }
                .delete-btn {
                    color: #e74c3c !important;
                    border-color: rgba(231, 76, 60, 0.2) !important;
                }
                .delete-btn:hover {
                    background: rgba(231, 76, 60, 0.1) !important;
                    border-color: #e74c3c !important;
                }

                @media (max-width: 768px) {
                    .card-content { flex-direction: column; align-items: flex-start; gap: 1rem; }
                    .card-actions { width: 100%; border-top: 1px solid #1a1a1a; padding-top: 12px; }
                    .card-actions button { flex: 1; }
                    .card-actions .delete-btn { flex: 0 0 auto; width: 40px; }
                    .stats-row { gap: 1rem; }
                    .panel-header { flex-direction: column; align-items: flex-start; }
                    .panel-header button { width: 100%; }
                }
            `}</style>
        </div>
    );
};

export default ManageJobs;
