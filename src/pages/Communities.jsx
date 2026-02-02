import { FaBriefcase, FaLaptopCode, FaBook, FaBlog, FaUsers, FaArrowRight, FaTwitter, FaDiscord, FaTelegram, FaLinkedin, FaShareAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import Button from '../components/Button';
import commBg from '../assets/3.jpg';

const Communities = () => {
    const cards = [
        {
            icon: <FaLaptopCode />,
            title: "Freelance & Gigs",
            description: "Find short-term contracts and bounty work in the Web3 ecosystem.",
            link: "/projects",
            action: "Find Gigs"
        },
        {
            icon: <FaBriefcase />,
            title: "Full-Time Projects",
            description: "Browse verified full-time roles at top DeFi and Infrastructure protocols.",
            link: "/projects",
            action: "Explore Jobs"
        },
        {
            icon: <FaBook />,
            title: "Learning & Courses",
            description: "Upskill with curated Web3 development and security courses.",
            link: "/resources",
            action: "Start Learning"
        },
        {
            icon: <FaBlog />,
            title: "Hiring Plug Blog",
            description: "Latest insights on recruitment trends, salary benchmarks, and DAO governance.",
            link: "/blog", // Placeholder
            action: "Read Articles"
        },
        {
            icon: <FaUsers />,
            title: "Careers at Hiring Plug",
            description: "Join our core team building the future of decentralized recruitment.",
            link: "/careers", // Placeholder
            action: "Join Us"
        },
        {
            icon: <FaShareAlt />,
            title: "Connect with Us",
            description: "Follow us for real-time updates and community discussions.",
            type: "social",
            links: [
                { icon: <FaTwitter />, url: "https://twitter.com/hiring_plug" },
                { icon: <FaDiscord />, url: "https://discord.gg/hiringplug" },
                { icon: <FaTelegram />, url: "https://t.me/hiring_plug" },
                { icon: <FaLinkedin />, url: "https://linkedin.com/company/hiring-plug" }
            ]
        }
    ];

    return (
        <div className="communities-page">
            <SEO
                title="Communities - Connect, Learn, and Earn | Hiring Plug"
                description="Join the Hiring Plug community. Find freelance work, access learning resources, and connect with Web3 builders."
                url="/communities"
            />

            {/* Hero Section with Wave Design */}
            <section className="comm-hero">
                <div className="hero-content">
                    <h1>Join the <span className="highlight">Ecosystem</span></h1>
                    <p>Connect with a thriving network of builders, creators, and innovators shaping the future of Web3.</p>
                </div>
                <div className="custom-shape-divider-bottom-167890">
                    <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="shape-fill"></path>
                    </svg>
                </div>
            </section>

            {/* Cards Grid */}
            <section className="cards-section">
                <div className="cards-grid">
                    {cards.map((card, index) => (
                        <div key={index} className="comm-card">
                            <div className="card-icon">{card.icon}</div>
                            <h3>{card.title}</h3>
                            <p>{card.description}</p>

                            {card.type === 'social' ? (
                                <div className="social-links-row">
                                    {card.links.map((social, i) => (
                                        <a key={i} href={social.url} target="_blank" rel="noopener noreferrer" className="social-icon-btn">
                                            {social.icon}
                                        </a>
                                    ))}
                                </div>
                            ) : (
                                <Link to={card.link} className="card-link">
                                    {card.action} <FaArrowRight style={{ fontSize: '0.8rem' }} />
                                </Link>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="comm-cta">
                <h2>Ready to make your mark?</h2>
                <p>Create your profile today and start your journey.</p>
                {/* Link to login/signup placeholder for now */}
                <Button variant="primary" style={{ padding: '0.8rem 2rem', fontSize: '1.1rem' }}>
                    Get Started
                </Button>
            </section>

            <style>{`
                .communities-page {
                    background: #000;
                    color: white;
                    min-height: 100vh;
                }

                /* Hero Section */
                .comm-hero {
                    position: relative;
                    background: linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.8)), url(${commBg});
                    background-size: cover;
                    background-position: center;
                    min-height: 400px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                    padding: 4rem 20px 8rem; /* Extra bottom padding for wave */
                    overflow: hidden;
                }
                .hero-content {
                    position: relative;
                    z-index: 2;
                    max-width: 800px;
                }
                .hero-content h1 {
                    font-size: 3.5rem;
                    margin-bottom: 1.5rem;
                    font-weight: 800;
                }
                .highlight {
                    background: -webkit-linear-gradient(45deg, var(--primary-orange), #ff9f43);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .hero-content p {
                    font-size: 1.25rem;
                    color: #ccc;
                    line-height: 1.6;
                }

                /* Wave Shape */
                .custom-shape-divider-bottom-167890 {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    overflow: hidden;
                    line-height: 0;
                    transform: rotate(180deg);
                }
                .custom-shape-divider-bottom-167890 svg {
                    position: relative;
                    display: block;
                    width: calc(100% + 1.3px);
                    height: 120px;
                }
                .custom-shape-divider-bottom-167890 .shape-fill {
                    fill: #000000;
                }

                /* Cards Section */
                .cards-section {
                    padding: 4rem 20px;
                    max-width: 1200px;
                    margin: 0 auto;
                }
                .cards-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 2rem;
                }
                .comm-card {
                    background: #111;
                    border: 1px solid #222;
                    border-radius: 12px;
                    padding: 2rem;
                    transition: all 0.3s ease;
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                }
                .comm-card:hover {
                    transform: translateY(-5px);
                    border-color: var(--primary-orange);
                    box-shadow: 0 10px 30px rgba(237, 80, 0, 0.15);
                }
                .card-icon {
                    font-size: 2.5rem;
                    color: var(--primary-orange);
                    margin-bottom: 1.5rem;
                }
                .comm-card h3 {
                    font-size: 1.5rem;
                    margin-bottom: 1rem;
                    color: #fff;
                }
                .comm-card p {
                    color: #888;
                    margin-bottom: 2rem;
                    line-height: 1.5;
                    flex-grow: 1;
                }
                .card-link {
                    color: #fff;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    text-decoration: none;
                    transition: gap 0.2s;
                }
                .card-link:hover {
                    color: var(--primary-orange);
                    gap: 0.8rem;
                }

                .social-links-row {
                    display: flex;
                    gap: 1rem;
                    margin-top: auto;
                }
                .social-icon-btn {
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    background: rgba(255,255,255,0.05);
                    color: #aaa;
                    font-size: 1.2rem;
                    transition: all 0.2s;
                }
                .social-icon-btn:hover {
                    background: var(--primary-orange);
                    color: white;
                    transform: translateY(-2px);
                }

                /* CTA Section */
                .comm-cta {
                    text-align: center;
                    padding: 6rem 20px;
                    background: #0a0a0a;
                    border-top: 1px solid #1a1a1a;
                }
                .comm-cta h2 {
                    font-size: 2.5rem;
                    margin-bottom: 1rem;
                }
                .comm-cta p {
                    color: #888;
                    margin-bottom: 2.5rem;
                    font-size: 1.1rem;
                }

                @media (max-width: 768px) {
                    .hero-content h1 {
                        font-size: 2.5rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default Communities;
