
import { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/Button';
import { FaMapMarkerAlt, FaBriefcase, FaMoneyBillWave } from 'react-icons/fa';

const AppProjects = () => {
    const { projects, getIconComponent, loading, error } = useData();
    const { user } = useAuth();
    const [filter, setFilter] = useState('All');

    // Filter to show only Live jobs
    const liveJobs = projects.filter(p => !String(p.id).startsWith('mock-'));

    const renderLogo = (job) => {
        if (job.logoUrl) {
            return <img src={job.logoUrl} alt={job.company} className="company-logo-img" />;
        }
        const IconComponent = getIconComponent(job.logoIcon);
        return <IconComponent />;
    };

    const handleApply = (company) => {
        alert(`Applying to ${company} as ${user?.user_metadata?.username || 'Guest'}...`);
    };

    return (
        <div className="app-projects-page">
            <h1 className="page-title">Browse Ecosystem Projects</h1>

            {error && <div className="error-msg">{error}</div>}

            <div className="projects-list">
                {loading ? (
                    <p>Loading projects...</p>
                ) : liveJobs.length > 0 ? (
                    liveJobs.map(job => (
                        <div key={job.id} className="job-row">
                            <div className="job-logo">
                                {renderLogo(job)}
                            </div>
                            <div className="job-main-info">
                                <h3>{job.role}</h3>
                                <span className="company-name">{job.company}</span>
                            </div>
                            <div className="job-meta">
                                <span className="meta-tag"><FaBriefcase /> {job.type}</span>
                                <span className="meta-tag"><FaMapMarkerAlt /> {job.location}</span>
                                <span className="meta-tag salary"><FaMoneyBillWave /> {job.salary}</span>
                            </div>
                            <div className="job-action">
                                <Button variant="outline" onClick={() => handleApply(job.company)}>
                                    Apply
                                </Button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="empty-state">
                        <FaBriefcase style={{ fontSize: '3rem', opacity: 0.1, marginBottom: '1rem' }} />
                        <p>No live projects found. Check back later!</p>
                    </div>
                )}
            </div>

            <style>{`
                .app-projects-page {
                    max-width: 1000px;
                    margin: 0 auto;
                }
                .page-title { margin-bottom: 2rem; }

                .job-row {
                    display: flex;
                    align-items: center;
                    background: #111;
                    border: 1px solid #222;
                    border-radius: 12px;
                    padding: 1.5rem;
                    margin-bottom: 1rem;
                    transition: border-color 0.2s;
                }
                .job-row:hover { border-color: #444; }

                .job-logo {
                    width: 50px;
                    height: 50px;
                    background: #222;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.8rem;
                    color: var(--primary-orange);
                    margin-right: 1.5rem;
                    flex-shrink: 0;
                    overflow: hidden;
                }
                .company-logo-img { width: 100%; height: 100%; object-fit: cover; }

                .job-main-info {
                    flex: 1;
                }
                .job-main-info h3 { margin-bottom: 0.2rem; font-size: 1.1rem; }
                .company-name { color: #888; font-size: 0.9rem; }

                .job-meta {
                    display: flex;
                    gap: 1rem;
                    margin-right: 2rem;
                }
                .meta-tag {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    color: #aaa;
                    font-size: 0.9rem;
                    background: rgba(255,255,255,0.05);
                    padding: 4px 10px;
                    border-radius: 50px;
                }
                .meta-tag.salary {
                    color: #4cd137;
                    background: rgba(76, 209, 55, 0.1);
                }

                @media (max-width: 768px) {
                    .job-row { flex-direction: column; align-items: flex-start; gap: 1rem; }
                    .job-meta { flex-wrap: wrap; margin-right: 0; }
                    .job-action { width: 100%; }
                    .job-action button { width: 100%; }
                }
            `}</style>
        </div>
    );
};

export default AppProjects;
