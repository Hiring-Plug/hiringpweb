
import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import { FaPlus, FaEye, FaEdit, FaTrash } from 'react-icons/fa';

const ManageJobs = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) fetchMyJobs();
    }, [user]);

    const fetchMyJobs = async () => {
        try {
            const { data, error } = await supabase
                .from('jobs')
                .select('*')
                .eq('project_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setJobs(data || []);
        } catch (error) {
            console.error('Error fetching jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="manage-jobs-container">
            <div className="section-header">
                <h3>Posted Jobs</h3>
                <Button variant="outline" size="sm" onClick={() => navigate('/app/jobs')}>
                    <FaPlus /> Post New
                </Button>
            </div>

            {loading ? <p>Loading...</p> : jobs.length === 0 ? (
                <div className="empty-state">
                    <p>No active job listings.</p>
                </div>
            ) : (
                <div className="jobs-grid">
                    {jobs.map(job => (
                        <div key={job.id} className="job-card-mini">
                            <div className="job-main">
                                <h4>{job.title}</h4>
                                <span className={`status-badge ${job.status}`}>{job.status}</span>
                            </div>
                            <div className="job-stats">
                                <span>{job.type}</span>
                                <span>•</span>
                                <span>{new Date(job.created_at).toLocaleDateString()}</span>
                            </div>
                            <div className="job-actions">
                                <Button variant="ghost" size="sm" onClick={() => navigate(`/app/jobs/${job.id}`)}>
                                    View
                                </Button>
                                <Button variant="ghost" size="sm">
                                    Edit
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <style>{`
                .manage-jobs-container {
                    background: #111;
                    border: 1px solid #222;
                    border-radius: 12px;
                    padding: 1.5rem;
                }
                .section-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1.5rem;
                }
                .section-header h3 { margin: 0; font-size: 1.2rem; }
                
                .empty-state {
                    color: #666;
                    text-align: center;
                    padding: 2rem;
                    font-style: italic;
                }

                .jobs-grid {
                    display: grid;
                    gap: 1rem;
                }
                
                .job-card-mini {
                    background: rgba(255,255,255,0.03);
                    border: 1px solid #222;
                    border-radius: 8px;
                    padding: 1rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .job-main h4 { margin: 0 0 5px 0; font-size: 1rem; color: #fff; }
                
                .status-badge {
                    font-size: 0.75rem;
                    text-transform: uppercase;
                    padding: 2px 6px;
                    border-radius: 4px;
                    font-weight: 600;
                }
                .status-badge.open { color: #4cd137; background: rgba(76, 209, 55, 0.1); }
                .status-badge.closed { color: #e74c3c; background: rgba(231, 76, 60, 0.1); }

                .job-stats {
                    color: #888;
                    font-size: 0.85rem;
                    display: flex;
                    gap: 8px;
                }

                .job-actions {
                    display: flex;
                    gap: 5px;
                }

                @media (max-width: 480px) {
                    .manage-jobs-container { padding: 1rem; }
                    .section-header h3 { font-size: 1rem; }
                    .job-card-mini { 
                        flex-direction: column; 
                        align-items: flex-start; 
                        gap: 12px;
                        padding: 1.25rem 1rem;
                    }
                    .job-main { width: 100%; }
                    .job-main h4 { font-size: 1.1rem; line-height: 1.4; }
                    .job-stats { font-size: 0.8rem; width: 100%; border-top: 1px solid #222; padding-top: 10px; }
                    .job-actions { width: 100%; gap: 10px; }
                    .job-actions button { flex: 1; height: 36px !important; font-size: 0.85rem !important; }
                }
            `}</style>
        </div>
    );
};

export default ManageJobs;
