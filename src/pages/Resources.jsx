import { FaBook, FaCode, FaGavel, FaUserGraduate, FaBuilding, FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import Card from '../components/Card';
import SEO from '../components/SEO';
import WhitepaperModal from '../components/WhitepaperModal';
import { useState } from 'react';

const Resources = () => {
    const [isWpModalOpen, setIsWpModalOpen] = useState(false);
    const resourceCategories = [
        {
            id: 'talent',
            title: 'For Talent',
            icon: <FaUserGraduate />,
            description: "Tools and guides to build your on-chain reputation and land your dream role.",
            links: [
                { text: "Web3 Career Guide", url: "#" },
                { text: "Optimizing Your On-Chain Profile", url: "#" },
                { text: "Skill Verification Documentation", url: "#" },
                { text: "Salary & Equity Benchmarks", url: "#" }
            ]
        },
        {
            id: 'founders',
            title: 'For Founders',
            icon: <FaBuilding />,
            description: "Playbooks for hiring, onboarding, and managing decentralized teams.",
            links: [
                { text: "The Web3 Hiring Handbook", url: "#" },
                { text: "Smart Contract Escrow Guide", url: "#" },
                { text: "Compensation Models for DAOs", url: "#" },
                { text: "Draft Employment Contracts", url: "#" }
            ]
        },
        {
            id: 'platform',
            title: 'Platform Documentation',
            icon: <FaBook />,
            description: "Technical specifications, whitepapers, and operational details of Hiring Plug.",
            links: [
                { text: "Hiring Plug Whitepaper v1.0", url: "/hiring-plug-whitepaper.pdf", external: true },
                { text: "Tokenomics & Fee Structure", url: "#" },
                { text: "Data Room", url: "#" },
                { text: "Terms of Service", url: "#" }
            ]
        },
        {
            id: 'dev',
            title: 'Open Development',
            icon: <FaCode />,
            description: "Contribute to the ecosystem. Code, governance, and community building.",
            links: [
                { text: "GitHub Repository", url: "https://github.com/Hiring-Plug/hiringpweb", external: true },
                { text: "Governance Forum", url: "#" },
                { text: "Bug Bounty Program", url: "#" },
                { text: "API Documentation", url: "#" }
            ]
        }
    ];

    return (
        <div className="resources-page">
            <WhitepaperModal isOpen={isWpModalOpen} onClose={() => setIsWpModalOpen(false)} />
            <SEO
                title="Resources - Web3 Hiring Knowledge Hub | Hiring Plug"
                description="Access guides, documentation, and tools for navigating the Web3 hiring landscape. The authoritative source for talent and founders."
                url="/resources"
            />

            <header className="resources-header">
                <div className="header-content">
                    <h1>Knowledge Hub</h1>
                    <p className="lead-text">
                        The authoritative source for navigating Web3 hiring, decentralized identity,
                        and the Hiring Plug ecosystem.
                    </p>
                </div>
            </header>

            <section className="resources-grid-container">
                <div className="resources-grid">
                    {resourceCategories.map((category) => (
                        <div key={category.id} className="resource-col">
                            <div className="category-header">
                                <span className="cat-icon">{category.icon}</span>
                                <h2>{category.title}</h2>
                            </div>
                            <p className="category-desc">{category.description}</p>

                            <div className="resource-list">
                                {category.links.map((link, index) => (
                                    <a
                                        key={index}
                                        href={link.url}
                                        className="resource-link"
                                        target={link.external ? "_blank" : "_self"}
                                        rel={link.external ? "noopener noreferrer" : ""}
                                        onClick={(e) => {
                                            if (link.url === '/hiring-plug-whitepaper.pdf') {
                                                e.preventDefault();
                                                setIsWpModalOpen(true);
                                            }
                                        }}
                                    >
                                        {link.text}
                                        {link.external && <FaExternalLinkAlt className="ext-icon" />}
                                    </a>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="newsletter-section">
                <div className="newsletter-box">
                    <h3>Stay Updated</h3>
                    <p>Receive the latest hiring benchmarks and protocol updates directly to your inbox.</p>
                    <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
                        <input type="email" placeholder="email@address.com" aria-label="Email Address" />
                        <button type="submit">Subscribe</button>
                    </form>
                </div>
            </section>

            <style>{`
                .resources-page {
                    min-height: 100vh;
                    background-color: #000;
                    color: #fff;
                    padding-top: 80px; /* Navbar spacing */
                }

                /* Header */
                .resources-header {
                    text-align: center;
                    padding: 4rem 20px;
                    background: linear-gradient(180deg, #111 0%, #000 100%);
                    border-bottom: 1px solid #1a1a1a;
                }

                .header-content h1 {
                    font-size: 3rem;
                    margin-bottom: 1rem;
                    font-weight: 700;
                    letter-spacing: -0.02em;
                }

                .lead-text {
                    color: #999;
                    font-size: 1.25rem;
                    max-width: 600px;
                    margin: 0 auto;
                    line-height: 1.6;
                }

                /* Grid Container */
                .resources-grid-container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 4rem 20px;
                }

                .resources-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 3rem;
                }

                /* Resource Column/Card */
                .resource-col {
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid #1a1a1a;
                    padding: 2rem;
                    border-radius: 8px;
                    transition: border-color 0.3s ease;
                }

                .resource-col:hover {
                    border-color: #333;
                }

                .category-header {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    margin-bottom: 1rem;
                }

                .cat-icon {
                    font-size: 1.5rem;
                    color: var(--primary-orange);
                    background: rgba(237, 80, 0, 0.1);
                    padding: 8px;
                    border-radius: 6px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .resource-col h2 {
                    font-size: 1.5rem;
                    font-weight: 600;
                    color: #fff;
                    margin: 0;
                }

                .category-desc {
                    color: #888;
                    font-size: 0.95rem;
                    margin-bottom: 2rem;
                    line-height: 1.6;
                    min-height: 3rem; /* Visual alignment */
                }

                /* Link List */
                .resource-list {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .resource-link {
                    display: block;
                    padding: 1rem;
                    background: #0a0a0a;
                    border: 1px solid #222;
                    border-radius: 6px;
                    color: #e0e0e0;
                    font-weight: 500;
                    transition: all 0.2s ease;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .resource-link:hover {
                    background: #111;
                    border-color: var(--primary-orange);
                    color: #fff;
                    transform: translateX(4px);
                }

                .ext-icon {
                    font-size: 0.8rem;
                    color: #666;
                }
                
                .resource-link:hover .ext-icon {
                    color: var(--primary-orange);
                }

                /* Newsletter */
                .newsletter-section {
                    padding: 4rem 20px;
                    border-top: 1px solid #1a1a1a;
                    background: #050505;
                }

                .newsletter-box {
                    max-width: 600px;
                    margin: 0 auto;
                    text-align: center;
                }

                .newsletter-box h3 {
                    margin-bottom: 0.5rem;
                    font-size: 1.25rem;
                    color: #fff;
                }

                .newsletter-box p {
                    color: #888;
                    margin-bottom: 1.5rem;
                }

                .newsletter-form {
                    display: flex;
                    gap: 0.5rem;
                }

                .newsletter-form input {
                    flex: 1;
                    padding: 0.8rem 1rem;
                    background: #111;
                    border: 1px solid #333;
                    border-radius: 4px;
                    color: #fff;
                }

                .newsletter-form input:focus {
                    outline: none;
                    border-color: var(--primary-orange);
                }

                .newsletter-form button {
                    padding: 0 1.5rem;
                    background: #fff;
                    color: #000;
                    font-weight: 600;
                    border-radius: 4px;
                    transition: background 0.3s;
                }

                .newsletter-form button:hover {
                    background: #e0e0e0;
                }

                @media (max-width: 768px) {
                    .resources-grid {
                        grid-template-columns: 1fr;
                    }
                    .header-content h1 {
                        font-size: 2.5rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default Resources;
