import { useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';

const Projects = () => {
    const [filter, setFilter] = useState('All');

    const projects = [
        { id: 1, title: 'DeFi Protocol X', category: 'DeFi', description: 'Looking for a Senior Rust Engineer to build our core AMM.', salary: '$120k - $180k' },
        { id: 2, title: 'NFT Marketplace Y', category: 'NFT', description: 'Frontend Developer needed for React/Next.js implementation.', salary: '$80k - $120k' },
        { id: 3, title: 'DAO Governance Z', category: 'DAO', description: 'Community Manager to lead our governance forum discussions.', salary: '$60k - $90k' },
        { id: 4, title: 'Layer 2 Solution', category: 'Infrastructure', description: 'Protocol Engineer needed for ZK-Rollup optimization.', salary: '$150k - $220k' },
        { id: 5, title: 'Play-to-Earn Game', category: 'GameFi', description: 'Unity Developer for blockchain integration.', salary: '$100k - $140k' },
        { id: 6, title: 'Crypto Wallet App', category: 'DeFi', description: 'Mobile Developer (React Native) for non-custodial wallet.', salary: '$90k - $130k' }
    ];

    const filteredProjects = filter === 'All' ? projects : projects.filter(p => p.category === filter);

    return (
        <div className="projects-page">
            <header className="projects-header">
                <h1>Explore Opportunities</h1>
                <div className="filters">
                    {['All', 'DeFi', 'NFT', 'DAO', 'Infrastructure', 'GameFi'].map(category => (
                        <button
                            key={category}
                            className={`filter-btn ${filter === category ? 'active' : ''}`}
                            onClick={() => setFilter(category)}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </header>

            <div className="projects-grid">
                {filteredProjects.map(project => (
                    <Card key={project.id} title={project.title} className="project-card">
                        <span className="badge">{project.category}</span>
                        <p className="description">{project.description}</p>
                        <p className="salary">{project.salary}</p>
                        <Button variant="secondary" className="apply-btn">Apply Now</Button>
                    </Card>
                ))}
            </div>

            <style>{`
                .projects-page {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 2rem 20px;
                    min-height: 100vh;
                }
                .projects-header {
                    text-align: center;
                    margin-bottom: 3rem;
                }
                .projects-header h1 {
                    margin-bottom: 2rem;
                }
                .filters {
                    display: flex;
                    justify-content: center;
                    gap: 1rem;
                    flex-wrap: wrap;
                }
                .filter-btn {
                    padding: 0.5rem 1rem;
                    background: #333;
                    color: #ccc;
                    border-radius: 20px;
                    transition: all 0.3s;
                }
                .filter-btn:hover, .filter-btn.active {
                    background: var(--primary-orange);
                    color: white;
                }
                .projects-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 2rem;
                }
                .project-card {
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                }
                .badge {
                    display: inline-block;
                    background: rgba(255, 122, 0, 0.2);
                    color: var(--primary-orange);
                    padding: 0.2rem 0.8rem;
                    border-radius: 4px;
                    font-size: 0.8rem;
                    margin-bottom: 1rem;
                    width: fit-content;
                }
                .description {
                    flex-grow: 1;
                    margin-bottom: 1rem;
                    color: var(--text-dim);
                }
                .salary {
                    font-weight: bold;
                    margin-bottom: 1rem;
                    color: var(--text-light);
                }
                .apply-btn {
                    width: 100%;
                }
            `}</style>
        </div>
    );
};

export default Projects;
