import { useNavigate } from 'react-router-dom';
import { FaFingerprint, FaGlobe, FaFileContract, FaUsers, FaGithub, FaArrowRight, FaHandshake, FaClipboardCheck, FaGraduationCap, FaBriefcase, FaMedal, FaChartPie, FaUserTie } from 'react-icons/fa';
import Button from '../components/Button';
import Card from '../components/Card';
import SEO from '../components/SEO';

const Solutions = () => {
    const navigate = useNavigate();

    const solutions = [
        {
            id: 1,
            icon: <FaFingerprint />,
            title: "On-Chain Verification",
            description: "Immutable proof of skills and work history. Eliminate fraud with verifiable credentials.",
            link: "/about"
        },
        {
            id: 2,
            icon: <FaGlobe />,
            title: "Decentralized Talent Pool",
            description: "Access a borderless network of pre-vetted Web3 professionals ready to deploy.",
            link: "/join"
        },
        {
            id: 3,
            icon: <FaFileContract />,
            title: "Smart Contract Escrows",
            description: "Trustless payment automation. Funds are released only when milestones are met.",
            link: "/about"
        },
        {
            id: 4,
            icon: <FaUsers />,
            title: "Community Governance",
            description: "A platform owned by its users. Token holders vote on roadmap and feature updates.",
            link: "/about"
        }
    ];

    return (
        <div className="solutions-page">
            <SEO
                title="Solutions - Decentralized Hiring Infrastructure | Hiring Plug"
                description="Discover how Hiring Plug's on-chain verification and decentralized talent pool solve Web3 hiring challenges."
                url="/solutions"
            />

            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <h1 className="hero-title">Solving the <span className="highlight">Web3 Talent Paradox</span></h1>
                    <p className="hero-sub">
                        Traditional hiring meets blockchain innovation. valid proof of skills, instant global payments,
                        and a trustless environment for talent and founders.
                    </p>
                    <div className="hero-actions">
                        <Button variant="primary" onClick={() => navigate('/join')}>Get Started</Button>
                        <Button variant="secondary" onClick={() => navigate('/about')}>Learn More</Button>
                    </div>
                </div>
                <div className="hero-visuals">
                    {/* Abstract Visual Representation */}
                    <div className="abstract-orb"></div>
                    <div className="grid-lines"></div>
                </div>
            </section>

            {/* Solutions Grid */}
            <section className="solutions-container">
                <h2 className="section-title">Infrastructure for the Future of Work</h2>
                <div className="solutions-grid">
                    {solutions.map((sol) => (
                        <Card key={sol.id} className="solution-card" title={null}>
                            <div className="card-icon-wrapper">{sol.icon}</div>
                            <h3>{sol.title}</h3>
                            <p>{sol.description}</p>
                            <div className="card-links">
                                <span className="learn-more" onClick={() => navigate(sol.link)}>
                                    Learn more <FaArrowRight className="arrow-icon" />
                                </span>
                            </div>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Services Section (Replicated) */}
            <section className="solutions-container">
                <h2 className="section-title">Our Services</h2>
                <div className="solutions-grid">
                    <Card className="solution-card" title={null}>
                        <div className="card-icon-wrapper"><FaHandshake /></div>
                        <h3>Hiring Connect</h3>
                        <p>Seamlessly link with top-tier talent and opportunities.</p>
                    </Card>
                    <Card className="solution-card" title={null}>
                        <div className="card-icon-wrapper"><FaClipboardCheck /></div>
                        <h3>Tests & Assessments</h3>
                        <p>Verify skills with trusted, standardized assessments.</p>
                    </Card>
                    <Card className="solution-card" title={null}>
                        <div className="card-icon-wrapper"><FaGraduationCap /></div>
                        <h3>Web3 Courses</h3>
                        <p>Learn, upskill, and grow with specialized curriculum.</p>
                    </Card>
                    <Card className="solution-card" title={null}>
                        <div className="card-icon-wrapper"><FaBriefcase /></div>
                        <h3>Job Board</h3>
                        <p>Find your next big opportunity or perfect candidate.</p>
                    </Card>
                    <Card className="solution-card" title={null}>
                        <div className="card-icon-wrapper"><FaGlobe /></div>
                        <h3>Talent Marketplace</h3>
                        <p>A global hub connecting skilled professionals worldwide.</p>
                    </Card>
                    <Card className="solution-card" title={null}>
                        <div className="card-icon-wrapper"><FaMedal /></div>
                        <h3>NFT Badges</h3>
                        <p>Earn verifiable, on-chain credentials for your achievements.</p>
                    </Card>
                    <Card className="solution-card" title={null}>
                        <div className="card-icon-wrapper"><FaChartPie /></div>
                        <h3>HR Analytics</h3>
                        <p>Data-driven insights for smarter hiring decisions.</p>
                    </Card>
                    <Card className="solution-card" title={null}>
                        <div className="card-icon-wrapper"><FaUserTie /></div>
                        <h3>Direct Hire</h3>
                        <p>Connect directly and hire instantly without barriers.</p>
                    </Card>
                </div>
                <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                    <Button variant="secondary" onClick={() => navigate('/about')}>Learn More</Button>
                </div>
            </section>

            {/* Credibility & Transparency */}
            <section className="credibility-section">
                <div className="credibility-content">
                    <h2>Built on <span className="highlight-white">Open Standards</span></h2>
                    <p className="credibility-text">
                        We believe in radical transparency. Our smart contracts are verified, our roadmap is public,
                        and our community shapes the future of the platform.
                    </p>
                    <div className="credibility-actions">
                        <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="github-link">
                            <FaGithub className="github-icon" /> View on GitHub
                        </a>
                        <span className="divider">|</span>
                        <a href="/hiring-plug-whitepaper.pdf" target="_blank" rel="noopener noreferrer" className="whitepaper-link">Read Whitepaper</a>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="cta-section">
                <h2>Ready to Deploy?</h2>
                <p>Join the ecosystem that's redefining how the world works together.</p>
                <div className="cta-buttons">
                    <Button variant="primary" onClick={() => navigate('/join')}>Join the Network</Button>
                    <Button variant="secondary" onClick={() => navigate('/projects')}>Explore Projects</Button>
                </div>
            </section>

            <style>{`
                .solutions-page {
                    min-height: 100vh;
                    background-color: #000;
                    color: #fff;
                    overflow-x: hidden;
                }

                /* Hero Section */
                .hero-section {
                    position: relative;
                    min-height: 80vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                    padding: 80px 20px;
                    background: radial-gradient(circle at 50% 30%, #1a1a1a 0%, #000 70%);
                    overflow: hidden;
                }

                .hero-content {
                    z-index: 2;
                    max-width: 900px;
                    margin: 0 auto;
                }

                .hero-title {
                    font-size: 3.5rem;
                    line-height: 1.1;
                    margin-bottom: 1.5rem;
                    letter-spacing: -0.02em;
                }

                .highlight {
                    color: var(--primary-orange);
                    background: -webkit-linear-gradient(45deg, var(--primary-orange), #ff8c00);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .hero-sub {
                    font-size: 1.25rem;
                    color: #aaa;
                    margin-bottom: 2.5rem;
                    line-height: 1.6;
                    max-width: 700px;
                    margin-left: auto;
                    margin-right: auto;
                }

                .hero-actions {
                    display: flex;
                    gap: 1.5rem;
                    justify-content: center;
                }

                /* Abstract Visuals */
                .abstract-orb {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 600px;
                    height: 600px;
                    background: radial-gradient(circle, rgba(237, 80, 0, 0.15) 0%, rgba(0,0,0,0) 70%);
                    border-radius: 50%;
                    z-index: 1;
                    filter: blur(60px);
                    animation: pulse 8s infinite alternate;
                }

                @keyframes pulse {
                    0% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
                    100% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.8; }
                }

                .grid-lines {
                    position: absolute;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background-image: linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
                                    linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
                    background-size: 50px 50px;
                    z-index: 0;
                    mask-image: radial-gradient(circle at center, black 40%, transparent 80%);
                }

                /* Solutions Grid */
                .solutions-container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 4rem 20px;
                    position: relative;
                    z-index: 2;
                }

                .section-title {
                    text-align: center;
                    font-size: 2.5rem;
                    margin-bottom: 3rem;
                    background: -webkit-linear-gradient(90deg, #fff, #888);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .solutions-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    gap: 2rem;
                }

                .solution-card {
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    padding: 2rem;
                    transition: all 0.4s ease;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                }

                .solution-card:hover {
                    transform: translateY(-5px);
                    border-color: var(--primary-orange);
                    background: rgba(255, 255, 255, 0.05);
                    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                }

                .card-icon-wrapper {
                    font-size: 2.5rem;
                    color: var(--primary-orange);
                    margin-bottom: 1.5rem;
                }

                .solution-card h3 {
                    margin-bottom: 1rem;
                    font-size: 1.5rem;
                    color: #fff;
                }

                .solution-card p {
                    color: #aaa;
                    line-height: 1.6;
                    margin-bottom: 1.5rem;
                    flex-grow: 1;
                }

                .card-links {
                    margin-top: auto;
                }

                .learn-more {
                    color: #fff;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.9rem;
                    transition: color 0.3s;
                }

                .learn-more:hover {
                    color: var(--primary-orange);
                }

                .arrow-icon {
                    font-size: 0.8rem;
                    transition: transform 0.3s;
                }

                .learn-more:hover .arrow-icon {
                    transform: translateX(5px);
                }

                /* Credibility Section */
                .credibility-section {
                    background: linear-gradient(180deg, #000 0%, #0a0a0a 100%);
                    padding: 6rem 20px;
                    text-align: center;
                    border-bottom: 1px solid #111;
                }

                .credibility-content {
                    max-width: 800px;
                    margin: 0 auto;
                }

                .credibility-content h2 {
                    font-size: 2.5rem;
                    color: #888;
                    margin-bottom: 1.5rem;
                }

                .highlight-white {
                    color: #fff;
                }

                .credibility-text {
                    font-size: 1.2rem;
                    color: #ccc;
                    margin-bottom: 2.5rem;
                }

                .credibility-actions {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 1.5rem;
                    font-size: 1.1rem;
                }

                .github-link, .whitepaper-link {
                    color: #fff;
                    text-decoration: none;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    transition: color 0.3s;
                }

                .github-link:hover, .whitepaper-link:hover {
                    color: var(--primary-orange);
                }

                .divider {
                    color: #333;
                }

                /* CTA Section */
                .cta-section {
                    padding: 6rem 20px;
                    text-align: center;
                    background: #000;
                }

                .cta-section h2 {
                    font-size: 3rem;
                    margin-bottom: 1rem;
                    color: #fff;
                }

                .cta-section p {
                    color: #888;
                    font-size: 1.2rem;
                    margin-bottom: 2.5rem;
                }

                .cta-buttons {
                    display: flex;
                    gap: 1.5rem;
                    justify-content: center;
                }

                @media (max-width: 768px) {
                    .hero-title {
                        font-size: 2.5rem;
                    }
                    .hero-actions {
                        flex-direction: column;
                    }
                    .section-title {
                        font-size: 2rem;
                    }
                    .cta-buttons {
                        flex-direction: column;
                    }
                }
            `}</style>
        </div>
    );
};

export default Solutions;
