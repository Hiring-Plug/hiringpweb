
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../supabaseClient';
import { FaFileAlt, FaUser, FaBuilding, FaCheck, FaTimes, FaClock } from 'react-icons/fa';

const Applications = () => {
    const { user } = useAuth();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const role = user?.user_metadata?.role || 'talent';

    useEffect(() => {
        fetchApplications();
    }, [user]);

    const fetchApplications = async () => {
        setLoading(true);
        try {
            let query = supabase.from('applications').select('*');

            if (role === 'talent') {
                // Get my applications + Job details
                query = supabase
                    .from('applications')
                    .select('*, jobs(title, company:profiles(username))') // Assuming jobs table has FK to profiles? Or handle manually
                    .eq('applicant_id', user.id);
            } else {
                // EMPLOYER: Get applications for MY jobs
                // This is tricker: find jobs where company_id = me, then get applications for those jobs
                // Or use a join if RLS permits. 
                // For simplicity Phase 2, let's fetch my jobs first, then fetch apps.

                // 1. Get my Job IDs
                const { data: myJobs } = await supabase.from('jobs').select('id, title').eq('project_id', user.id);
                if (!myJobs?.length) {
                    setApplications([]);
                    setLoading(false);
                    return;
                }
                const jobIds = myJobs.map(j => j.id);

                // 2. Get applications for these jobs
                query = supabase
                    .from('applications')
                    .select('*, profiles:applicant_id(username, avatar_url, primary_skill)') // get applicant info
                    .in('job_id', jobIds);
            }

            const { data, error } = await query;
            if (error) throw error;

            // Format data
            if (role === 'project') {
                // We need to attach Job Titles manually if query didn't join deeply
                // Or we could have done a deep join if configured. Let's assume simplistic data for now.
                // Ideally: select('*, jobs(title)')
                const { data: myJobs } = await supabase.from('jobs').select('id, title').eq('project_id', user.id);
                const formatted = data.map(app => ({
                    ...app,
                    job_title: myJobs.find(j => j.id === app.job_id)?.title || 'Unknown Job'
                }));
                setApplications(formatted);
            } else {
                // Talent: 'jobs' object is populated by Supabase join
                setApplications(data);
            }

        } catch (error) {
            console.error('Error fetching applications:', error);
            // Mock Data for Demo
            if (role === 'talent') {
                setApplications([
                    { id: 1, status: 'pending', created_at: new Date().toISOString(), jobs: { title: 'Senior Solidity Dev', company: { username: 'DeFi Kingdom' } } },
                    { id: 2, status: 'interview', created_at: new Date().toISOString(), jobs: { title: 'Frontend Lead', company: { username: 'NFT Art' } } },
                ]);
            } else {
                setApplications([
                    { id: 1, status: 'pending', created_at: new Date().toISOString(), job_title: 'Senior Solidity Dev', profiles: { username: 'Vitalik_Fan', primary_skill: 'Developer' } },
                    { id: 2, status: 'rejected', created_at: new Date().toISOString(), job_title: 'Product Designer', profiles: { username: 'DesignGuru', primary_skill: 'Designer' } },
                ]);
            }
        } finally {
            setLoading(false);
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
        <div className="apps-page">
            <div className="page-header">
                <h1>{role === 'talent' ? 'My Applications' : 'Candidate Pipeline'}</h1>
                <p>Track and manage your hiring interactions.</p>
            </div>

            <div className="apps-list">
                {loading ? <p>Loading...</p> : applications.length === 0 ? <p className="empty">No applications found.</p> : (
                    applications.map(app => (
                        <div key={app.id} className="app-card">
                            <div className="app-main">
                                <div className="app-icon">
                                    {role === 'talent' ? <FaBuilding /> : <FaUser />}
                                </div>
                                <div className="app-info">
                                    <h3>{role === 'talent' ? app.jobs?.title : app.profiles?.username}</h3>
                                    <p className="sub-text">
                                        {role === 'talent'
                                            ? `Applied to: ${app.jobs?.company?.username || 'Company'}`
                                            : `Applied for: ${app.job_title} • ${app.profiles?.primary_skill || 'Talent'}`}
                                    </p>
                                    <span className="date">Applied: {new Date(app.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <div className="app-status">
                                {getStatusBadge(app.status)}
                            </div>
                        </div>
                    ))
                )}
            </div>

            <style>{`
                .apps-page { max-width: 900px; margin: 0 auto; }
                .page-header { margin-bottom: 2rem; }
                .page-header h1 { font-size: 2rem; margin-bottom: 0.5rem; }
                .page-header p { color: #888; }
                
                .apps-list { display: flex; flex-direction: column; gap: 1rem; }
                
                .app-card {
                    background: #111;
                    border: 1px solid #222;
                    border-radius: 12px;
                    padding: 1.5rem;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    transition: border-color 0.2s;
                }
                .app-card:hover { border-color: #444; }

                .app-main { display: flex; align-items: center; gap: 1rem; }
                .app-icon {
                    width: 48px;
                    height: 48px;
                    background: #1a1a1a;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #666;
                    font-size: 1.2rem;
                }
                .app-info h3 { margin: 0 0 0.3rem 0; font-size: 1.1rem; color: #fff; }
                .sub-text { color: #888; margin: 0; font-size: 0.9rem; }
                .date { font-size: 0.8rem; color: #555; margin-top: 4px; display: block; }

                .status-badge {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    padding: 6px 12px;
                    border-radius: 20px;
                    font-size: 0.85rem;
                    font-weight: 500;
                    text-transform: capitalize;
                }
                .status-badge.pending { background: rgba(241, 196, 15, 0.1); color: #f1c40f; border: 1px solid rgba(241, 196, 15, 0.2); }
                .status-badge.interview { background: rgba(52, 152, 219, 0.1); color: #3498db; border: 1px solid rgba(52, 152, 219, 0.2); }
                .status-badge.rejected { background: rgba(231, 76, 60, 0.1); color: #e74c3c; border: 1px solid rgba(231, 76, 60, 0.2); }
                .status-badge.hired { background: rgba(46, 204, 113, 0.1); color: #2ecc71; border: 1px solid rgba(46, 204, 113, 0.2); }

                .empty { color: #666; font-style: italic; }

                @media (max-width: 600px) {
                    .app-card { flex-direction: column; align-items: flex-start; gap: 1rem; }
                    .app-status { width: 100%; display: flex; justify-content: flex-end; }
                }
            `}</style>
        </div>
    );
};

export default Applications;
