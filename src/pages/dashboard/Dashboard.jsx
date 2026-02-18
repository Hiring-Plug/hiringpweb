
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../supabaseClient';
// import { useData } from '../../context/DataContext'; // Assuming useData has some counts, or we fetch fresh
import { FaBolt, FaUserEdit, FaFolderOpen, FaChartLine, FaPlusCircle, FaUsers, FaEye, FaBriefcase } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import ManageJobs from './ManageJobs';

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const role = user?.user_metadata?.role || 'talent';

    // Stats State
    const [stats, setStats] = useState([
        { label: 'Applications', value: '0', color: '#4cd137', icon: <FaFolderOpen /> },
        { label: 'Profile Views', value: '0', color: '#3498db', icon: <FaEye /> },
        { label: role === 'project' ? 'Jobs Posted' : 'Saved Jobs', value: '0', color: '#f1c40f', icon: <FaBriefcase /> },
    ]);

    useEffect(() => {
        if (user) fetchStats();
    }, [user, role]);

    const fetchStats = async () => {
        try {
            // 1. Profile Views from Profile Table
            const { data: profile } = await supabase.from('profiles').select('views_count').eq('id', user.id).single();
            const views = profile?.views_count || 0;

            if (role === 'project') {
                // Project Stats: Applicants count, Job count

                // Job Count
                const { count: jobCount } = await supabase.from('jobs').select('*', { count: 'exact', head: true }).eq('project_id', user.id);

                // Applicants Count (Total for my jobs)
                // Need to get IDs of my jobs first
                const { data: myJobs } = await supabase.from('jobs').select('id').eq('project_id', user.id);
                const jobIds = myJobs?.map(j => j.id) || [];
                const { count: appCount } = await supabase.from('applications').select('*', { count: 'exact', head: true }).in('job_id', jobIds);

                setStats([
                    { label: 'Total Applicants', value: appCount || 0, color: '#4cd137', icon: <FaUsers /> },
                    { label: 'Profile Views', value: views, color: '#3498db', icon: <FaEye /> },
                    { label: 'Live Jobs', value: jobCount || 0, color: '#f1c40f', icon: <FaBriefcase /> },
                ]);

            } else {
                // Talent Stats: My Applications
                const { count: myApps } = await supabase.from('applications').select('*', { count: 'exact', head: true }).eq('applicant_id', user.id);

                setStats([
                    { label: 'Applications Sent', value: myApps || 0, color: '#4cd137', icon: <FaPaperPlaneIcon /> },
                    { label: 'Profile Views', value: views, color: '#3498db', icon: <FaEye /> },
                    { label: 'Saved Jobs', value: '0', color: '#f1c40f', icon: <FaHeartIcon /> },
                ]);
            }
        } catch (error) {
            console.error('Stats fetch error:', error);
        }
    };

    // Actions based on Role
    const getActions = () => {
        if (role === 'project') {
            return [
                {
                    icon: <FaPlusCircle />,
                    title: 'Post New Job',
                    desc: 'Create a new listing to find talent.',
                    link: '/app/jobs', // ideally opens modal or goes to create page
                    cta: 'Post Job',
                    variant: 'glow'
                },
                {
                    icon: <FaUsers />,
                    title: 'Check Applicants',
                    desc: 'Review candidates in your pipeline.',
                    link: '/app/applications',
                    cta: 'View Pipeline',
                    variant: 'primary'
                },
                {
                    icon: <FaUserEdit />,
                    title: 'Edit Company',
                    desc: 'Update your brand visuals and info.',
                    link: '/app/settings',
                    cta: 'Settings',
                    variant: 'secondary'
                }
            ];
        }
        // Talent Actions
        return [
            {
                icon: <FaBolt />,
                title: 'Find New Work',
                desc: 'Browse high-quality Web3 opportunities.',
                link: '/projects',
                cta: 'Browse Jobs',
                variant: 'glow'
            },
            {
                icon: <FaUserEdit />,
                title: 'Complete Profile',
                desc: 'Add your services and portfolio.',
                link: '/app/settings',
                cta: 'Edit Profile',
                variant: 'primary'
            },
            {
                icon: <FaFolderOpen />,
                title: 'My Applications',
                desc: 'Track the status of your active applications.',
                link: '/app/applications',
                cta: 'View Status',
                variant: 'secondary'
            },
        ];
    };

    const actions = getActions();

    return (
        <div className="dashboard-home">
            {/* Welcome Hero - Split Logic */}
            <div className="welcome-card">
                <div>
                    <h1>Welcome, <span className="highlight">{user?.user_metadata?.username || 'User'}</span></h1>
                    <p>
                        {role === 'project'
                            ? 'Manage your recruitment pipeline and company presence.'
                            : 'Your command center for managing your Web3 career.'}
                    </p>
                </div>
                <div className="stats-row">
                    {stats.map((stat, i) => (
                        <div key={i} className="stat-item">
                            <span className="stat-value" style={{ color: stat.color }}>{stat.value}</span>
                            <span className="stat-label">{stat.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Content Split */}
            <div className="dashboard-grid">
                <div className="main-col">
                    {role === 'project' && (
                        <div className="section-mb">
                            <ManageJobs />
                        </div>
                    )}

                    {/* For Talent: Maybe a different view (e.g. Recommended Jobs) - Keeping simple for now */}
                    {role === 'talent' && (
                        <div className="activity-feed">
                            <div className="section-header">
                                <h3>Recent Activity</h3>
                            </div>
                            <div className="empty-state">
                                <FaChartLine className="empty-icon" />
                                <p>No recent activity. Start applying to jobs!</p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="side-col">
                    <h2 className="section-title">Quick Actions</h2>
                    <div className="actions-list">
                        {actions.map((action, index) => (
                            <div key={index} className="action-card-mini">
                                <div className="card-icon">{action.icon}</div>
                                <div className="action-info">
                                    <h3>{action.title}</h3>
                                    <p>{action.desc}</p>
                                </div>
                                <Button
                                    size="sm"
                                    variant={action.variant || 'outline'}
                                    onClick={() => navigate(action.link)}
                                >
                                    {action.cta}
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style>{`
                .dashboard-home {
                    max-width: 1200px;
                    margin: 0 auto;
                }
                
                .welcome-card {
                    background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);
                    border: 1px solid #333;
                    border-radius: 12px;
                    padding: 2rem;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 2rem;
                    flex-wrap: wrap;
                    gap: 2rem;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                }
                .highlight { color: var(--primary-orange); }
                .welcome-card h1 { font-size: 2rem; margin: 0 0 0.5rem 0; }
                .welcome-card p { color: #888; margin: 0; }

                .stats-row { display: flex; gap: 3rem; }
                .stat-item { display: flex; flex-direction: column; align-items: center; }
                .stat-value { font-size: 2rem; font-weight: 700; }
                .stat-label { color: #666; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px; margin-top: 5px; }

                .dashboard-grid {
                    display: grid;
                    grid-template-columns: 1fr 350px;
                    gap: 2rem;
                }

                .section-mb { margin-bottom: 2rem; }
                .section-header h3 { margin: 0 0 1rem 0; font-size: 1.2rem; display: flex; align-items: center; gap: 10px; }

                /* Actions Side Column */
                .actions-list { display: flex; flex-direction: column; gap: 1rem; }
                .action-card-mini {
                    background: #111;
                    border: 1px solid #222;
                    border-radius: 10px;
                    padding: 1.2rem;
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    transition: border-color 0.2s;
                }
                .action-card-mini:hover { border-color: #444; }
                .card-icon { font-size: 1.5rem; color: var(--primary-orange); display: flex; align-items: center; gap: 10px; }
                .action-info h3 { margin: 0; font-size: 1rem; color: #fff; }
                .action-info p { margin: 5px 0 0 0; color: #777; font-size: 0.85rem; line-height: 1.4; }

                .activity-feed {
                    background: #111;
                    border: 1px solid #222;
                    border-radius: 12px;
                    padding: 2rem;
                    min-height: 200px;
                }
                .empty-state { text-align: center; color: #555; padding: 2rem; }
                .empty-icon { font-size: 3rem; margin-bottom: 1rem; opacity: 0.3; }

                @media (max-width: 900px) {
                    .dashboard-grid { grid-template-columns: 1fr; }
                    .stats-row { 
                        width: 100%; 
                        justify-content: space-between;
                        gap: 1rem;
                    }
                    .welcome-card { 
                        flex-direction: column; 
                        align-items: flex-start; 
                        padding: 1.5rem;
                        text-align: center;
                    }
                    .welcome-card h1 { font-size: 1.5rem; width: 100%; }
                    .welcome-card p { width: 100%; font-size: 0.9rem; }
                    .welcome-card > div:first-child { width: 100%; }
                }

                @media (max-width: 480px) {
                    .stats-row {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        width: 100%;
                        gap: 1.5rem;
                    }
                    .stat-value { font-size: 1.5rem; }
                    .stat-label { font-size: 0.7rem; }
                }
            `}</style>
        </div>
    );
};

// Simple icons
const FaPaperPlaneIcon = () => <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M476 3.2L12.5 270.6c-18.1 10.4-15.8 35.6 2.2 43.2L121 358.4l287.3-253.2c5.5-4.9 13.3 2.6 8.6 8.3L176 407v80.5c0 23.6 28.5 32.9 42.5 15.8L282 426l124.6 52.2c14.2 6 30.4-2.9 33-18.2l72-432C515 7.8 493.3-6.8 476 3.2z"></path></svg>;
const FaHeartIcon = () => <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z"></path></svg>;

export default Dashboard;
