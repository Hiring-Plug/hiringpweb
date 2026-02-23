import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import { FaGoogle, FaGithub, FaWallet, FaArrowRight, FaArrowLeft, FaQuoteLeft, FaStar } from 'react-icons/fa';
import logo from '../assets/banner-dark-transparent.png';

const Login = () => {
    const { signIn } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [currentTestimonial, setCurrentTestimonial] = useState(0);

    const testimonials = [
        {
            quote: "Hiring Plug has transformed how I find Web3 opportunities. The platform is intuitive and the community is my best place to find web3 friends",
            author: "Sarah Chen",
            role: "Frontend Developer"
        },
        {
            quote: "Hiring Plug's HR dashboard has streamlined our entire recruitment cycle. The quality of Web3 talent we find here is unmatched.",
            author: "Michael Roberts",
            role: "HR Director"
        },
        {
            quote: "Managing multiple hiring projects used to be a nightmare. With Hiring Plug, we've reduced our time-to-hire by 40%.",
            author: "Jane Smith",
            role: "Talent Acquisition Lead"
        }
    ];

    const nextTestimonial = () => {
        setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    };

    const prevTestimonial = () => {
        setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const { error } = await signIn(email, password);
            if (error) throw error;
            navigate('/app/dashboard'); // Corrected navigation to dashboard
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const socialMethods = [
        { icon: <FaGoogle />, name: 'Google', onClick: () => alert('Google Login - Coming Soon') },
        { icon: <FaGithub />, name: 'GitHub', onClick: () => alert('GitHub Login - Coming Soon') },
        { icon: <FaWallet />, name: 'Wallet', onClick: () => alert('Metamask Login - Coming Soon') }
    ];

    return (
        <div className="login-container">
            {/* Left Side: Auth Form */}
            <div className="auth-section">
                <div className="auth-content">
                    <Link to="/" className="brand-logo">
                        <img src={logo} alt="Hiring Plug" />
                    </Link>

                    <div className="header-text">
                        <p>Please Enter your Account details</p>
                    </div>

                    {error && <div className="error-msg">{error}</div>}

                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="input-group">
                            <label>Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="Johndoe@gmail.com"
                            />
                        </div>

                        <div className="input-group">
                            <label>Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="••••••••"
                            />
                        </div>

                        <div className="forgot-pass">
                            <Link to="/forgot-password">Forgot Password</Link>
                        </div>

                        <Button variant="primary" type="submit" className="signin-btn" disabled={loading}>
                            {loading ? 'Signing in...' : 'Sign in'}
                        </Button>
                    </form>

                    <div className="social-auth">
                        {socialMethods.map((method, index) => (
                            <div key={index} className="social-item">
                                <button className="social-icon-btn" onClick={method.onClick}>
                                    {method.icon}
                                </button>
                                <span className="social-tooltip">{method.name}</span>
                            </div>
                        ))}
                    </div>

                    <div className="auth-footer">
                        <Link to="/signup">Create an account</Link>
                    </div>
                </div>
            </div>

            {/* Right Side: Brand Card */}
            <div className="brand-section">
                <div className="brand-card">
                    <div className="testimonial-header">
                        <h2>What's our<br />Talents Said.</h2>
                        <div className="quote-icon"><FaQuoteLeft /></div>
                    </div>

                    <div className="testimonial-body">
                        <p>"{testimonials[currentTestimonial].quote}"</p>

                        <div className="author-info">
                            <h4>{testimonials[currentTestimonial].author}</h4>
                            <p>{testimonials[currentTestimonial].role}</p>
                        </div>
                    </div>

                    <div className="testimonial-nav">
                        <button className="nav-btn prev" onClick={prevTestimonial}><FaArrowLeft /></button>
                        <button className="nav-btn next" onClick={nextTestimonial}><FaArrowRight /></button>
                    </div>

                    <div className="promo-box">
                        <div className="promo-content">
                            <h3>Get your right job and right<br />place apply now</h3>
                            <p>Be among the first founders to experience the easiest way to start run a business.</p>

                            <div className="promo-footer">
                                <div className="promo-trust">
                                    <span className="trust-dot"></span>
                                    <p>Trusted by 10k+ Web3 Professionals</p>
                                </div>
                            </div>
                            <div className="promo-badge">
                                <FaStar />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .login-container {
                    display: flex;
                    height: calc(100vh - 60px); /* Fits exactly below navbar */
                    margin-top: 60px;
                    background: #000;
                    color: #fff;
                    font-family: var(--font-main);
                    overflow: hidden;
                }

                /* Left Auth Section */
                .auth-section {
                    flex: 1;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 20px;
                    background: radial-gradient(circle at center, rgba(237, 80, 0, 0.05) 0%, #000 70%);
                }

                .auth-content {
                    width: 100%;
                    max-width: 360px;
                }

                .brand-logo img {
                    height: 32px;
                    margin-bottom: 30px;
                }

                .header-text p {
                    color: #aaa;
                    margin-bottom: 25px;
                    font-size: 0.95rem;
                }

                .login-form {
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                }

                .input-group {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .input-group label {
                    font-size: 0.85rem;
                    color: #fff;
                    font-weight: 500;
                }

                .input-group input {
                    background: #fff;
                    border: none;
                    padding: 12px 16px;
                    border-radius: 8px;
                    font-size: 0.9rem;
                    color: #000;
                }

                .forgot-pass {
                    text-align: right;
                }

                .forgot-pass a {
                    color: #fff;
                    font-size: 0.75rem;
                    text-decoration: underline;
                }

                .signin-btn {
                    margin-top: 5px;
                    padding: 12px !important;
                    font-size: 1rem !important;
                    background: #4ade80 !important; /* Green as in reference, button will use var later if needed */
                    background: var(--primary-orange) !important; /* Overriding with brand orange */
                    color: #fff !important;
                    border-radius: 8px !important;
                    font-weight: 600 !important;
                }

                .error-msg {
                    background: rgba(231, 76, 60, 0.1);
                    border: 1px solid #e74c3c;
                    color: #e74c3c;
                    padding: 8px;
                    border-radius: 6px;
                    margin-bottom: 15px;
                    font-size: 0.8rem;
                }

                .social-auth {
                    display: flex;
                    justify-content: center;
                    gap: 15px;
                    margin: 30px 0;
                }

                .social-item {
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }

                .social-icon-btn {
                    width: 44px;
                    height: 44px;
                    border-radius: 50%;
                    border: 1px solid #333;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.2rem;
                    color: #fff;
                    background: transparent;
                    transition: all 0.2s;
                    cursor: pointer;
                }

                .social-icon-btn:hover {
                    background: rgba(255,255,255,0.1);
                    transform: translateY(-2px);
                }

                .social-tooltip {
                    position: absolute;
                    bottom: -25px;
                    font-size: 0.7rem;
                    color: #aaa;
                    opacity: 0;
                    transition: opacity 0.2s;
                    white-space: nowrap;
                }

                .social-item:hover .social-tooltip {
                    opacity: 1;
                }

                .auth-footer {
                    text-align: center;
                    margin-top: 15px;
                }

                .auth-footer a {
                    color: #fff;
                    font-size: 0.9rem;
                    text-decoration: underline;
                }

                /* Right Brand Section */
                .brand-section {
                    flex: 1.2;
                    display: flex;
                    padding: 15px;
                    height: 100%;
                }

                .brand-card {
                    flex: 1;
                    background: var(--primary-orange);
                    border-radius: 30px;
                    padding: 40px;
                    display: flex;
                    flex-direction: column;
                    position: relative;
                    overflow: hidden;
                    justify-content: space-between;
                }

                .testimonial-header h2 {
                    font-size: 2.5rem;
                    line-height: 1.1;
                    margin-bottom: 15px;
                    color: #fff;
                }

                .quote-icon {
                    font-size: 2rem;
                    opacity: 0.8;
                }

                .testimonial-body {
                    margin: 20px 0;
                    max-width: 95%;
                    min-height: 120px;
                }

                .testimonial-body p {
                    font-size: 1.1rem;
                    line-height: 1.5;
                    margin-bottom: 25px;
                    font-weight: 400;
                    font-style: italic;
                    color: rgba(255,255,255,0.9);
                }

                .author-info h4 {
                    font-size: 1.2rem;
                    margin-bottom: 3px;
                }

                .author-info p {
                    font-size: 0.85rem;
                    opacity: 0.8;
                }

                .testimonial-nav {
                    display: flex;
                    gap: 12px;
                }

                .nav-btn {
                    width: 44px;
                    height: 44px;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1rem;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .nav-btn.prev {
                    background: rgba(255,255,255,0.2);
                    color: #fff;
                }

                .nav-btn.next {
                    background: #111;
                    color: #fff;
                }

                /* Bottom Promo Box */
                .promo-box {
                    background: #fff;
                    color: #000;
                    border-radius: 24px;
                    padding: 24px;
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                    margin-top: 25px;
                    position: relative;
                }

                .promo-content h3 {
                    font-size: 1.4rem;
                    line-height: 1.2;
                    margin-bottom: 12px;
                }

                .promo-content p {
                    font-size: 0.85rem;
                    color: #666;
                    margin-bottom: 20px;
                    max-width: 90%;
                }

                .promo-footer {
                    display: flex;
                    align-items: center;
                    margin-top: 10px;
                }

                .promo-trust {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    white-space: nowrap;
                    line-height: 1; /* Better vertical alignment */
                }

                .trust-dot {
                    width: 6px;
                    height: 6px;
                    background: #4ade80;
                    border-radius: 50%;
                    flex-shrink: 0;
                }

                .promo-trust p {
                    font-size: 0.8rem;
                    color: #777;
                    font-weight: 500;
                    margin: 0; /* Remove potential margins */
                }

                .promo-badge {
                    width: 36px;
                    height: 36px;
                    background: #fff;
                    border: 1px solid #eee;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1rem;
                    color: #000;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.05);
                    position: absolute;
                    top: 20px;
                    right: 20px;
                }

                /* Responsive */
                @media (max-width: 1024px) {
                    .login-container {
                        height: auto;
                        min-height: calc(100vh - 60px);
                        overflow-y: auto;
                    }
                    .brand-section {
                        display: none;
                    }
                    .auth-section {
                        padding: 40px 20px;
                    }
                }
            `}</style>
        </div>
    );
};

export default Login;
