import { FaTwitter, FaDiscord, FaGithub, FaLinkedin, FaTelegram } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-top">
                <div className="footer-container">
                    <div className="stay-connected">
                        <h3>Stay connected</h3>
                        <p>Get the latest Web3 career insights and opportunities.</p>
                    </div>
                    <div className="newsletter-form">
                        <input type="email" placeholder="Email address" className="newsletter-input" />
                        <button className="newsletter-btn">Subscribe</button>
                    </div>
                </div>
            </div>

            <div className="footer-content">
                <div className="footer-brand">
                    <h3 className="brand-logo">H<span style={{ color: 'var(--primary-orange)' }}>P</span></h3>
                </div>

                <div className="footer-links-grid">
                    <div className="footer-col">
                        <h4>Company</h4>
                        <ul>
                            <li><a href="/about">About us</a></li>
                            <li><a href="/careers">Careers</a></li>
                            <li><a href="/press">Press</a></li>
                            <li><a href="/contact">Contact</a></li>
                            <li><a href="/blog">Blog</a></li>
                        </ul>
                    </div>
                    <div className="footer-col">
                        <h4>Resources</h4>
                        <ul>
                            <li><a href="/">Guides</a></li>
                            <li><a href="/litepaper">Litepaper</a></li>
                            <li><a href="/hiring-plug-whitepaper.pdf" target="_blank" rel="noreferrer">Whitepaper (PDF)</a></li>
                            <li><a href="/">Community</a></li>
                            <li><a href="/">Events</a></li>
                        </ul>
                    </div>
                    <div className="footer-col">
                        <h4>Legal</h4>
                        <ul>
                            <li><a href="/">Terms</a></li>
                            <li><a href="/">Privacy</a></li>
                            <li><a href="/">Cookies</a></li>
                            <li><a href="/">Disclaimer</a></li>
                            <li><a href="/">Compliance</a></li>
                        </ul>
                    </div>
                    <div className="footer-col">
                        <h4>Social</h4>
                        <ul>
                            <li><a href="/">Twitter</a></li>
                            <li><a href="/">LinkedIn</a></li>
                            <li><a href="/">Discord</a></li>
                            <li><a href="/">Telegram</a></li>
                            <li><a href="/">Medium</a></li>
                        </ul>
                    </div>
                    <div className="footer-col">
                        <h4>Connect</h4>
                        <ul>
                            <li><a href="/">Partner programme</a></li>
                            <li><a href="/">Become a contributor</a></li>
                            <li><a href="/">Refer a friend</a></li>
                            <li><a href="/">Support</a></li>
                            <li><a href="/">Help centre</a></li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <div className="footer-container bottom-flex">
                    <p>&copy; {new Date().getFullYear()} Hiring Plug. All rights reserved.</p>
                    <div className="legal-links">
                        <a href="/">Privacy policy</a>
                        <a href="/">Terms of service</a>
                        <a href="/">Cookie settings</a>
                    </div>
                    <div className="social-icons">
                        <a href="https://x.com/hiring_plug" target="_blank" rel="noreferrer"><FaTwitter /></a>
                        <a href="https://t.me/hiring_plug" target="_blank" rel="noreferrer"><FaTelegram /></a>
                        <a href="https://discord.com" target="_blank" rel="noreferrer"><FaDiscord /></a>
                        <a href="https://www.linkedin.com/company/hiring-plug" target="_blank" rel="noreferrer"><FaLinkedin /></a>
                        <a href="https://github.com/Hiring-Plug" target="_blank" rel="noreferrer"><FaGithub /></a>
                    </div>
                </div>
            </div>

            <style>{`
                .footer {
                    background-color: #000000;
                    color: #ffffff;
                    margin-top: auto;
                    border-top: 1px solid #222;
                }

                .footer-container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 20px;
                }

                .footer-top {
                    padding: 4rem 0;
                    background-color: #000000;
                    border-bottom: 1px solid #1a1a1a;
                }
                
                .footer-top .footer-container {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 2rem;
                }

                .stay-connected h3 {
                    font-size: 1.5rem;
                    margin-bottom: 0.5rem;
                    color: white;
                }

                .stay-connected p {
                    color: #a0a0a0;
                }

                .newsletter-form {
                    display: flex;
                    gap: 1rem;
                }

                .newsletter-input {
                    padding: 0.8rem 1rem;
                    border: 1px solid #333;
                    background: #111;
                    color: white;
                    min-width: 300px;
                    font-size: 1rem;
                }
                
                .newsletter-input:focus {
                    outline: none;
                    border-color: var(--primary-orange);
                }

                .newsletter-btn {
                    background-color: var(--primary-orange);
                    color: white;
                    padding: 0 1.5rem;
                    border: none;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                
                .newsletter-btn:hover {
                     filter: brightness(1.1);
                     transform: translateY(-1px);
                }

                .footer-content {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 4rem 20px;
                    display: flex;
                    gap: 4rem;
                }

                .brand-logo {
                    font-size: 1.5rem;
                    font-weight: 800;
                    color: white;
                }

                .footer-links-grid {
                    display: flex;
                    justify-content: space-between;
                    flex-grow: 1;
                    flex-wrap: wrap;
                    gap: 2rem;
                }

                .footer-col h4 {
                    color: var(--primary-orange);
                    margin-bottom: 1.5rem;
                    font-size: 1rem;
                }

                .footer-col ul {
                    list-style: none;
                }

                .footer-col li {
                    margin-bottom: 0.8rem;
                }

                .footer-col a {
                    color: #a0a0a0;
                    font-size: 0.9rem;
                    transition: color 0.2s;
                }

                .footer-col a:hover {
                    color: var(--primary-orange);
                }

                .footer-bottom {
                    border-top: 1px solid #1a1a1a;
                    padding: 2rem 0;
                    font-size: 0.85rem;
                    color: #666;
                }

                .bottom-flex {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 1rem;
                }

                .legal-links {
                    display: flex;
                    gap: 2rem;
                }

                .legal-links a {
                    text-decoration: underline;
                    color: #666;
                    transition: color 0.2s;
                }
                
                .legal-links a:hover {
                    color: white;
                }

                .social-icons {
                    display: flex;
                    gap: 1.5rem;
                    font-size: 1.2rem;
                    color: #fff;
                }
                
                .social-icons a {
                    color: white;
                    transition: all 0.3s;
                }
                
                .social-icons a:hover {
                    color: var(--primary-orange);
                    transform: translateY(-2px);
                }

                @media (max-width: 768px) {
                    .footer-content {
                        flex-direction: column;
                        gap: 2rem;
                    }
                    .footer-links-grid {
                        display: grid;
                        grid-template-columns: repeat(2, 1fr);
                    }
                    .newsletter-input {
                        min-width: auto;
                        width: 100%;
                    }
                    .footer-top .footer-container {
                        flex-direction: column;
                        align-items: flex-start;
                    }
                    .newsletter-form {
                        width: 100%;
                        flex-direction: column;
                    }
                    .bottom-flex {
                        flex-direction: column;
                        text-align: center;
                    }
                }
            `}</style>
        </footer>
    );
};

export default Footer;
