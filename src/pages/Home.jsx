import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Card from '../components/Card';
import { FaNetworkWired, FaRocket, FaHandshake } from 'react-icons/fa';
import heroBg from '../assets/608.jpg';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Plug Into the <span className="highlight-text">Future of Hiring</span></h1>
          <p className="hero-sub">
            Hiring Plug connects communities to real opportunities in Web3.
            Easy, transparent, and decentralized.
          </p>
          <div className="hero-actions">
            <Button onClick={() => navigate('/join')} variant="primary" className="btn-join">Join the Network</Button>
            <Button onClick={() => navigate('/projects')} variant="secondary" className="btn-explore">Explore Projects</Button>
          </div>
        </div>
      </section>

      {/* About Summary */}
      <section className="section-container about-preview">
        <h2>Bridging Talent & Opportunity</h2>
        <div className="about-text">
          <p>
            Hiring Plug is a Web3-powered hiring ecosystem that connects its community to real
            opportunities across projects and companies. We are bridging blockchain transparency
            with career growth to make hiring fair and accessible to all.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-container how-it-works">
        <h2>How It Works</h2>
        <div className="card-grid">
          <Card title="Join the Community" className="process-card">
            <FaNetworkWired className="card-icon" />
            <p>Become part of a growing Web3 talent network. Verified on-chain.</p>
          </Card>
          <Card title="Discover Opportunities" className="process-card">
            <FaRocket className="card-icon" />
            <p>Access real roles and projects from Web3 teams and DAOs.</p>
          </Card>
          <Card title="Get Plugged In" className="process-card">
            <FaHandshake className="card-icon" />
            <p>Connect, contribute, and grow your career without borders.</p>
          </Card>
        </div>
      </section>

      {/* Who It's For */}
      <section className="section-container who-its-for">
        <h2>Who's Plugging In?</h2>
        <div className="audience-grid">
          <div className="audience-card">
            <h3>Developers</h3>
            <p>Smart Contract, Frontend, ZK Engineers</p>
          </div>
          <div className="audience-card">
            <h3>Designers</h3>
            <p>UI/UX, 3D Artists, Brand Designers</p>
          </div>
          <div className="audience-card">
            <h3>Community</h3>
            <p>Moderators, Managers, Growth Hackers</p>
          </div>
          <div className="audience-card">
            <h3>Startups</h3>
            <p>DAOs, DeFi Protocols, NFT Collections</p>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      {/* Value Proposition */}
      <section className="section-container value-prop">
        <span className="feature-label">Features</span>
        <h2>Why hiring plug stands out</h2>
        <p className="value-desc">
          We are redefining talent acquisition through innovative Web3 solutions.
        </p>
        <div className="value-actions">
          <Button variant="secondary" className="btn-discover">Discover more</Button>
          <a href="/join" className="link-opportunities">See opportunities</a>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="cta-banner">
        <h2>Ready to<br />Plug in</h2>
        <p className="cta-sub">
          Transform your career journey with Web3 opportunities that matter.
        </p>
        <div className="cta-buttons">
          <Button onClick={() => navigate('/join')} variant="primary">Get started</Button>
          <Button onClick={() => navigate('/about')} variant="secondary" className="btn-learn-more">Learn more</Button>
        </div>
      </section>

      <style>{`
                .home-page {
                    animation: fadeIn 0.5s ease-in-out;
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .section-container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 4rem 20px;
                    text-align: center;
                }

                .hero {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                    background: url(${heroBg}) no-repeat center center/cover;
                    padding: 0 20px;
                    position: relative;
                    margin-top: -80px; /* Counteract padding if needed, or overlap navbar */
                }

                .hero::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.6);
                    z-index: 1;
                }

                .hero-content {
                    position: relative;
                    z-index: 2;
                }

                .hero h1 {
                    font-size: 4rem;
                    margin-bottom: 1.5rem;
                }

                .highlight-text {
                    color: var(--primary-orange);
                    font-weight: bold;
                }

                .hero-sub {
                    font-size: 1.5rem;
                    color: #e0e0e0;
                    max-width: 600px;
                    margin: 0 auto 2rem;
                }

                .hero-actions {
                    display: flex;
                    gap: 1rem;
                    justify-content: center;
                }

                /* Button hovers in hero */
                .btn-join {
                    /* ensure primary styles are base */
                }
                .btn-join:hover {
                    background-color: transparent !important;
                    color: var(--primary-orange) !important;
                    border: 2px solid var(--primary-orange) !important;
                    box-shadow: 0 0 10px rgba(237, 80, 0, 0.2);
                }

                .btn-explore {
                   color: #fff;
                   border-color: #fff;
                }
                .btn-explore:hover {
                    color: var(--primary-orange) !important;
                    border-color: var(--primary-orange) !important;
                    background: transparent !important;
                }
                
                /* About */
                .about-preview {
                    background-color: var(--bg-dark);
                    margin-top: 4rem;
                }
                
                .about-preview h2 {
                    margin-bottom: 2rem; /* Space between h2 and text */
                }

                .about-text p {
                    font-size: 1.2rem;
                    max-width: 800px;
                    margin: 0 auto;
                    color: var(--text-dim);
                }

                /* Cards Grid (How It Works) */
                .card-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 2rem;
                    margin-top: 3rem;
                }

                .card-icon {
                    font-size: 3rem;
                    color: var(--primary-orange);
                    margin-bottom: 1rem;
                }

                /* Audience Grid */
                .audience-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 1.5rem;
                    margin-top: 3rem;
                }

                .audience-card {
                    background: var(--bg-card);
                    padding: 1.5rem;
                    border-radius: 8px;
                    border: 1px solid #222;
                    text-align: center;
                    transition: border-color 0.3s;
                }
                
                .audience-card:hover {
                    border-color: var(--primary-orange);
                }

                .audience-card h3 {
                    color: var(--text-light);
                    margin-bottom: 0.5rem;
                }

                .audience-card p {
                    color: var(--text-dim);
                    font-size: 0.9rem;
                }

                /* Value Prop Redesign */
                .value-prop {
                    text-align: left;
                    padding: 6rem 20px;
                }
                
                .feature-label {
                    color: var(--primary-orange);
                    font-weight: 600;
                    margin-bottom: 1rem;
                    display: inline-block;
                }
                
                .value-prop h2 {
                    font-size: 3.5rem;
                    margin-bottom: 1.5rem;
                    max-width: 800px;
                    line-height: 1.1;
                }
                
                .value-desc {
                    font-size: 1.2rem;
                    color: #ccc;
                    max-width: 600px;
                    margin-bottom: 2.5rem;
                }
                
                .value-actions {
                    display: flex;
                    align-items: center;
                    gap: 2rem;
                }
                
                .btn-discover {
                    border: 1px solid #333 !important;
                    color: white !important;
                    padding: 12px 32px !important;
                }
                
                .btn-discover:hover {
                    border-color: white !important;
                }
                
                .link-opportunities {
                    color: var(--primary-orange);
                    font-weight: 500;
                }
                
                .link-opportunities:hover {
                    text-decoration: underline;
                }

                /* CTA Banner Redesign */
                .cta-banner {
                    background: #ffffff; /* White bg based on screenshot? Or keeping black as per prev request? 
                                            Wait, user screenshot shows white bg for CTA banner 'Ready to Plug in' 
                                            BUT in previous turn user asked for black CTA bg. 
                                            The NEW request says "The attached images are the ready to plug in section(CTA banner)..."
                                            and the screenshot uploaded_image_0 shows WHITE bg with BLACK text.
                                            I will follow the NEW screenshot. */
                    color: #000000;
                    padding: 6rem 20px;
                    text-align: center;
                    margin-top: 4rem;
                }

                .cta-banner h2 {
                    margin-bottom: 1.5rem;
                    font-size: 4rem;
                    line-height: 1.1;
                    color: #000;
                }
                
                .cta-sub {
                    color: #333;
                    margin-bottom: 2.5rem;
                    font-size: 1.1rem;
                }
                
                .cta-buttons {
                    display: flex;
                    gap: 1.5rem;
                    justify-content: center;
                }
                
                .btn-learn-more {
                    border: 1px solid #000 !important;
                    color: #000 !important;
                }
                
                .btn-learn-more:hover {
                    background: #f0f0f0 !important;
                }

                @media (max-width: 768px) {
                    .hero h1 {
                        font-size: 2.5rem;
                    }
                    .hero-actions {
                        flex-direction: column;
                    }
                    .value-prop h2 {
                        font-size: 2.5rem;
                    }
                    .cta-banner h2 {
                        font-size: 2.5rem;
                    }
                }
            `}</style>
    </div>
  );
};

export default Home;
