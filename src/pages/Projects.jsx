import { useState } from 'react';
import { FaBitcoin, FaEthereum, FaLayerGroup, FaGamepad, FaWallet, FaGlobe, FaMapMarkerAlt, FaClock, FaMoneyBillWave, FaCheckCircle, FaPaperclip } from 'react-icons/fa';
import Button from '../components/Button';
import Modal from '../components/Modal';
import SEO from '../components/SEO';

const Projects = () => {
    const [filter, setFilter] = useState('All');
    const [selectedJob, setSelectedJob] = useState(null);
    const [applicationStep, setApplicationStep] = useState('initial'); // initial, customized, success

    const projects = [
        {
            id: 1,
            company: 'DeFi Protocol X',
            logo: <FaBitcoin />,
            role: 'Senior Rust Engineer',
            category: 'DeFi',
            location: 'Remote',
            type: 'Full-time',
            salary: '$120k - $180k',
            posted: '2 days ago',
            tags: ['Rust', 'Solana', 'Cryptography'],
            description: "We are building the next generation of decentralized exchanges. We need a Rust expert to optimize our matching engine and innovative AMM curves."
        },
        {
            id: 2,
            company: 'NFT Marketplace Y',
            logo: <FaEthereum />,
            role: 'Frontend Lead',
            category: 'NFT',
            location: 'Remote (US/EU)',
            type: 'Contract',
            salary: '$80 - $120 / hr',
            posted: '5 hours ago',
            tags: ['React', 'Web3.js', 'UI/UX'],
            description: "Leading the frontend architecture for a high-volume NFT marketplace. Experience with optimization and wallet integration is a must."
        },
        {
            id: 3,
            company: 'DAO Governance Z',
            logo: <FaGlobe />,
            role: 'Community Manager',
            category: 'DAO',
            location: 'Remote',
            type: 'Full-time',
            salary: '$60k - $90k + Tokens',
            posted: '1 week ago',
            tags: ['Discord', 'Governance', 'Marketing'],
            description: "Manage our global community of 50k+ members. You will oversee governance proposals, moderate discussions, and organize community calls."
        },
        {
            id: 4,
            company: 'Layer 2 Solution',
            logo: <FaLayerGroup />,
            role: 'Protocol Engineer',
            category: 'Infrastructure',
            location: 'Berlin / Remote',
            type: 'Full-time',
            salary: '$150k - $220k',
            posted: '3 days ago',
            tags: ['Go', 'ZK-Rollups', 'L2'],
            description: "Work on the core protocol of our ZK-Rollup solution. Deep understanding of Ethereum Virtual Machine (EVM) and zero-knowledge proofs required."
        },
        {
            id: 5,
            company: 'Play-to-Earn Game',
            logo: <FaGamepad />,
            role: 'Unity Developer',
            category: 'GameFi',
            location: 'Remote (Asia)',
            type: 'Contract',
            salary: '$4k - $6k / mo',
            posted: 'Just now',
            tags: ['C#', 'Unity', 'Web3'],
            description: "Integrate blockchain mechanics into a AAA-quality Unity game. Wallet connection, asset minting, and on-chain state management."
        },
        {
            id: 6,
            company: 'Crypto Wallet App',
            logo: <FaWallet />,
            role: 'Mobile Developer',
            category: 'DeFi',
            location: 'London / Hybrid',
            type: 'Full-time',
            salary: '£80k - £110k',
            posted: '4 days ago',
            tags: ['React Native', 'Mobile Security'],
            description: "Build a non-custodial wallet with a focus on security and user experience. Biometrics, key management, and multi-chain support."
        }
    ];

    const filteredProjects = filter === 'All' ? projects : projects.filter(p => p.category === filter);

    const handleOneClickApply = (e) => {
        e.preventDefault();
        setApplicationStep('success');
        setTimeout(() => {
            setSelectedJob(null);
            setApplicationStep('initial');
        }, 3000);
    };

    return (
        <div className="projects-page">
            <SEO
                title="Explore Projects & Web3 Jobs | Hiring Plug"
                description="Browse active Web3 jobs, from DeFi to GameFi. Connect with top protocols and startups in the decentralized ecosystem."
                url="/projects"
            />

            <header className="projects-header">
                <h1>Find Your Next <span className="highlight">Web3 Role</span></h1>
                <p className="subtitle">Curated opportunities from verified ecosystem partners.</p>

                <div className="filter-bar">
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

            <div className="jobs-container">
                {filteredProjects.map(job => (
                    <div key={job.id} className="job-card" onClick={() => setSelectedJob(job)}>
                        <div className="job-header">
                            <div className="company-logo">{job.logo}</div>
                            <div className="job-info">
                                <h3>{job.role}</h3>
                                <p className="company-name">{job.company}</p>
                            </div>
                        </div>

                        <div className="job-meta">
                            <span><FaMapMarkerAlt /> {job.location}</span>
                            <span><FaClock /> {job.type}</span>
                            <span><FaMoneyBillWave /> {job.salary}</span>
                        </div>

                        <div className="job-tags">
                            {job.tags.slice(0, 3).map(tag => (
                                <span key={tag} className="tag">{tag}</span>
                            ))}
                        </div>

                        <div className="job-footer">
                            <span className="posted-at">Posted {job.posted}</span>
                            <span className="view-btn">View Role</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Detailed Job Modal */}
            {selectedJob && (
                <Modal
                    isOpen={!!selectedJob}
                    onClose={() => {
                        setSelectedJob(null);
                        setApplicationStep('initial');
                    }}
                    title={null}
                >
                    <div className="job-modal-content">
                        <div className="modal-header">
                            <div className="modal-logo">{selectedJob.logo}</div>
                            <div>
                                <h2>{selectedJob.role}</h2>
                                <p className="modal-company">{selectedJob.company} • {selectedJob.location}</p>
                            </div>
                        </div>

                        <div className="modal-body">
                            <div className="modal-section">
                                <h4>Description</h4>
                                <p>{selectedJob.description}</p>
                            </div>

                            <div className="modal-section">
                                <h4>Key Skills</h4>
                                <div className="modal-tags">
                                    {selectedJob.tags.map(tag => (
                                        <span key={tag} className="tag">{tag}</span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="modal-application">
                            {applicationStep === 'success' ? (
                                <div className="success-message">
                                    <FaCheckCircle className="success-icon" />
                                    <h3>Application Sent!</h3>
                                    <p>The team at {selectedJob.company} will review your profile shortly.</p>
                                </div>
                            ) : (
                                <>
                                    {applicationStep === 'initial' ? (
                                        <div className="quick-apply-actions">
                                            <Button variant="primary" onClick={handleOneClickApply} className="full-width-btn">
                                                Fast Apply with Profile
                                            </Button>
                                            <p className="divider-text">or</p>
                                            <button className="text-btn" onClick={() => setApplicationStep('customized')}>
                                                Customize Application (CV / Cover Letter)
                                            </button>
                                        </div>
                                    ) : (
                                        <form className="custom-apply-form" onSubmit={handleOneClickApply}>
                                            <div className="form-group">
                                                <label>Cover Letter</label>
                                                <textarea rows="4" placeholder="Why are you a fit for this role?" required></textarea>
                                            </div>
                                            <div className="form-group">
                                                <label>Attach CV/Portfolio</label>
                                                <div className="file-input-wrapper">
                                                    <FaPaperclip /> <span>Upload Resume (PDF, DOCX)</span>
                                                    <input type="file" />
                                                </div>
                                            </div>
                                            <div className="form-actions">
                                                <button type="button" className="cancel-btn" onClick={() => setApplicationStep('initial')}>Cancel</button>
                                                <Button variant="primary">Submit Application</Button>
                                            </div>
                                        </form>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </Modal>
            )}

            <style>{`
                .projects-page {
                    max-width: 1000px;
                    margin: 0 auto;
                    padding: 4rem 20px;
                    min-height: 100vh;
                }

                /* Header */
                .projects-header {
                    text-align: center;
                    margin-bottom: 4rem;
                }
                .projects-header h1 {
                    font-size: 2.5rem;
                    margin-bottom: 1rem;
                }
                .highlight {
                    color: var(--primary-orange);
                    background: -webkit-linear-gradient(45deg, var(--primary-orange), #ff8c00);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .subtitle {
                    color: #888;
                    margin-bottom: 2.5rem;
                    font-size: 1.1rem;
                }

                .filter-bar {
                    display: flex;
                    justify-content: center;
                    gap: 0.8rem;
                    flex-wrap: wrap;
                }
                .filter-btn {
                    padding: 0.6rem 1.2rem;
                    background: rgba(255,255,255,0.05);
                    border: 1px solid #333;
                    border-radius: 50px;
                    color: #aaa;
                    font-size: 0.9rem;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .filter-btn:hover, .filter-btn.active {
                    background: var(--primary-orange);
                    color: #fff;
                    border-color: var(--primary-orange);
                }

                /* Jobs Grid */
                .jobs-container {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 1.5rem;
                }

                .job-card {
                    background: #0a0a0a;
                    border: 1px solid #222;
                    border-radius: 12px;
                    padding: 1.5rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    flex-direction: column;
                    position: relative;
                    overflow: hidden;
                }
                .job-card:hover {
                    border-color: #444;
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(0,0,0,0.4);
                }
                
                .job-header {
                    display: flex;
                    align-items: flex-start;
                    gap: 1rem;
                    margin-bottom: 1rem;
                }
                .company-logo {
                    width: 48px;
                    height: 48px;
                    background: #1a1a1a;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.5rem;
                    color: var(--primary-orange);
                    flex-shrink: 0;
                }
                .job-info h3 {
                    font-size: 1.1rem;
                    margin-bottom: 0.25rem;
                    color: #fff;
                }
                .company-name {
                    color: #888;
                    font-size: 0.9rem;
                }

                .job-meta {
                    display: flex;
                    gap: 1rem;
                    font-size: 0.85rem;
                    color: #777;
                    margin-bottom: 1rem;
                    flex-wrap: wrap;
                }
                .job-meta span {
                    display: flex;
                    align-items: center;
                    gap: 0.4rem;
                }

                .job-tags {
                    display: flex;
                    gap: 0.5rem;
                    margin-bottom: 1.5rem;
                    flex-wrap: wrap;
                }
                .tag {
                    background: rgba(255,255,255,0.05);
                    padding: 0.25rem 0.6rem;
                    border-radius: 4px;
                    font-size: 0.75rem;
                    color: #aaa;
                }

                .job-footer {
                    margin-top: auto;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-top: 1px solid #1a1a1a;
                    padding-top: 1rem;
                }
                .posted-at {
                    font-size: 0.8rem;
                    color: #555;
                }
                .view-btn {
                    color: var(--primary-orange);
                    font-weight: 500;
                    font-size: 0.9rem;
                }

                /* Modal Styles */
                .job-modal-content {
                    color: #fff;
                }
                .modal-header {
                    display: flex;
                    gap: 1.2rem;
                    align-items: center;
                    border-bottom: 1px solid #222;
                    padding-bottom: 1.5rem;
                    margin-bottom: 1.5rem;
                }
                .modal-logo {
                    width: 64px;
                    height: 64px;
                    background: #111;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 2rem;
                    color: var(--primary-orange);
                }
                .modal-company {
                    color: #888;
                    font-size: 1rem;
                    margin-top: 0.25rem;
                }
                
                .modal-body {
                    margin-bottom: 2rem;
                }
                .modal-section {
                    margin-bottom: 1.5rem;
                }
                .modal-section h4 {
                    font-size: 0.9rem;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    color: #666;
                    margin-bottom: 0.8rem;
                }
                .modal-section p {
                    line-height: 1.6;
                    color: #ccc;
                }
                .modal-tags {
                    display: flex;
                    gap: 0.5rem;
                }

                /* Application Section */
                .modal-application {
                    background: #0a0a0a;
                    border: 1px solid #222;
                    border-radius: 8px;
                    padding: 1.5rem;
                }
                .quick-apply-actions {
                    text-align: center;
                }
                .full-width-btn {
                    width: 100%;
                    padding: 0.8rem !important;
                    font-size: 1rem !important;
                }
                .divider-text {
                    margin: 0.8rem 0;
                    color: #444;
                    font-size: 0.9rem;
                    position: relative;
                }
                .text-btn {
                    background: none;
                    border: none;
                    color: #888;
                    text-decoration: underline;
                    cursor: pointer;
                    font-size: 0.9rem;
                }
                .text-btn:hover {
                    color: #fff;
                }

                /* Success State */
                .success-message {
                    text-align: center;
                    padding: 1rem;
                }
                .success-icon {
                    font-size: 3rem;
                    color: #4cd137;
                    margin-bottom: 1rem;
                }

                /* Custom Form */
                .custom-apply-form {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                .form-group label {
                    display: block;
                    font-size: 0.9rem;
                    color: #aaa;
                    margin-bottom: 0.5rem;
                }
                .form-group textarea {
                    width: 100%;
                    background: #111;
                    border: 1px solid #333;
                    border-radius: 6px;
                    padding: 0.8rem;
                    color: #fff;
                    resize: vertical;
                }
                .file-input-wrapper {
                    border: 1px dashed #444;
                    padding: 1rem;
                    text-align: center;
                    border-radius: 6px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    color: #888;
                    position: relative;
                }
                .file-input-wrapper input {
                    position: absolute;
                    opacity: 0;
                    width: 100%;
                    height: 100%;
                    top: 0; left: 0; cursor: pointer;
                }
                .form-actions {
                    display: flex;
                    justify-content: flex-end;
                    gap: 1rem;
                    margin-top: 0.5rem;
                }
                .cancel-btn {
                    background: none;
                    border: 1px solid #333;
                    color: #aaa;
                    padding: 0.6rem 1.2rem;
                    border-radius: 4px;
                }

                @media (max-width: 600px) {
                    .projects-header h1 {
                        font-size: 2rem;
                    }
                    .modal-header {
                        flex-direction: column;
                        text-align: center;
                    }
                }
            `}</style>
        </div>
    );
};

export default Projects;
