import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../supabaseClient';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import Card from '../../components/Card';
import { FaBriefcase, FaMoneyBillWave, FaMapMarkerAlt, FaPlus, FaBuilding } from 'react-icons/fa';

const Jobs = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isPosting, setIsPosting] = useState(false); // Modal state

    // New Job Form State
    const [newJob, setNewJob] = useState({
        title: '',
        type: 'full-time',
        location: 'Remote',
        salary_range: '',
        description: '',
        requirements: ''
    });

    const isProject = user?.user_metadata?.role === 'project';

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        setLoading(true);
        // For 'project' role, maybe show only THEIR jobs? Or separate tab?
        // showing all open jobs for now.
        const { data, error } = await supabase
            .from('jobs')
            .select('*, profiles:project_id(username, avatar_url)')
            .eq('status', 'open')
            .order('created_at', { ascending: false });

        if (error) console.error('Error fetching jobs:', error);
        else setJobs(data || mockedJobs); // Fallback to mock if table empty
        setLoading(false);
    };

    const handlePostJob = async (e) => {
        e.preventDefault();
        try {
            const { error } = await supabase.from('jobs').insert([{
                ...newJob,
                project_id: user.id,
                status: 'open'
            }]);

            if (error) throw error;
            setIsPosting(false);
            fetchJobs(); // Refresh list
        } catch (error) {
            alert('Error posting job: ' + error.message);
        }
    };

    // Fallback Mock Data if DB is empty
    const mockedJobs = [
        { id: 1, title: 'Senior Solidity Engineer', type: 'full-time', location: 'Remote', salary_range: '$120k - $180k', profiles: { username: 'DeFi Kingdom' }, created_at: new Date().toISOString() },
        { id: 2, title: 'Product Designer', type: 'contract', location: 'London / Remote', salary_range: '$80/hr', profiles: { username: 'NFT Art' }, created_at: new Date().toISOString() },
    ];

    const displayJobs = jobs?.length ? jobs : mockedJobs;

    return (
        <div className="jobs-page">
            <div className="page-header">
                <div>
                    <h1>Find Your Next Role</h1>
                    <p>Curated opportunities from verified Web3 teams.</p>
                </div>
                {isProject && (
                    <Button variant="primary" onClick={() => setIsPosting(true)}>
                        <FaPlus /> Post a Job
                    </Button>
                )}
            </div>

            <div className="jobs-list">
                {loading ? <p>Loading opportunities...</p> : displayJobs.map(job => (
                    <div key={job.id} className="job-row" onClick={() => navigate(`/app/jobs/${job.id}`)}>
                        <div className="job-main">
                            <div className="company-logo">
                                <FaBuilding />
                            </div>
                            <div className="job-info">
                                <h3>{job.title}</h3>
                                <p className="company-name">{job.profiles?.username || 'Unknown Company'}</p>
                            </div>
                        </div>
                        <div className="job-meta">
                            <span className="tag type">{job.type}</span>
                            <span className="meta-item"><FaMapMarkerAlt /> {job.location}</span>
                            <span className="meta-item"><FaMoneyBillWave /> {job.salary_range}</span>
                        </div>
                        <div className="job-action">
                            <Button variant="outline" size="sm">View</Button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Post Job Modal */}
            {isPosting && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Post a New Opportunity</h2>
                        <form onSubmit={handlePostJob}>
                            <div className="form-group">
                                <label>Job Title</label>
                                <input required value={newJob.title} onChange={e => setNewJob({ ...newJob, title: e.target.value })} placeholder="e.g. Smart Contract Auditor" />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Type</label>
                                    <select value={newJob.type} onChange={e => setNewJob({ ...newJob, type: e.target.value })}>
                                        <option value="full-time">Full-time</option>
                                        <option value="contract">Contract</option>
                                        <option value="freelance">Freelance</option>
                                        <option value="dao">DAO Contributor</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Location</label>
                                    <input required value={newJob.location} onChange={e => setNewJob({ ...newJob, location: e.target.value })} placeholder="Remote, NYC..." />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Salary / Compensation</label>
                                <input required value={newJob.salary_range} onChange={e => setNewJob({ ...newJob, salary_range: e.target.value })} placeholder="$100k - $150k or $100/hr" />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea required rows="4" value={newJob.description} onChange={e => setNewJob({ ...newJob, description: e.target.value })} placeholder="What's the role about?" />
                            </div>
                            <div className="form-group">
                                <label>Requirements</label>
                                <textarea required rows="3" value={newJob.requirements} onChange={e => setNewJob({ ...newJob, requirements: e.target.value })} placeholder="Key skills needed..." />
                            </div>
                            <div className="modal-actions">
                                <Button type="button" variant="outline" onClick={() => setIsPosting(false)}>Cancel</Button>
                                <Button type="submit" variant="primary">Post Job</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style>{`
                .jobs-page {
                    max-width: 1000px;
                    margin: 0 auto;
                }
                .page-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2rem;
                }
                .page-header h1 { font-size: 2rem; margin-bottom: 0.5rem; }
                .page-header p { color: #888; }

                .jobs-list {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                .job-row {
                    background: #111;
                    border: 1px solid #222;
                    border-radius: 12px;
                    padding: 1.5rem;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    transition: all 0.2s;
                    cursor: pointer;
                }
                .job-row:hover {
                    border-color: var(--primary-orange);
                    transform: translateY(-2px);
                    background: #161616;
                }
                
                .job-main { display: flex; align-items: center; gap: 1rem; flex: 2; }
                .company-logo {
                    width: 48px;
                    height: 48px;
                    background: #222;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #666;
                    font-size: 1.2rem;
                }
                .job-info h3 { margin: 0 0 0.3rem 0; font-size: 1.1rem; color: #fff; }
                .company-name { color: #888; font-size: 0.9rem; margin: 0; }

                .job-meta {
                    flex: 2;
                    display: flex;
                    gap: 1.5rem;
                    align-items: center;
                    color: #aaa;
                    font-size: 0.9rem;
                }
                .meta-item { display: flex; align-items: center; gap: 6px; }
                .tag {
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-size: 0.8rem;
                    text-transform: capitalize;
                }
                .tag.type { background: rgba(52, 152, 219, 0.1); color: #3498db; }

                /* Modal */
                .modal-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(0,0,0,0.8);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 2000;
                    backdrop-filter: blur(5px);
                }
                .modal-content {
                    background: #111;
                    border: 1px solid #333;
                    border-radius: 12px;
                    padding: 2rem;
                    width: 100%;
                    max-width: 600px;
                }
                .modal-content h2 { margin-bottom: 1.5rem; color: #fff; }
                .form-group { margin-bottom: 1rem; }
                .form-group label { display: block; margin-bottom: 0.5rem; color: #ccc; }
                .form-group input, .form-group select, .form-group textarea {
                    width: 100%;
                    background: #050505;
                    border: 1px solid #333;
                    padding: 0.8rem;
                    border-radius: 6px;
                    color: white;
                }
                .form-row { display: flex; gap: 1rem; }
                .form-row .form-group { flex: 1; }
                .modal-actions { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 2rem; }

                @media (max-width: 768px) {
                    .job-row { flex-direction: column; align-items: flex-start; gap: 1rem; }
                    .job-meta { flex-wrap: wrap; gap: 1rem; }
                    .job-action { align-self: flex-end; }
                }
            `}</style>
        </div>
    );
};

export default Jobs;
