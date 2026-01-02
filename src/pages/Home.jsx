import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Card from '../components/Card';
import { FaNetworkWired, FaRocket, FaHandshake } from 'react-icons/fa';

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
            Seamless, transparent, and decentralized.
          </p>
          <div className="hero-actions">
            <Button onClick={() => navigate('/join')} variant="primary">Join the Network</Button>
            <Button onClick={() => navigate('/projects')} variant="secondary">Explore Projects</Button>
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
        <h2>Ready to Plug In?</h2>
        <Button onClick={() => navigate('/join')} variant="gradient">Get Started</Button>
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
                    min-height: 80vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                    background: radial-gradient(circle at center, #2a2a2a 0%, #1a1a1a 70%);
                    padding: 0 20px;
                }

                .hero h1 {
                    font-size: 4rem;
                    margin-bottom: 1.5rem;
                }

                .highlight-text {
                    background: var(--accent-gradient);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .hero-sub {
                    font-size: 1.5rem;
                    color: #ccc;
                    max-width: 600px;
                    margin: 0 auto 2rem;
                }

                .hero-actions {
                    display: flex;
                    gap: 1rem;
                    justify-content: center;
                }

                .about-preview {
                    background-color: var(--bg-dark);
                }

                .about-text p {
                    font-size: 1.2rem;
                    max-width: 800px;
                    margin: 0 auto;
                    color: var(--text-dim);
                }

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
                }

                .value-item h3 {
                    color: var(--text-light);
                    margin-bottom: 0.5rem;
                }

                .value-item p {
                    color: var(--text-dim);
                }

                .cta-banner {
                    background: linear-gradient(90deg, #222, #333);
                    padding: 4rem 20px;
                    text-align: center;
                    margin-top: 4rem;
                }

                .cta-banner h2 {
                    margin-bottom: 2rem;
                    font-size: 2.5rem;
                }

                @media (max-width: 768px) {
                    .hero h1 {
                        font-size: 2.5rem;
                    }
                    .hero-actions {
                        flex-direction: column;
                    }
                }
            `}</style>
    </div>
  );
};

export default Home;
