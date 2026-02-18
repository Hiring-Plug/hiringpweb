import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Card from '../components/Card';
import { FaNetworkWired, FaRocket, FaHandshake } from 'react-icons/fa';

import heroBg from '../assets/12.jpg'; // High-impact hero
import featureBg from '../assets/1.jpg'; // Feature background
import SEO from '../components/SEO';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleJoin = () => {
    if (user) {
      navigate('/app/dashboard');
    } else {
      navigate('/signup');
    }
  };

  return (
    <div className="home-page">
      <SEO
        title="Web3 Hiring Ecosystem for Talent & Founders"
        description="Connect with Web3 opportunities, join a decentralized talent network, and build the future of work."
      />
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Plug Into the <span className="highlight-text">Future of Hiring</span></h1>
          <p className="hero-sub">
            Hiring Plug connects communities to real opportunities in Web3.
            Easy, transparent, and decentralized.
          </p>
          <div className="hero-actions">
            <Button onClick={handleJoin} variant="glow" size="lg" className="btn-join">Join the Network</Button>
            <Button onClick={() => navigate('/projects')} variant="secondary" size="lg" className="btn-explore">Explore Projects</Button>
          </div>
        </div>
      </section>

      {/* About Summary */}
      <section className="section-container about-preview" style={{
        background: `linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.9)), url(${featureBg}) center/cover fixed`
      }}>
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
      {/* Value Proposition */}
      <section className="section-container value-prop">
        <h2>Why Hiring Plug?</h2>
        <div className="values-grid">
          <div className="value-item">
            <h3>Transparent</h3>
            <p>Every interaction is open and verifiable on the blockchain.</p>
          </div>
          <div className="value-item">
            <h3>Community First</h3>
            <p>We prioritize collective growth and fair access for everyone.</p>
          </div>
          <div className="value-item">
            <h3>Borderless</h3>
            <p>Opportunities should be accessible regardless of where you are.</p>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="cta-banner">
        <h2>Ready to<br />Plug in</h2>
        <p className="cta-sub">
          Transform your career journey with Web3 opportunities that matter.
        </p>
        <div className="cta-buttons">
          <Button onClick={() => navigate('/signup')} variant="primary">Get started</Button>
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
                    min-height: 100vh; /* Full viewport height */
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                    background: url(${heroBg}) no-repeat center center;
                    background-size: cover;
                    padding: 0 20px;
                    position: relative;
                    margin-top: -60px; /* Overlap 60px navbar */
                    padding-top: 60px; /* Center content visually */
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
                   transition: all 0.3s ease;
                }
                .btn-join:hover {
                    background-color: transparent !important;
                    color: var(--primary-orange) !important;
                    border: 2px solid var(--primary-orange) !important;
                    box-shadow: 0 0 15px rgba(237, 80, 0, 0.4);
                    transform: translateY(-2px);
                }

                .btn-explore {
                   color: #fff;
                   border-color: #fff;
                   transition: all 0.3s ease;
                }
                .btn-explore:hover {
                    color: var(--primary-orange) !important;
                    border-color: var(--primary-orange) !important;
                    background: transparent !important;
                    box-shadow: 0 0 15px rgba(237, 80, 0, 0.4);
                    transform: translateY(-2px);
                }
                
                /* About */
                .about-preview {
                    background-color: var(--bg-dark);
                    margin-top: 4rem;
                }
                
                .about-preview h2 {
                    margin-bottom: 2rem;
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

                .process-card, .audience-card, .value-item {
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                }
                
                .process-card:hover, .audience-card:hover, .value-item:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 20px rgba(0,0,0,0.5);
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
                    transition: border-color 0.3s, transform 0.3s;
                }
                
                .audience-card:hover {
                    border-color: var(--primary-orange);
                    transform: translateY(-5px);
                }

                .audience-card h3 {
                    color: var(--text-light);
                    margin-bottom: 0.5rem;
                }

                .audience-card p {
                    color: var(--text-dim);
                    font-size: 0.9rem;
                }

                /* Value Prop Revert */
                .values-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 2rem;
                    margin-top: 3rem;
                }

                .value-item {
                    border-left: 3px solid var(--primary-orange);
                    padding-left: 1rem;
                    text-align: left;
                    transition: all 0.3s ease;
                    padding-top: 10px;
                    padding-bottom: 10px;
                }
                
                .value-item:hover {
                    background: rgba(255,255,255,0.05);
                    transform: translateX(5px);
                }

                .value-item h3 {
                    color: var(--text-light);
                    margin-bottom: 0.5rem;
                }

                .value-item p {
                    color: var(--text-dim);
                }

                /* CTA Banner Redesign */
                .cta-banner {
                    background: #000000; /* Revert to Black */
                    color: #ffffff;
                    padding: 6rem 20px;
                    text-align: center;
                    margin-top: 4rem;
                }

                .cta-banner h2 {
                    margin-bottom: 1.5rem;
                    font-size: 4rem;
                    line-height: 1.1;
                    color: #ffffff;
                }
                
                .cta-sub {
                    color: #a0a0a0;
                    margin-bottom: 2.5rem;
                    font-size: 1.1rem;
                }
                
                .cta-buttons {
                    display: flex;
                    gap: 1.5rem;
                    justify-content: center;
                }
                
                .btn-learn-more {
                    border: 1px solid #ffffff !important;
                    color: #ffffff !important;
                    transition: all 0.3s ease;
                }
                
                .btn-learn-more:hover {
                    background: #ffffff !important;
                    color: #000000 !important;
                    transform: translateY(-2px);
                }

                @media (max-width: 768px) {
                    .hero h1 {
                        font-size: 2.5rem;
                    }
                    .hero-actions {
                        flex-direction: column;
                    }
                    .cta-banner h2 {
                        font-size: 2.5rem;
                    }
                }
            `}</style>
    </div >
  );
};

export default Home;
