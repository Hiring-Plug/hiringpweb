import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { supabase } from '../../supabaseClient';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import Card from '../../components/Card';
import { FaBriefcase, FaMoneyBillWave, FaMapMarkerAlt, FaPlus, FaBuilding } from 'react-icons/fa';

const Jobs = () => {
    const { user } = useAuth();
    const { projects, refreshData, loading, error } = useData();
    const navigate = useNavigate();
    const [isPosting, setIsPosting] = useState(false); // Modal state

    // New Job Form State
    const [newJob, setNewJob] = useState({
        title: '',
        type: 'full-time',
        location: 'Remote',
        category: 'DeFi',
        salary_range: '',
        description: '',
        requirements: '',
        tags: '',
        logo_url: '' // Specific job/project logo
    });

    const isProject = user?.user_metadata?.role === 'project';

    const handlePostJob = async (e) => {
        e.preventDefault();
        try {
            const jobData = {
                ...newJob,
                project_id: user.id,
                status: 'open',
                tags: newJob.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
            };

            const { error: insertError } = await supabase.from('jobs').insert([jobData]);

            if (insertError) throw insertError;
            setIsPosting(false);

            // Refresh global context so the list updates
            if (refreshData) await refreshData();

            alert('Job posted successfully!');

            // Reset form
            setNewJob({
                title: '',
                type: 'full-time',
                location: 'Remote',
                category: 'DeFi',
                salary_range: '',
                description: '',
                requirements: '',
                tags: '',
                logo_url: ''
            });

        } catch (err) {
            alert('Error posting job: ' + err.message);
        }
    };

    // Filter to show only Live jobs (exclude mocks starting with 'mock-')
    const liveJobs = projects.filter(p => !String(p.id).startsWith('mock-'));

    return (
        <div className="jobs-page">
            <div className="page-header">
                <div>
                    <h1>Explore Opportunities</h1>
                    <p>Live roles from the ecosystem.</p>
                </div>
                {isProject && (
                    <Button variant="primary" onClick={() => setIsPosting(true)}>
                        <FaPlus /> Post a Job
                    </Button>
                )}
            </div>

            <div className="jobs-list">
                {error && (
                    <div className="error-alert" style={{ marginBottom: '2rem' }}>
                        <p>Error loading jobs: {error}</p>
                        <Button size="sm" variant="outline" onClick={() => refreshData && refreshData()}>Retry</Button>
                    </div>
                )}

                {loading ? (
                    <p>Loading opportunities...</p>
                ) : liveJobs.length > 0 ? (
                    liveJobs.map(job => (
                        <div key={job.id} className="job-row" onClick={() => navigate(`/app/jobs/${job.id}`)}>
                            <div className="job-main">
                                <div className="company-logo">
                                    {job.logo_url ? (
                                        <img src={job.logo_url} alt={job.company} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <FaBuilding />
                                    )}
                                </div>
                                <div className="job-info">
                                    <h3>{job.role}</h3>
                                    <p className="company-name">{job.company}</p>
                                </div>
                            </div>
                            <div className="job-meta">
                                <span className="tag type">{job.type}</span>
                                <span className="meta-item"><FaMapMarkerAlt /> {job.location}</span>
                                <span className="meta-item"><FaMoneyBillWave /> {job.salary}</span>
                            </div>
                            <div className="job-action">
                                <Button variant="outline" size="sm">View</Button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="empty-state-card">
                        <FaBriefcase style={{ fontSize: '3rem', opacity: 0.2, marginBottom: '1rem' }} />
                        <p>No live jobs found. {isProject ? 'Post your first job to get started!' : 'Check back soon for new roles.'}</p>
                    </div>
                )}
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
                                    <label>Category</label>
                                    <select value={newJob.category} onChange={e => setNewJob({ ...newJob, category: e.target.value })}>
                                        <option value="DeFi">DeFi</option>
                                        <option value="NFT">NFT</option>
                                        <option value="DAO">DAO</option>
                                        <option value="Infrastructure">Infrastructure</option>
                                        <option value="GameFi">GameFi</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Location</label>
                                <input required value={newJob.location} onChange={e => setNewJob({ ...newJob, location: e.target.value })} placeholder="e.g. Remote / London" />
                            </div>
                            <div className="form-group">
                                <label>Salary / Compensation</label>
                                <input required value={newJob.salary_range} onChange={e => setNewJob({ ...newJob, salary_range: e.target.value })} placeholder="$100k - $150k or $100/hr" />
                            </div>
                            <div className="form-group">
                                <label>Project Logo URL (Optional)</label>
                                <input value={newJob.logo_url} onChange={e => setNewJob({ ...newJob, logo_url: e.target.value })} placeholder="https://..." />
                                <small style={{ color: '#666' }}>Link to your project icon for branding.</small>
                            </div>
                            <div className="form-group">
                                <label>Description (Tip: use **text** for bold headings)</label>
                                <textarea required rows="4" value={newJob.description} onChange={e => setNewJob({ ...newJob, description: e.target.value })} placeholder="What's the role about? Use **bold** for headings." />
                            </div>
                            <div className="form-group">
                                <label>Tags (comma separated)</label>
                                <input value={newJob.tags} onChange={e => setNewJob({ ...newJob, tags: e.target.value })} placeholder="React, Solidity, Rust..." />
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

                .error-alert {
                    background: rgba(231, 76, 60, 0.1);
                    border: 1px solid #e74c3c;
                    padding: 1rem;
                    border-radius: 8px;
                    color: #e74c3c;
                    margin-bottom: 2rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                @media (max-width: 768px) {
                    .job-row { flex-direction: column; align-items: flex-start; gap: 1rem; }
                    .job-meta { flex-wrap: wrap; gap: 1rem; }
                    .job-action { align-self: flex-end; }
                }

                .empty-state-card {
                    background: #111;
                    border: 1px dashed #333;
                    border-radius: 12px;
                    padding: 4rem 2rem;
                    text-align: center;
                    color: #555;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                }
            `}</style>
        </div >
    );
};

export default Jobs;
