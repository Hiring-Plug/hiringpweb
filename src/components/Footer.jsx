import { FaTwitter, FaDiscord, FaGithub } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section">
                    <h3>Hiring<span style={{ color: 'var(--primary-orange)' }}>Plug</span></h3>
                    <p>Connecting talent with opportunity in Web3.</p>
                </div>
                <div className="footer-section">
                    <h4>Links</h4>
                    <ul>
                        <li><a href="/">Home</a></li>
                        <li><a href="/about">About</a></li>
                        <li><a href="/projects">Projects</a></li>
                    </ul>
                </div>
                <div className="footer-section social">
                    <h4>Socials</h4>
                    <div className="social-icons">
                        <FaTwitter />
                        <FaDiscord />
                        <FaGithub />
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                &copy; {new Date().getFullYear()} Hiring Plug. All rights reserved.
            </div>
            <style>{`
                .footer {
                    background-color: #000;
                    padding: 3rem 0 1rem;
                    border-top: 1px solid #333;
                    margin-top: auto;
                }
                .footer-content {
                    display: flex;
                    justify-content: space-around;
                    flex-wrap: wrap;
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 20px;
                }
                .footer-section {
                    margin-bottom: 2rem;
                }
                .footer-section h3, .footer-section h4 {
                    margin-bottom: 1rem;
                    color: white;
                }
                .footer-section ul {
                    list-style: none;
                }
                .footer-section ul li {
                    margin-bottom: 0.5rem;
                }
                .footer-section a {
                    color: #aaa;
                    transition: color 0.3s;
                }
                .footer-section a:hover {
                    color: var(--primary-orange);
                }
                .social-icons {
                    display: flex;
                    gap: 1rem;
                    font-size: 1.5rem;
                }
                .footer-bottom {
                    text-align: center;
                    margin-top: 2rem;
                    padding-top: 1rem;
                    border-top: 1px solid #222;
                    color: #666;
                }
            `}</style>
        </footer>
    );
};

export default Footer;
