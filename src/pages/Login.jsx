import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import { FaGoogle, FaGithub, FaWallet, FaArrowRight, FaArrowLeft, FaQuoteLeft, FaStar } from 'react-icons/fa';
import logo from '../assets/banner-dark-transparent.png';
import { useAccount, useSignMessage, useDisconnect } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useToast } from '../context/ToastContext';

const Login = () => {
    const { signIn, signInWithWallet } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();

    // Auth Method State
    const [authMethod, setAuthMethod] = useState(null); // 'email' | 'wallet' | null

    // Form State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // Web3 Hooks
    const { address, isConnected, status } = useAccount();
    const { signMessageAsync } = useSignMessage();
    const { openConnectModal } = useConnectModal();
    const { disconnect } = useDisconnect();

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

    const nextTestimonial = () => setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    const prevTestimonial = () => setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);

    // Email Login Submit
    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const { error } = await signIn(email, password);
            if (error) throw error;
            navigate('/app/profile');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // console.log("Wallet Status Update:", { isConnected, address, status, authMethod, loading });
        if (authMethod === 'wallet' && isConnected && address && !loading) {
            handleWalletVerification();
        }
    }, [isConnected, address, authMethod]); // Removed 'status' to avoid extra triggers

    const handleWalletVerification = async () => {
        if (loading) {
            console.log("[Wallet-Auth] Verification already in progress. Skipping redundant call.");
            return;
        }
        
        setLoading(true);
        setError(null);
        try {
            console.log("Starting wallet verification for:", address);

            const domain = window.location.host;
            const message = `Sign in to Hiring Plug with your wallet\n\nDomain: ${domain}\nAddress: ${address}\nStatement: I am authenticating with my Hiring Plug account.\n\nNonce: ${Date.now()}\nIssued At: ${new Date().toISOString()}`;

            console.log("Requesting signature...");
            const signature = await signMessageAsync({ message });
            console.log("Signature received:", signature.substring(0, 10) + "...");
            await signInWithWallet(address, signature, message, true);
            console.log("Wallet sign-in successfully established session.");
            navigate('/app/profile');
        } catch (err) {
            console.error("Signature error:", err);
            let errMsg = `Wallet verification failed: ${err.message}`;
            if (err.debug_info) {
                console.log("Trace:", err.debug_info);
                errMsg += "\n\nDebug Trace (Check console): " + err.debug_info.join(' -> ');
            }
            setError(errMsg);
        } finally {
            setLoading(false);
        }
    };

    const startWalletLogin = () => {
        console.log("startWalletLogin clicked. IsConnected:", isConnected, "openConnectModal ready:", !!openConnectModal);
        setError(null);

        if (isConnected) {
            setAuthMethod('wallet');
            // The useEffect will trigger handleWalletVerification() automatically
        } else if (openConnectModal) {
            setAuthMethod('wallet');
            openConnectModal();
        } else {
            console.error("RainbowKit Modal not available yet.");
            setError("Connection modal is initializing. If this persists, please refresh the page.");
        }
    };

    const socialMethods = [
        { icon: <FaGoogle />, name: 'Google', onClick: () => showToast('Google Login - Coming Soon', 'info') },
        { icon: <FaGithub />, name: 'GitHub', onClick: () => showToast('GitHub Login - Coming Soon', 'info') },
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
                        <p>{authMethod === 'email' ? 'Please Enter your Account details' : 'Log in to your Account'}</p>
                    </div>

                    {error && <div className="error-msg">{error}</div>}

                    {/* METHOD SELECTION SCREEN */}
                    {!authMethod && (
                        <div className="method-selection">
                            <Button variant="outline" className="auth-method-btn" onClick={() => setAuthMethod('email')}>
                                Continue with Email
                            </Button>
                            <Button variant="primary" className="auth-method-btn wallet-btn" onClick={startWalletLogin}>
                                <FaWallet /> Connect Wallet
                            </Button>

                            <div className="auth-footer" style={{ marginTop: '30px' }}>
                                <Link to="/signup">Don't have an account? Sign up</Link>
                            </div>
                        </div>
                    )}

                    {/* EMAIL LOGIN SCREEN */}
                    {authMethod === 'email' && (
                        <>
                            <form onSubmit={handleEmailSubmit} className="login-form">
                                <div className="input-group">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        placeholder="johndoe@email.com"
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
                                <button type="button" className="back-link-btn" onClick={() => setAuthMethod(null)}>
                                    <FaArrowLeft style={{ marginRight: '8px' }} /> Back to options
                                </button>
                            </div>
                        </>
                    )}

                    {/* WALLET LOGIN SCREEN */}
                    {authMethod === 'wallet' && (
                        <div className="wallet-loading-screen">
                            {loading ? (
                                <div className="text-center">
                                    <p>Please sign the message in your wallet...</p>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <Button variant="outline" onClick={() => setAuthMethod(null)}>
                                        <FaArrowLeft /> Cancel
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
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
                    overflow-y: auto; /* Changed from hidden to allow scrolling if needed */
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

                .method-selection {
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                    margin-top: 20px;
                }

                .auth-method-btn {
                    width: 100%;
                    padding: 12px 16px !important;
                    font-size: 1rem !important;
                    border-radius: 8px !important;
                    display: flex !important;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    font-weight: 500 !important;
                }

                .wallet-btn {
                    background: #2a2a2a !important; /* Dark grey for wallet */
                    border: 1px solid #444 !important;
                    color: #fff !important;
                }
                
                .wallet-btn:hover {
                    background: #333 !important;
                }

                .back-link-btn {
                    background: none;
                    border: none;
                    color: #aaa;
                    font-size: 0.9rem;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 100%;
                    margin-top: 20px;
                    transition: color 0.2s;
                }
                
                .back-link-btn:hover {
                    color: #fff;
                }

                .wallet-loading-screen {
                    padding: 40px 0;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 20px;
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
                    height: 100%;
                    background: var(--primary-orange);
                    border-radius: 30px;
                    padding: 30px;
                    display: flex;
                    flex-direction: column;
                    position: relative;
                    overflow: visible;
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
                    border-radius: 20px;
                    padding: 20px;
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                    margin-top: 15px; /* Reduced from 25px */
                    position: relative;
                }

                .promo-content h3 {
                    font-size: 1.25rem; /* Reduced from 1.4rem */
                    line-height: 1.2;
                    margin-bottom: 10px;
                }

                .promo-content p {
                    font-size: 0.8rem; /* Reduced from 0.85rem */
                    color: #666;
                    margin-bottom: 15px;
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
