import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import { FaHandshake, FaClipboardCheck, FaGraduationCap, FaBriefcase, FaGlobe, FaMedal, FaChartPie, FaUserTie } from 'react-icons/fa';
import team1 from '../assets/5.jpg';
import team2 from '../assets/6.jpg';

import SEO from '../components/SEO';

const About = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    observer.unobserve(entry.target); // One-time animation
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        const animElements = document.querySelectorAll('.reveal-up, .section-divider, .highlight-anim, .service-card, .value-card, .community-card, .stagger-item');
        animElements.forEach(el => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    return (
        <div className="about-page">
            <SEO
                title="About Us - Powering the Future of Work"
                description="Learn about Hiring Plug's mission to bridge the gap between global talent and decentralized opportunities."
                url="/about"
            />
            <section className="about-header">
                <h1 className="reveal-up">Powering the Future of Work Through Talent, Technology, and Opportunity</h1>
                <div className="section-divider"></div>
                <p className="lead-text reveal-up">
                    Hiring Plug is a modern talent and project-matching platform connecting skilled professionals with real opportunities, helping individuals grow careers and organizations build faster, smarter teams.
                </p>
            </section>

            <section className="section-container">
                <h2 className="reveal-up">Who We Are</h2>
                <div className="section-divider"></div>
                <div className="text-content">
                    <p className="reveal-up">
                        Hiring Plug is a <span className="highlight-anim">talent-driven platform</span> designed to bridge the gap between skilled professionals, innovative projects, and fast growing companies.
                    </p>
                    <p className="reveal-up">
                        We believe talent exists everywhere but opportunity does not always reach it. Our mission is to change that by creating a system where <span className="highlight-anim">skills are visible</span> and projects are accessible.
                    </p>
                </div>
            </section>

            <section className="section-container alt-bg">
                <h2 className="reveal-up">Our Story</h2>
                <div className="section-divider"></div>
                <div className="text-content">
                    <p className="reveal-up">
                        Hiring Plug was created in response to a common problem: hiring platforms that are overly complicated, slow, and disconnected from real communication.
                    </p>
                    <p className="reveal-up">
                        Many talented applicants struggle with long processes, limited feedback, and delayed or nonexistent interaction with hiring teams. At the same time, founders and project owners find it difficult to identify strong candidates quickly and engage with them meaningfully.
                    </p>
                    <p className="reveal-up">
                        Hiring Plug was built to change that.
                    </p>
                    <p className="reveal-up">
                        We designed a platform where the best applicants can <span className="highlight-anim">connect directly</span> with founders and project leads, eliminating unnecessary barriers. By combining hiring, project collaboration, and community into one shared space, Hiring Plug creates faster decisions with clearer communication making sure and stronger outcomes for everyone involved.
                    </p>
                </div>
            </section>

            <section className="section-container alt-bg">
                <div className="split-layout">
                    <div className="mission reveal-up">
                        <h2>Our Mission</h2>
                        <div className="section-divider" style={{ margin: '1rem 0' }}></div>
                        <p>
                            To connect talent with opportunity in a way that is transparent, fast, and impactful.
                            We aim to simplify hiring while creating meaningful pathways for professionals to grow, learn, and get hired.
                        </p>
                    </div>
                    <div className="vision reveal-up">
                        <div className="vision-block">
                            <h2>Our Vision</h2>
                            <div className="section-divider" style={{ margin: '1rem 0' }}></div>
                            <p className="vision-lead">A world where skills define opportunity.</p>
                        </div>
                        <div className="vision-block">
                            <p>We envision a future where:</p>
                            <ul className="styled-list">
                                <li className="stagger-item">Talent is recognized globally</li>
                                <li className="stagger-item">Projects move faster with the right people</li>
                                <li className="stagger-item">Professionals build careers through real work, not just credentials</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            <section className="why-exists-section">
                <div className="why-content reveal-up">
                    <h2>Why Hiring Plug Exists</h2>
                    <div className="section-divider" style={{ margin: '1rem 0' }}></div>
                    <p>
                        We built Hiring Plug to remove the barriers in traditional hiring.
                        In the decentralized world, talent is everywhere, but opportunity is often gated.
                        We exist to bridge that gap—giving communities direct access to real opportunities
                        while ensuring projects can hire transparently and efficiently.
                    </p>
                </div>
            </section>

            <section className="section-container">
                <h2 className="reveal-up">Our Services</h2>
                <div className="section-divider"></div>
                <div className="services-grid">
                    <Card className="service-card" title={<span><FaHandshake className="service-icon" /> Hiring Connect</span>}>
                        <p>Seamlessly link with top-tier talent and opportunities.</p>
                    </Card>
                    <Card className="service-card" title={<span><FaClipboardCheck className="service-icon" /> Tests & Assessments</span>}>
                        <p>Verify skills with trusted, standardized assessments.</p>
                    </Card>
                    <Card className="service-card" title={<span><FaGraduationCap className="service-icon" /> Web3 Courses</span>}>
                        <p>Learn, upskill, and grow with specialized curriculum.</p>
                    </Card>
                    <Card className="service-card" title={<span><FaBriefcase className="service-icon" /> Job Board</span>}>
                        <p>Find your next big opportunity or perfect candidate.</p>
                    </Card>
                    <Card className="service-card" title={<span><FaGlobe className="service-icon" /> Talent Marketplace</span>}>
                        <p>A global hub connecting skilled professionals worldwide.</p>
                    </Card>
                    <Card className="service-card" title={<span><FaMedal className="service-icon" /> NFT Badges</span>}>
                        <p>Earn verifiable, on-chain credentials for your achievements.</p>
                    </Card>
                    <Card className="service-card" title={<span><FaChartPie className="service-icon" /> HR Analytics</span>}>
                        <p>Data-driven insights for smarter hiring decisions.</p>
                    </Card>
                    <Card className="service-card" title={<span><FaUserTie className="service-icon" /> Direct Hire</span>}>
                        <p>Connect directly and hire instantly without barriers.</p>
                    </Card>
                </div>
            </section>

            <section className="section-container alt-bg">
                <h2 className="reveal-up">Who We Serve</h2>
                <div className="section-divider"></div>
                <div className="split-layout">
                    <div className="serve-col reveal-up">
                        <h3>For Professionals</h3>
                        <ul className="styled-list">
                            <li className="stagger-item">Developers</li>
                            <li className="stagger-item">Designers</li>
                            <li className="stagger-item">Product specialists</li>
                            <li className="stagger-item">Creatives & digital professionals</li>
                            <li className="stagger-item">Marketers</li>
                        </ul>
                        <p className="highlight stagger-item">We help you gain exposure, experience, and access to meaningful work.</p>
                    </div>
                    <div className="serve-col reveal-up">
                        <h3>For Organizations</h3>
                        <ul className="styled-list">
                            <li className="stagger-item">Startups</li>
                            <li className="stagger-item">Growing businesses</li>
                            <li className="stagger-item">Agencies</li>
                            <li className="stagger-item">Project-based teams</li>
                        </ul>
                        <p className="highlight stagger-item">We help you find the right talent—faster and with confidence.</p>
                    </div>
                </div>
            </section>

            <section className="section-container">
                <h2 className="reveal-up">Our Values</h2>
                <div className="section-divider"></div>
                <div className="grid-4">
                    <Card title="Opportunity First" className="value-card"><p>Talent deserves access</p></Card>
                    <Card title="Transparency" className="value-card"><p>Clear expectations on both sides</p></Card>
                    <Card title="Quality Over Quantity" className="value-card"><p>Right fit matters</p></Card>
                    <Card title="Growth Mindset" className="value-card"><p>Learning through real work</p></Card>
                </div>
            </section>

            <section className="section-container">
                <h2 className="reveal-up">Life at Hiring Plug</h2>
                <div className="section-divider"></div>
                <div className="culture-grid">
                    <div className="culture-img-wrapper reveal-up">
                        <img src={team1} alt="Team collaboration" className="culture-img" />
                    </div>
                    <div className="culture-text reveal-up">
                        <h3>A Culture of Builders</h3>
                        <p>
                            We are a distributed team of developers, designers, and dreamers.
                            We believe in autonomy, ownership, and the power of shipping code that matters.
                        </p>
                    </div>
                    <div className="culture-text reveal-up">
                        <h3>Remote First, Always</h3>
                        <p>
                            Work from anywhere. We value output over hours and async communication over endless meetings.
                            Our community is our office.
                        </p>
                    </div>
                    <div className="culture-img-wrapper reveal-up">
                        <img src={team2} alt="Remote work lifestyle" className="culture-img" />
                    </div>
                </div>
            </section>

            <section className="section-container alt-bg">
                <h2 className="reveal-up">Looking Ahead</h2>
                <div className="section-divider"></div>
                <p className="lead-text reveal-up" style={{ maxWidth: '800px', margin: '0 auto' }}>
                    Hiring Plug is continuously evolving. We are <span className="highlight-anim">building tools, systems, and partnerships</span> that strengthen how people work together in a digital world.
                </p>
            </section>

            <section className="section-container cta-section">
                <h2>Ready to Be Part of the Future of Work?</h2>
                <div className="cta-actions">
                    <Button onClick={() => navigate('/signup')} variant="primary">Join Hiring Plug</Button>
                    <Button onClick={() => navigate('/projects')} variant="secondary">Explore Projects</Button>
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
                    padding: 6rem 20px;
                    text-align: center;
                    background: linear-gradient(180deg, #000000 0%, #000 100%);
                }
                .about-header h1 {
                    font-size: 3rem;
                    color: var(--primary-orange);
                    margin-bottom: 2rem;
                    max-width: 1000px;
                    margin-left: auto;
                    margin-right: auto;
                }
                .lead-text {
                    font-size: 1.5rem;
                    max-width: 800px;
                    margin: 0 auto;
                    color: var(--text-light);
                    line-height: 1.6;
                }

                .section-container {
                    padding: 4rem 20px;
                    max-width: 1200px;
                    margin: 0 auto;
                    text-align: center;
                }
                .alt-bg {
                    background-color: #000000;
                    width: 100%;
                    max-width: 100%;
                }
                
                h2 {
                    font-size: 2.5rem;
                    margin-bottom: 2rem;
                    color: white;
                }

                .text-content {
                    max-width: 800px;
                    margin: 0 auto;
                    text-align: left;
                    font-size: 1.2rem;
                    color: #ccc;
                    line-height: 1.8;
                }
                .text-content p {
                    margin-bottom: 1.5rem;
                }

                .grid-4 {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 2rem;
                    margin-top: 2rem;
                }

                .split-layout {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 4rem;
                    text-align: left;
                    max-width: 1000px;
                    margin: 0 auto;
                }
                
                .styled-list {
                    list-style: none;
                    padding: 0;
                }
                .styled-list li {
                    padding: 0.5rem 0;
                    border-bottom: none;
                    color: #ccc;
                }
                .styled-list li:last-child {
                    border-bottom: none;
                }
                
                .highlight {
                    margin-top: 1.5rem;
                    color: var(--primary-orange);
                    font-weight: bold;
                    font-size: 1.1rem;
                }

                .why-exists-section {
                    padding: 4rem 20px;
                    background-color: var(--bg-dark);
                    text-align: center;
                }
                .why-content {
                    max-width: 800px;
                    margin: 0 auto;
                    border-left: 4px solid var(--primary-orange);
                    padding-left: 2rem;
                    text-align: left;
                }
                .why-content h2 {
                    margin-bottom: 2rem;
                    color: var(--text-light);
                }
                .why-content p {
                    font-size: 1.2rem;
                    color: var(--text-dim);
                }

                .services-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 1.5rem;
                    text-align: left;
                }
                .service-item {
                    background: #000000;
                    padding: 1.5rem;
                    border-radius: 8px;
                    color: #fff;
                    font-weight: 500;
                    transition: all 0.3s;
                    border: 1px solid #333;
                }
                .service-item:hover {
                    border-color: var(--primary-orange);
                    transform: translateY(-5px);
                }

                .cta-actions {
                    display: flex;
                    gap: 1.5rem;
                    justify-content: center;
                    margin-top: 2rem;
                }

                .community-section {
                   padding: 4rem 20px;
                   max-width: 1200px;
                   margin: 0 auto;
                   text-align: center;
                }
                .community-grid {
                   display: grid;
                   grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                   gap: 2rem;
                   text-align: left;
                }
                .community-card h3 {
                   color: white !important;
                }
                .service-card {
                    background: #000000;
                    border: 1px solid #333;
                    transition: all 0.3s ease;
                    text-align: left;
                }
                .service-card:hover {
                    border-color: var(--primary-orange);
                    transform: translateY(-5px);
                    box-shadow: 0 10px 20px rgba(0,0,0,0.5);
                }
                .service-icon {
                    color: var(--primary-orange);
                    margin-right: 10px;
                    font-size: 1.2em;
                    vertical-align: middle;
                }

                /* --- Animation Styles --- */

                /* Base Reveal: Fades in and moves up */
                .reveal-up {
                    opacity: 0;
                    transform: translateY(30px);
                    transition: opacity 0.8s ease-out, transform 0.8s ease-out;
                    will-change: opacity, transform;
                }
                .reveal-up.in-view {
                    opacity: 1;
                    transform: translateY(0);
                }

                /* Section Divider: Expands width from 0 */
                .section-divider {
                    height: 3px;
                    background: var(--primary-orange);
                    width: 0;
                    margin: 1.5rem auto;
                    transition: width 1s ease-out;
                    border-radius: 2px;
                }
                .section-divider.in-view {
                    width: 80px; /* Expands to this width */
                }

                /* Staggered Items: List items, cards, etc. */
                .stagger-item, .service-card, .value-card, .community-card {
                    opacity: 0;
                    transform: translateY(20px);
                    transition: opacity 0.6s ease-out, transform 0.6s ease-out;
                }
                .stagger-item.in-view, 
                .service-card.in-view, 
                .value-card.in-view, 
                .community-card.in-view {
                    opacity: 1;
                    transform: translateY(0);
                }

                /* Stagger Delays using nth-child for lists/grids */
                .stagger-item:nth-child(1), .service-card:nth-child(1), .value-card:nth-child(1), .community-card:nth-child(1) { transition-delay: 0.1s; }
                .stagger-item:nth-child(2), .service-card:nth-child(2), .value-card:nth-child(2), .community-card:nth-child(2) { transition-delay: 0.2s; }
                .stagger-item:nth-child(3), .service-card:nth-child(3), .value-card:nth-child(3), .community-card:nth-child(3) { transition-delay: 0.3s; }
                .stagger-item:nth-child(4), .service-card:nth-child(4), .value-card:nth-child(4), .community-card:nth-child(4) { transition-delay: 0.4s; }
                .stagger-item:nth-child(5) { transition-delay: 0.5s; }
                .stagger-item:nth-child(6) { transition-delay: 0.6s; }
                .stagger-item:nth-child(7) { transition-delay: 0.7s; }
                .stagger-item:nth-child(8) { transition-delay: 0.8s; }

                /* Keyword Highlight: Transitions color or underline */
                .highlight-anim {
                    position: relative;
                    color: inherit;
                    transition: color 0.5s ease;
                }
                .highlight-anim.in-view {
                    color: var(--primary-orange);
                    text-shadow: 0 0 10px rgba(237, 80, 0, 0.4);
                }
                /* Optional underline effect for highlights */
                .highlight-anim::after {
                    content: '';
                    position: absolute;
                    bottom: -2px;
                    left: 0;
                    width: 0;
                    height: 1px;
                    background: var(--primary-orange);
                    transition: width 0.8s ease-out 0.2s; /* delay slightly */
                }
                .highlight-anim.in-view::after {
                    width: 100%;
                }
                
                @media (max-width: 768px) {
                    .split-layout {
                        grid-template-columns: 1fr;
                        gap: 2rem;
                    }
                    .about-header h1 {
                        font-size: 2rem;
                    }
                    .culture-grid {
                        grid-template-columns: 1fr !important;
                    }
                }

                .culture-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 2rem;
                    align-items: center;
                    margin-top: 2rem;
                }
                .culture-img-wrapper {
                    overflow: hidden;
                    border-radius: 12px;
                    border: 1px solid #333;
                }
                .culture-img {
                    width: 100%;
                    height: auto;
                    display: block;
                    transition: transform 0.5s ease;
                }
                .culture-img-wrapper:hover .culture-img {
                    transform: scale(1.05);
                }
                .culture-text {
                    text-align: left;
                    padding: 1rem;
                }
                .culture-text h3 {
                    color: white;
                    margin-bottom: 1rem;
                    font-size: 1.5rem;
                }
                .culture-text p {
                    color: #ccc;
                    line-height: 1.6;
                }
            `}</style>
        </div>
    );
};

export default About;
