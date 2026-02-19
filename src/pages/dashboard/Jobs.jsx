import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { supabase } from '../../supabaseClient';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import Card from '../../components/Card';
import RichTextEditor from '../../components/RichTextEditor';
import { FaBriefcase, FaMoneyBillWave, FaMapMarkerAlt, FaPlus, FaBuilding, FaTimes } from 'react-icons/fa';

const JOB_TITLE_SUGGESTIONS = [
    "Full Stack Developer", "Frontend Engineer", "Backend Developer",
    "Solidity Developer", "Smart Contract Auditor", "Product Manager",
    "UX/UI Designer", "DevOps Engineer", "Marketing Lead", "Community Manager"
];

const TAG_SUGGESTIONS = [
    "React", "Solidity", "Rust", "TypeScript", "Node.js", "Web3.js",
    "Ethers.js", "Hardhat", "Foundry", "TailwindCSS", "Next.js", "Python"
];

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

    const [titleSuggestions, setTitleSuggestions] = useState([]);
    const [tagSuggestions, setTagSuggestions] = useState([]);

    const isProject = user?.user_metadata?.role === 'project';

    const handlePostJob = async (e) => {
        e.preventDefault();
        try {
            const jobData = {
                ...newJob,
                project_id: user.id,
                status: 'open',
                tags: typeof newJob.tags === 'string'
                    ? newJob.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
                    : newJob.tags
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

    const handleTitleChange = (val) => {
        setNewJob({ ...newJob, title: val });
        if (val.length > 1) {
            const filtered = JOB_TITLE_SUGGESTIONS.filter(s =>
                s.toLowerCase().includes(val.toLowerCase())
            );
            setTitleSuggestions(filtered);
        } else {
            setTitleSuggestions([]);
        }
    };

    const handleTagChange = (val) => {
        setNewJob({ ...newJob, tags: val });
        const lastTag = val.split(',').pop().trim();
        if (lastTag.length > 0) {
            const filtered = TAG_SUGGESTIONS.filter(s =>
                s.toLowerCase().includes(lastTag.toLowerCase())
            );
            setTagSuggestions(filtered);
        } else {
            setTagSuggestions([]);
        }
    };

    const selectTag = (tag) => {
        const parts = newJob.tags.split(',');
        parts.pop();
        const newVal = [...parts.map(p => p.trim()), tag].join(', ') + ', ';
        setNewJob({ ...newJob, tags: newVal });
        setTagSuggestions([]);
    };

    // Filter to show only Live jobs (exclude mocks starting with 'mock-')
    const liveJobs = projects.filter(p => !String(p.id).startsWith('mock-'));

    return (
        <div className="jobs-page">
            <div className="page-header">
                <div>
                    <h1>{isProject ? 'Job Management Console' : 'Explore Opportunities'}</h1>
                    <p>{isProject ? 'Create and manage your project roles.' : 'Live roles from the ecosystem.'}</p>
                </div>
                {isProject && (
                    <Button variant="primary" onClick={() => setIsPosting(true)}>
                        <FaPlus /> Create New Role
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
                ) : liveJobs.length > 0 ? (liveJobs.map(job => (
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
                <div className="modal-overlay" onClick={() => setIsPosting(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Define New Role</h2>
                            <button className="close-btn" onClick={() => setIsPosting(false)}><FaTimes /></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handlePostJob}>
                                <div className="form-group relative">
                                    <label>Job Title</label>
                                    <input
                                        required
                                        value={newJob.title}
                                        onChange={e => handleTitleChange(e.target.value)}
                                        placeholder="e.g. Smart Contract Auditor"
                                        autoComplete="off"
                                    />
                                    {titleSuggestions.length > 0 && (
                                        <div className="suggestions-dropdown">
                                            {titleSuggestions.map(s => (
                                                <div key={s} className="suggestion-item" onClick={() => {
                                                    setNewJob({ ...newJob, title: s });
                                                    setTitleSuggestions([]);
                                                }}>{s}</div>
                                            ))}
                                        </div>
                                    )}
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
                                    <RichTextEditor
                                        label="Role Description"
                                        required
                                        value={newJob.description}
                                        onChange={val => setNewJob({ ...newJob, description: val })}
                                        placeholder="What's the role about? Use the toolbar to format."
                                    />
                                </div>
                                <div className="form-group relative">
                                    <label>Tags (comma separated)</label>
                                    <input
                                        value={newJob.tags}
                                        onChange={e => handleTagChange(e.target.value)}
                                        placeholder="React, Solidity, Rust..."
                                        autoComplete="off"
                                    />
                                    {tagSuggestions.length > 0 && (
                                        <div className="suggestions-dropdown">
                                            {tagSuggestions.map(s => (
                                                <div key={s} className="suggestion-item" onClick={() => selectTag(s)}>{s}</div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="form-group">
                                    <RichTextEditor
                                        label="Requirements"
                                        required
                                        value={newJob.requirements}
                                        onChange={val => setNewJob({ ...newJob, requirements: val })}
                                        placeholder="Key skills needed..."
                                    />
                                </div>
                                <div className="modal-actions">
                                    <Button type="button" variant="outline" onClick={() => setIsPosting(false)}>Cancel</Button>
                                    <Button type="submit" variant="primary">Publish Role</Button>
                                </div>
                            </form>
                        </div>
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

                /* Modal Improvements */
                .modal-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(0,0,0,0.85);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 2000;
                    backdrop-filter: blur(8px);
                    padding: 1rem;
                }
                .modal-content {
                    background: #0a0a0a;
                    border: 1px solid #333;
                    border-radius: 20px;
                    width: 100%;
                    max-width: 650px;
                    max-height: 90vh;
                    display: flex;
                    flex-direction: column;
                    box-shadow: 0 20px 50px rgba(0,0,0,0.5);
                    overflow: hidden;
                    animation: modalSlideUp 0.3s ease-out;
                }
                @keyframes modalSlideUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .modal-header {
                    padding: 1.5rem 2rem;
                    border-bottom: 1px solid #1a1a1a;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .modal-header h2 { margin: 0; font-size: 1.5rem; color: #fff; }
                .close-btn {
                    background: transparent;
                    border: none;
                    color: #666;
                    font-size: 1.2rem;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    transition: all 0.2s;
                }
                .close-btn:hover { background: #222; color: #fff; }

                .modal-body {
                    padding: 2rem;
                    overflow-y: auto;
                    flex: 1;
                }
                
                .form-group { margin-bottom: 1.5rem; }
                .form-group label { display: block; margin-bottom: 0.6rem; color: #888; font-size: 0.9rem; font-weight: 500; }
                .form-group input, .form-group select {
                    width: 100%;
                    background: #050505;
                    border: 1px solid #222;
                    padding: 0.9rem;
                    border-radius: 10px;
                    color: white;
                    font-size: 1rem;
                    transition: all 0.2s;
                }
                .form-group input:focus, .form-group select:focus {
                    border-color: var(--primary-orange);
                    background: #000;
                    outline: none;
                }
                .form-row { display: flex; gap: 1rem; }
                .form-row .form-group { flex: 1; }
                
                .relative { position: relative; }
                .suggestions-dropdown {
                    position: absolute;
                    top: 100%;
                    left: 0;
                    right: 0;
                    background: #111;
                    border: 1px solid #333;
                    border-radius: 10px;
                    margin-top: 5px;
                    z-index: 10;
                    max-height: 200px;
                    overflow-y: auto;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.5);
                }
                .suggestion-item {
                    padding: 10px 15px;
                    cursor: pointer;
                    color: #bbb;
                    transition: all 0.2s;
                }
                .suggestion-item:hover { background: #222; color: var(--primary-orange); }

                .modal-actions { 
                    display: flex; 
                    justify-content: flex-end; 
                    gap: 1rem; 
                    margin-top: 1rem;
                    padding-top: 1.5rem;
                    border-top: 1px solid #1a1a1a;
                }

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
                    .modal-content { max-height: 95vh; border-radius: 15px; }
                    .modal-body { padding: 1.25rem; }
                    .form-row { flex-direction: column; gap: 0; }
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
