import { useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';

const Projects = () => {
    const [filter, setFilter] = useState('All');
    const [selectedProject, setSelectedProject] = useState(null);

    const projects = [
        { id: 1, title: 'DeFi Protocol X', category: 'DeFi', role: 'Senior Rust Engineer', skills: ['Rust', 'Solana', 'Tokio'], status: 'Open' },
        { id: 2, title: 'NFT Marketplace Y', category: 'NFT', role: 'Frontend Lead', skills: ['React', 'Web3.js', 'Tailwind'], status: 'Open' },
        { id: 3, title: 'DAO Governance Z', category: 'DAO', role: 'Community Manager', skills: ['Discord', 'Twitter', 'Governance'], status: 'Open' },
        { id: 4, title: 'Layer 2 Solution', category: 'Infrastructure', role: 'Protocol Engineer', skills: ['Go', 'ZK-Rollups'], status: 'Coming Soon' },
        { id: 5, title: 'Play-to-Earn Game', category: 'GameFi', role: 'Unity Developer', skills: ['C#', 'Blockchain Integration'], status: 'Open' },
        { id: 6, title: 'Crypto Wallet App', category: 'DeFi', role: 'Mobile Developer', skills: ['React Native', 'Ethers.js'], status: 'Open' }
    ];

    const filteredProjects = filter === 'All' ? projects : projects.filter(p => p.category === filter);

    const handleApply = (project) => {
        setSelectedProject(project);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        alert(`Application sent for ${selectedProject.role} at ${selectedProject.title}!`);
        setSelectedProject(null);
    };

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
                        <div className="card-badge">{project.category}</div>
                        <h4 className="role-title">{project.role}</h4>

                        <div className="skills-container">
                            {project.skills.map(skill => (
                                <span key={skill} className="skill-tag">{skill}</span>
                            ))}
                        </div>

                        <div className="card-footer">
                            <span className={`status-text ${project.status === 'Open' ? 'open' : 'closed'}`}>
                                {project.status}
                            </span>
                            <Button
                                variant={project.status === 'Open' ? 'secondary' : 'primary'}
                                onClick={() => handleApply(project)}
                                disabled={project.status !== 'Open'}
                                className="apply-btn"
                            >
                                {project.status === 'Open' ? 'Apply Now' : 'Waitlist'}
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>

            <Modal
                isOpen={!!selectedProject}
                onClose={() => setSelectedProject(null)}
                title={`Apply for ${selectedProject?.role}`}
            >
                <form onSubmit={handleFormSubmit}>
                    <div className="modal-form-group">
                        <label>Your Name</label>
                        <input type="text" placeholder="Enter your name" required />
                    </div>
                    <div className="modal-form-group">
                        <label>Email / Contact</label>
                        <input type="text" placeholder="Email or Telegram handle" required />
                    </div>
                    <div className="modal-form-group">
                        <label>Portfolio / GitHub Profile</label>
                        <input type="url" placeholder="https://" required />
                    </div>
                    <div className="modal-form-group">
                        <label>Why are you a good fit?</label>
                        <textarea rows="4" placeholder="Briefly describe your experience..."></textarea>
                    </div>
                    <Button variant="primary" style={{ width: '100%' }}>Submit Application</Button>
                </form>
            </Modal>

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
                    gap: 0.8rem;
                    flex-wrap: wrap;
                }
                .filter-btn {
                    padding: 0.5rem 1.2rem;
                    background: #111;
                    color: #888;
                    border: 1px solid #333;
                    border-radius: 20px;
                    transition: all 0.3s;
                }
                .filter-btn:hover, .filter-btn.active {
                    background: var(--primary-orange);
                    color: white;
                    border-color: var(--primary-orange);
                }
                
                .projects-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
                    gap: 2rem;
                }
                .project-card {
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                    position: relative;
                }
                .card-badge {
                    position: absolute;
                    top: 1.5rem;
                    right: 1.5rem;
                    font-size: 0.8rem;
                    color: #666;
                    border: 1px solid #333;
                    padding: 0.2rem 0.6rem;
                    border-radius: 4px;
                }
                .role-title {
                    font-size: 1.2rem;
                    margin-bottom: 1rem;
                    color: var(--text-light);
                }
                .skills-container {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.5rem;
                    margin-bottom: 1.5rem;
                    flex-grow: 1;
                }
                .skill-tag {
                    background: rgba(255, 255, 255, 0.05);
                    padding: 0.3rem 0.6rem;
                    border-radius: 4px;
                    font-size: 0.8rem;
                    color: #aaa;
                }
                .card-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-top: 1px solid #222;
                    padding-top: 1rem;
                    margin-top: auto;
                }
                .status-text {
                    font-size: 0.9rem;
                    font-weight: 600;
                }
                .status-text.open { color: #4cd137; }
                .status-text.closed { color: #7f8fa6; }
                
                .apply-btn {
                    padding: 0.4rem 1rem !important;
                    font-size: 0.9rem !important;
                }
            `}</style>
        </div>
    );
};

export default Projects;
