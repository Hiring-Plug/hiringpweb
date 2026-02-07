import React, { useState, useEffect, useRef } from 'react';
import { FaLinkedin, FaTwitter, FaTelegram, FaFilePdf, FaExternalLinkAlt, FaUserSlash, FaNetworkWired, FaBuilding, FaBriefcase, FaGem } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SEO from '../components/SEO';
import './Litepaper.css';

const Litepaper = () => {
    const { user } = useAuth();
    const roadmapRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const handleScroll = () => {
        if (!roadmapRef.current) return;

        const container = roadmapRef.current;
        const containerCenter = container.getBoundingClientRect().left + container.offsetWidth / 2;

        // Button Visibility
        const { scrollLeft, scrollWidth, clientWidth } = container;
        setCanScrollLeft(scrollLeft > 20);
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 20);

        // Active Card Logic
        const cards = Array.from(container.children);
        let closestIndex = 0;
        let minDistance = Infinity;

        cards.forEach((card, index) => {
            const cardRect = card.getBoundingClientRect();
            const cardCenter = cardRect.left + cardRect.width / 2;
            const distance = Math.abs(containerCenter - cardCenter);

            if (distance < minDistance) {
                minDistance = distance;
                closestIndex = index;
            }
        });

        setActiveIndex(closestIndex);
    };

    useEffect(() => {
        const container = roadmapRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll);
            window.addEventListener('resize', handleScroll);
            handleScroll(); // Initial check
        }
        return () => {
            container?.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleScroll);
        };
    }, []);

    const scrollContainer = (direction) => {
        if (roadmapRef.current) {
            const scrollAmount = 340;
            roadmapRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
        }
    };

    const roadmapData = [
        {
            tag: "Current Focus",
            title: "MVP & Foundation",
            items: [
                "<strong>MVP Completion:</strong> Finalizing matching & profiles.",
                "<strong>Fundraising & CEX:</strong> Scaling operations & liquidity.",
                "<strong>Escrow Hiring:</strong> Trustless payments.",
                "<strong>Advanced Matching:</strong> AI-driven recommendations.",
                "<strong>Marketplace:</strong> Assessments & courses.",
                "<strong>DAO Transition:</strong> Progressive decentralization."
            ]
        },
        {
            tag: "Phase II",
            title: "Ecosystem Growth",
            items: [
                "Fully functional talent marketplace.",
                "Measurable placement & escrow volume.",
                "Expanding credential library.",
                "Growing base of active HPLUG users."
            ]
        },
        {
            tag: "Phase III",
            title: "Scale & Governance",
            items: [
                "Operating at meaningful economic scale.",
                "Enterprise-grade analytics.",
                "International user base & multi-chain.",
                "Early-stage decentralized governance."
            ]
        },
        {
            tag: "The Future",
            title: "Long-Term Vision",
            items: [
                "Default talent layer for Web3.",
                "100k+ verified professionals.",
                "10k+ hiring organizations.",
                "Neutral, trust-minimized protocol for global work."
            ]
        }
    ];

    return (
        <div className="litepaper-wrapper">
            <SEO
                title="Litepaper | Hiring Plug"
                description="Hiring Plug: The talent infrastructure for Web3. Read our litepaper on decentralized hiring, verified credentials, and the HPLUG token."
                keywords="litepaper, web3 hiring, HPLUG token, decentralized recruitment, whitepaper"
            />

            <article className="litepaper-document">
                <header className="doc-section">
                    <h1 className="doc-title">Hiring Plug Litepaper</h1>
                    <p className="doc-subtitle">The Talent Infrastructure for Web3</p>

                    <div className="doc-callout">
                        <p>
                            A modern talent and project-matching platform connecting skilled professionals with real opportunities,
                            helping individuals grow careers and organizations build faster, smarter teams.
                        </p>
                    </div>

                    <div className="doc-logo-grid">
                        <a href="/hiring-plug-whitepaper.pdf" target="_blank" className="doc-btn"><FaFilePdf /> Full Whitepaper (PDF)</a>
                        <a href="https://x.com/hiring_plug" target="_blank" rel="noreferrer" className="doc-btn"><FaTwitter /> Twitter</a>
                        <a href="https://t.me/hiring_plug" target="_blank" rel="noreferrer" className="doc-btn"><FaTelegram /> Telegram</a>
                        <a href="https://www.linkedin.com/company/hiring-plug" target="_blank" rel="noreferrer" className="doc-btn"><FaLinkedin /> LinkedIn</a>
                    </div>
                </header>

                <section className="doc-section">
                    <h2>Our Mission</h2>
                    <p className="doc-text">
                        To connect talent with opportunity in a way that is transparent, fast, and impactful. We aim to simplify hiring while creating meaningful pathways for professionals to grow, learn, and get hired.
                    </p>
                </section>

                <section className="doc-section">
                    <h2>The Problem: Web3 Talent Crisis</h2>
                    <p className="doc-text">
                        The Web3 ecosystem is evolving faster than its ability to organize human capital. As protocols and DAOs scale,
                        the demand for specialized talent outpaces supply. This isn't just a shortage, it's a breakdown in how talent
                        is discovered, validated, and connected to opportunity.
                    </p>
                    <h3>Key Challenges</h3>
                    <div className="problem-cards">
                        <div className="problem-card">
                            <FaBuilding className="card-icon" />
                            <h4>For Employers & DAOs</h4>
                            <p>Uncertainty in verifying real Web3 skills leads to high screening costs. The absence of standardized credentials forces reliance on closed networks.</p>
                        </div>
                        <div className="problem-card">
                            <FaUserSlash className="card-icon" />
                            <h4>For Job Seekers & Talent</h4>
                            <p>Capable professionals face unclear pathways to validate their expertise. Without portable, on-chain proof of work, they struggle to signal competence.</p>
                        </div>
                        <div className="problem-card">
                            <FaNetworkWired className="card-icon" />
                            <h4>Structural Inefficiencies</h4>
                            <p>A severe information asymmetry exists between talent supply and demand. Fragmented hiring processes result in slower product launches.</p>
                        </div>
                    </div>
                </section>

                <section className="doc-section">
                    <h2>Solution Overview</h2>
                    <p className="doc-text">
                        Hiring Plug delivers a unified, decentralized talent infrastructure purpose-built for the Web3 economy.
                        It replaces fragmented workflows with a trust-first system where skills are verified, reputations are portable,
                        and incentives are aligned.
                    </p>
                    <p className="doc-text">
                        At its foundation, we combine credential verification, skill assessment, education, and hiring into a single
                        on-chain framework. Powering this ecosystem is the <strong>HPLUG token</strong>.
                    </p>

                    <h3>Value Proposition</h3>
                    <div className="problem-cards">
                        <div className="problem-card">
                            <FaBriefcase className="card-icon" />
                            <h4>For Employers, Startups & DAOs</h4>
                            <p>
                                <strong>Hire with Confidence:</strong> Access a curated pool of professionals. Smart contract escrows ensure secure payments.
                            </p>
                        </div>
                        <div className="problem-card">
                            <FaGem className="card-icon" />
                            <h4>For Professionals & Talent</h4>
                            <p>
                                <strong>Merit-Based Journeys:</strong> Build a portable reputation with NFT skill badges. Earn through diverse channels with transparent compensation.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="doc-section">
                    <h2>Token Economics (HPLUG)</h2>
                    <p className="doc-text">
                        The <strong>Hiring Plug Token (HPLUG)</strong> is the coordination and value-alignment layer of the ecosystem.
                        It powers access, reputation, governance, and economic security.
                    </p>

                    <div className="token-specs-grid">
                        <div className="spec-card"><span className="spec-label">Ticker</span><span className="spec-value">HPLUG</span></div>
                        <div className="spec-card"><span className="spec-label">Total Supply</span><span className="spec-value">30M</span></div>
                        <div className="spec-card"><span className="spec-label">Network</span><span className="spec-value">BEP-20</span></div>
                        <div className="spec-card"><span className="spec-label">Initial Price</span><span className="spec-value">$1.00</span></div>
                    </div>

                    <h3>Utility & Demand Drivers</h3>
                    <ul className="doc-list">
                        <li><strong>Access & Visibility:</strong> Unlock premium features and profile exposure.</li>
                        <li><strong>Hiring & Escrow:</strong> Stake to post roles and pay reduced fees.</li>
                        <li><strong>Reputation Staking:</strong> Build trust signals and access interactions.</li>
                        <li><strong>Governance:</strong> Vote on platform evolution and treasury allocation.</li>
                    </ul>

                    <h3>Token Distribution</h3>
                    <p className="doc-text">The distribution prioritizes ecosystem growth, long-term alignment, and operational sustainability.</p>

                    <div className="dist-grid">
                        {[
                            { cat: "Community Incentives", pct: "35%", val: 35, tokens: "10,500,000", note: "Rewards for talent, employers, validators over multiple years." },
                            { cat: "Team & Advisors", pct: "18%", val: 18, tokens: "5,400,000", note: "1-month cliff, 3-year linear vesting." },
                            { cat: "Treasury & DAO", pct: "17%", val: 17, tokens: "5,100,000", note: "Development, partnerships, strategic initiatives." },
                            { cat: "Public Sale", pct: "15%", val: 15, tokens: "4,500,000", note: "Ensures decentralized ownership from inception." },
                            { cat: "LP & Market Ops", pct: "10%", val: 10, tokens: "3,000,000", note: "Supports healthy market formation and liquidity." },
                            { cat: "Strategic Partnerships", pct: "5%", val: 5, tokens: "1,500,000", note: "Integrations and enterprise adoption." }
                        ].map((item, index) => (
                            <div className="dist-item" key={index}>
                                <div className="dist-header">
                                    <span className="dist-category">{item.cat}</span>
                                    <div><span className="dist-tokens">{item.tokens}</span> <span className="dist-percent">{item.pct}</span></div>
                                </div>
                                <div className="dist-bar-bg"><div className="dist-bar-fill" style={{ '--w': item.pct }}></div></div>
                                <p className="dist-notes">{item.note}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="doc-section">
                    <h2>Live Today</h2>
                    <ul className="doc-list">
                        <li>Public Platform & Website (hiringplug.xyz)</li>
                        <li>Whitepaper V1.0 Released</li>
                        <li>Early Talent & Project Profiles Live</li>
                        <li>HPLUG Token Smart Contract Deployed</li>
                        <li>Onboarding active Early Users and Partners</li>
                    </ul>
                </section>

                <section className="doc-section">
                    <h2>What's Next (Roadmap)</h2>
                    <p className="doc-text">Our path to becoming the default talent layer for Web3. Swipe to explore our phases.</p>

                    <div className="roadmap-container-wrapper">
                        {canScrollLeft && (
                            <button className="scroll-nav-btn prev" onClick={() => scrollContainer('left')} aria-label="Scroll Left">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18L9 12L15 6" /></svg>
                            </button>
                        )}

                        <div className="roadmap-scroll-container" ref={roadmapRef}>
                            {roadmapData.map((phase, index) => (
                                <div key={index} className={`roadmap-card ${index === activeIndex ? 'active' : ''}`}>
                                    <span className="phase-tag">{phase.tag}</span>
                                    <h4>{phase.title}</h4>
                                    <ul className="roadmap-list">
                                        {phase.items.map((item, idx) => (
                                            <li key={idx} dangerouslySetInnerHTML={{ __html: item }} />
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>

                        {canScrollRight && (
                            <button className="scroll-nav-btn next" onClick={() => scrollContainer('right')} aria-label="Scroll Right">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18L15 12L9 6" /></svg>
                            </button>
                        )}
                    </div>
                </section>

                <section className="doc-section join-section">
                    <h2>Join Hiring Plug</h2>
                    <div className="join-content">
                        <p className="doc-text">Be among the first to build your on-chain professional identity. Early users secure exclusive benefits.</p>
                        <div className="join-cta-container">
                            <Link to={user ? "/app/dashboard" : "/signup"} className="doc-btn primary-cta">
                                {user ? "Launch Dashboard" : "Join the Revolution"} <FaExternalLinkAlt style={{ marginLeft: '0.5rem', fontSize: '0.9em' }} />
                            </Link>
                        </div>
                        <div className="join-socials">
                            <a href="https://x.com/hiring_plug" target="_blank" rel="noreferrer" className="social-icon-btn"><FaTwitter /></a>
                            <a href="https://t.me/hiring_plug" target="_blank" rel="noreferrer" className="social-icon-btn"><FaTelegram /></a>
                            <a href="https://www.linkedin.com/company/hiring-plug" target="_blank" rel="noreferrer" className="social-icon-btn"><FaLinkedin /></a>
                        </div>
                    </div>
                </section>

                <footer className="litepaper-footer">
                    <p>&copy; 2026 Hiring Plug&trade;. All rights reserved. <span className="footer-divider">|</span> <a href="/hiring-plug-whitepaper.pdf" target="_blank" className="footer-link">Full Whitepaper (PDF)</a></p>
                </footer>
            </article>
        </div>
    );
};

export default Litepaper;
