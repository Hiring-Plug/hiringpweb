import Card from '../components/Card';

const About = () => {
    return (
        <div className="about-page">
            <section className="about-header">
                <h1>Our Mission</h1>
                <p className="lead-text">
                    To empower communities with access to meaningful career opportunities,
                    while enabling projects to source talent transparently through Web3.
                </p>
            </section>

            <section className="vision-section">
                <div className="vision-content">
                    <h2>Our Vision</h2>
                    <p>
                        We see a future where hiring is borderless, trustless, and community-driven.
                        Where skills meet opportunities without barriers, and where every contribution
                        is recognized and rewarded on-chain.
                    </p>
                </div>
            </section>

            <section className="community-section">
                <h2>Powered by Community</h2>
                <div className="community-grid">
                    <Card title="Decentralized Governance" className="community-card">
                        <p>Our roadmap is driven by the community. Token holders vote on features and partnerships.</p>
                    </Card>
                    <Card title="Fair Rewards" className="community-card">
                        <p>Recruiters and referrers earn bounty rewards for successful placements.</p>
                    </Card>
                    <Card title="Global Talent" className="community-card">
                        <p>Access a diverse pool of talent from over 50 countries, united by Web3.</p>
                    </Card>
                </div>
            </section>

            <style>{`
                .about-header {
                    padding: 4rem 20px;
                    text-align: center;
                    background: linear-gradient(180deg, #1a1a1a 0%, #222 100%);
                }
                .about-header h1 {
                    font-size: 3rem;
                    color: var(--primary-orange);
                    margin-bottom: 2rem;
                }
                .lead-text {
                    font-size: 1.5rem;
                    max-width: 800px;
                    margin: 0 auto;
                    color: var(--text-light);
                }
                
                .vision-section {
                    padding: 4rem 20px;
                    background-color: var(--bg-card);
                    text-align: center;
                }
                .vision-content {
                    max-width: 800px;
                    margin: 0 auto;
                }
                .vision-section h2 {
                    margin-bottom: 2rem;
                    color: var(--secondary-yellow);
                }
                .vision-section p {
                    font-size: 1.2rem;
                }

                .community-section {
                    padding: 4rem 20px;
                    max-width: 1200px;
                    margin: 0 auto;
                    text-align: center;
                }
                .community-section h2 {
                    margin-bottom: 3rem;
                }
                .community-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 2rem;
                    text-align: left;
                }
                .community-card h3 {
                    color: var(--text-light) !important;
                }
            `}</style>
        </div>
    );
};

export default About;
