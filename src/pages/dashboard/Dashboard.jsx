
import { useAuth } from '../../context/AuthContext';
import { FaBolt, FaUserEdit, FaFolderOpen, FaChartLine } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { user } = useAuth();

    const stats = [
        { label: 'Applications', value: '0', color: '#4cd137' },
        { label: 'Profile Views', value: '0', color: '#3498db' },
        { label: 'Saved Jobs', value: '0', color: '#f1c40f' },
    ];

    const actions = [
        {
            icon: <FaBolt />,
            title: 'Find New Work',
            desc: 'Browse high-quality Web3 opportunities.',
            link: '/projects',
            cta: 'Browse Jobs'
        },
        {
            icon: <FaUserEdit />,
            title: 'Complete Profile',
            desc: 'Add your skills and portfolio to stand out.',
            link: '/app/profile',
            cta: 'Edit Profile'
        },
        {
            icon: <FaFolderOpen />,
            title: 'My Applications',
            desc: 'Track the status of your active applications.',
            link: '/app/dashboard', // Placeholder
            cta: 'View Status'
        },
    ];

    return (
        <div className="dashboard-home">
            {/* Welcome Hero */}
            <div className="welcome-card">
                <div>
                    <h1>Welcome back, <span className="highlight">{user?.user_metadata?.username || 'Builder'}</span></h1>
                    <p>Your command center for managing your Web3 career.</p>
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

            {/* Quick Actions Grid */}
            <h2 className="section-title">Quick Actions</h2>
            <div className="actions-grid">
                {actions.map((action, index) => (
                    <div key={index} className="action-card">
                        <div className="card-icon">{action.icon}</div>
                        <h3>{action.title}</h3>
                        <p>{action.desc}</p>
                        <Link to={action.link} className="card-cta">
                            {action.cta} &rarr;
                        </Link>
                    </div>
                ))}
            </div>

            {/* Activity Feed (Placeholder) */}
            <h2 className="section-title">Recent Activity</h2>
            <div className="activity-feed">
                <div className="empty-state">
                    <FaChartLine className="empty-icon" />
                    <p>No recent activity. Start applying to jobs!</p>
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
                    padding: 2.5rem;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 2.5rem;
                    flex-wrap: wrap;
                    gap: 2rem;
                }
                .highlight {
                    color: var(--primary-orange);
                }
                .welcome-card h1 {
                    font-size: 2rem;
                    margin-bottom: 0.5rem;
                }
                .welcome-card p {
                    color: #888;
                }

                .stats-row {
                    display: flex;
                    gap: 3rem;
                }
                .stat-item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
                .stat-value {
                    font-size: 2rem;
                    font-weight: 700;
                }
                .stat-label {
                    color: #666;
                    font-size: 0.9rem;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                .section-title {
                    font-size: 1.2rem;
                    margin-bottom: 1.5rem;
                    color: #ccc;
                    border-left: 3px solid var(--primary-orange);
                    padding-left: 10px;
                }

                .actions-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 1.5rem;
                    margin-bottom: 3rem;
                }
                .action-card {
                    background: #111;
                    border: 1px solid #222;
                    border-radius: 12px;
                    padding: 1.5rem;
                    transition: all 0.2s;
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                }
                .action-card:hover {
                    border-color: var(--primary-orange);
                    transform: translateY(-2px);
                    box-shadow: 0 5px 20px rgba(0,0,0,0.3);
                }
                .card-icon {
                    font-size: 1.5rem;
                    color: var(--primary-orange);
                    margin-bottom: 1rem;
                    background: rgba(237, 80, 0, 0.1);
                    padding: 10px;
                    border-radius: 8px;
                }
                .action-card h3 {
                    margin-bottom: 0.5rem;
                    font-size: 1.2rem;
                }
                .action-card p {
                    color: #888;
                    font-size: 0.95rem;
                    margin-bottom: 1.5rem;
                    flex-grow: 1;
                }
                .card-cta {
                    color: #fff;
                    text-decoration: none;
                    font-weight: 600;
                    font-size: 0.9rem;
                    display: flex;
                    align-items: center;
                    gap: 5px;
                }
                .card-cta:hover { color: var(--primary-orange); }

                .activity-feed {
                    background: #111;
                    border: 1px solid #222;
                    border-radius: 12px;
                    padding: 3rem;
                    text-align: center;
                }
                .empty-state {
                    color: #444;
                }
                .empty-icon {
                    font-size: 3rem;
                    margin-bottom: 1rem;
                    opacity: 0.5;
                }
            `}</style>
        </div>
    );
};

export default Dashboard;
