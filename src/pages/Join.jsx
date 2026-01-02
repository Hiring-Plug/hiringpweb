import Button from '../components/Button';
import { FaCheckCircle } from 'react-icons/fa';

const Join = () => {
    return (
        <div className="join-page">
            <div className="join-container">
                <div className="join-content">
                    <h1>Become Part of the <span className="highlight-text">Plug</span></h1>
                    <p className="join-intro">
                        Unlock exclusive opportunities, connect with top Web3 projects, and grow your career on-chain.
                    </p>
                    <ul className="benefits-list">
                        <li><FaCheckCircle className="check-icon" /> Access to unlisted job opportunities</li>
                        <li><FaCheckCircle className="check-icon" /> Verify your skills and reputation on-chain</li>
                        <li><FaCheckCircle className="check-icon" /> Earn rewards for referrals and contributions</li>
                        <li><FaCheckCircle className="check-icon" /> Join a global community of builders</li>
                    </ul>
                </div>

                <div className="join-form-card">
                    <h2>Get Started</h2>
                    <form className="signup-form" onSubmit={(e) => e.preventDefault()}>
                        <div className="form-group">
                            <label>Full Name</label>
                            <input type="text" placeholder="Satoshi Nakamoto" />
                        </div>
                        <div className="form-group">
                            <label>Email Address</label>
                            <input type="email" placeholder="satoshi@bitcoin.org" />
                        </div>
                        <div className="form-group">
                            <label>Primary Skill</label>
                            <select>
                                <option>Select Skill</option>
                                <option>Frontend Development</option>
                                <option>Smart Contracts</option>
                                <option>Design / UI/UX</option>
                                <option>Marketing / Community</option>
                            </select>
                        </div>
                        <Button variant="primary" className="submit-btn" onClick={() => alert('Welcome to the Plug! (Demo)')}>
                            Create Account
                        </Button>
                        <p className="login-link">Already have an account? <a href="#">Log in</a></p>
                    </form>
                </div>
            </div>

            <style>{`
                .join-page {
                    min-height: 90vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 2rem 20px;
                    background: radial-gradient(circle at top right, #2a2a2a 0%, #1a1a1a 60%);
                }
                .join-container {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 4rem;
                    max-width: 1200px;
                    width: 100%;
                    align-items: center;
                }
                .join-content h1 {
                    font-size: 3rem;
                    margin-bottom: 1.5rem;
                }
                .highlight-text {
                    color: var(--primary-orange);
                }
                .join-intro {
                    font-size: 1.2rem;
                    color: var(--text-dim);
                    margin-bottom: 2rem;
                    line-height: 1.6;
                }
                .benefits-list {
                    list-style: none;
                }
                .benefits-list li {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    margin-bottom: 1rem;
                    font-size: 1.1rem;
                }
                .check-icon {
                    color: var(--secondary-yellow);
                    flex-shrink: 0;
                }

                .join-form-card {
                    background: var(--bg-card);
                    padding: 2.5rem;
                    border-radius: 12px;
                    border: 1px solid #333;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                }
                .join-form-card h2 {
                    margin-bottom: 2rem;
                    text-align: center;
                    color: var(--primary-orange);
                }
                .form-group {
                    margin-bottom: 1.5rem;
                }
                .form-group label {
                    display: block;
                    margin-bottom: 0.5rem;
                    color: #ccc;
                    font-size: 0.9rem;
                }
                .form-group input, .form-group select {
                    width: 100%;
                    padding: 0.8rem;
                    background: #111;
                    border: 1px solid #444;
                    border-radius: 4px;
                    color: white;
                    font-family: inherit;
                    font-size: 1rem;
                }
                .form-group input:focus, .form-group select:focus {
                    outline: none;
                    border-color: var(--primary-orange);
                }
                .submit-btn {
                    width: 100%;
                    margin-top: 1rem;
                }
                .login-link {
                    text-align: center;
                    margin-top: 1.5rem;
                    font-size: 0.9rem;
                    color: #888;
                }
                .login-link a {
                    color: var(--primary-orange);
                }

                @media (max-width: 960px) {
                    .join-container {
                        grid-template-columns: 1fr;
                        gap: 3rem;
                    }
                    .join-content {
                        text-align: center;
                    }
                    .benefits-list li {
                        justify-content: center;
                    }
                }
            `}</style>
        </div>
    );
};

export default Join;
