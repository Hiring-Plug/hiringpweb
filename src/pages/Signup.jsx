import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import { FaGoogle, FaGithub, FaWallet, FaArrowRight, FaArrowLeft, FaQuoteLeft, FaStar } from 'react-icons/fa';
import logo from '../assets/banner-dark-transparent.png';
import { supabase } from '../supabaseClient'; // Assuming supabase is needed for the profile creation logic

const Signup = () => {
    const { signUp } = useAuth();
    const navigate = useNavigate();

    // Form State
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'talent', // Default role
        primarySkill: ''
    });

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [currentTestimonial, setCurrentTestimonial] = useState(0);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const skillOptions = [
        { value: 'developer', label: 'Developer' },
        { value: 'designer', label: 'Designer' },
        { value: 'marketing', label: 'Marketing & Growth' },
        { value: 'community', label: 'Community Manager' },
        { value: 'product', label: 'Product Manager' },
        ...(formData.role === 'project' ? [
            { value: 'founder', label: 'Founder / CEO' },
            { value: 'hr', label: 'HR / Recruiter' }
        ] : []),
        { value: 'other', label: 'Other' }
    ];

    const selectSkill = (val) => {
        setFormData({ ...formData, primarySkill: val });
        setIsDropdownOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isDropdownOpen && !event.target.closest('.custom-dropdown')) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isDropdownOpen]);

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

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const { error, data } = await signUp(formData.email, formData.password, {
                username: formData.username,
                role: formData.role,
                primary_skill: formData.primarySkill
            });

            if (error) throw error;

            // Auto-create profile record to ensure joins work later
            if (data?.user) {
                await supabase.from('profiles').insert([{
                    id: data.user.id,
                    username: formData.username,
                    role: formData.role,
                    primary_skill: formData.primarySkill,
                    updated_at: new Date()
                }]);
            }

            if (data?.user && !data?.session) {
                setSuccessMsg('Registration successful! Please check your email to verify your account.');
            } else {
                navigate('/app/settings');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const socialMethods = [
        { icon: <FaGoogle />, name: 'Google', onClick: () => alert('Google Signup - Coming Soon') },
        { icon: <FaGithub />, name: 'GitHub', onClick: () => alert('GitHub Signup - Coming Soon') },
        { icon: <FaWallet />, name: 'Wallet', onClick: () => alert('Metamask Signup - Coming Soon') }
    ];

    if (successMsg) {
        return (
            <div className="signup-container success-view">
                <div className="auth-section">
                    <div className="auth-content text-center">
                        <Link to="/" className="brand-logo">
                            <img src={logo} alt="Hiring Plug" />
                        </Link>
                        <h2 className="success-title">Check Your Email</h2>
                        <p className="success-desc">{successMsg}</p>
                        <Link to="/login" className="back-link">Back to Login</Link>
                    </div>
                </div>
                <style>{`
                    .signup-container.success-view { height: calc(100vh - 60px); display: flex; align-items: center; justify-content: center; background: #000; color: #fff; margin-top: 60px; zoom: 0.9; }
                    .success-view .auth-section { flex: 1; display: flex; justify-content: center; }
                    .success-title { font-size: 2rem; margin-bottom: 1rem; color: #4ade80; }
                    .success-desc { color: #aaa; margin-bottom: 2rem; }
                    .back-link { color: var(--primary-orange); text-decoration: underline; font-weight: 500; }
                    .text-center { text-align: center; }
                    .brand-logo img { height: 32px; margin-bottom: 30px; }
                `}</style>
            </div>
        );
    }

    return (
        <div className="signup-container">
            {/* Left Side: Auth Form */}
            <div className="auth-section">
                <div className="auth-content">
                    <Link to="/" className="brand-logo">
                        <img src={logo} alt="Hiring Plug" />
                    </Link>

                    <div className="header-text">
                        <p>Create your account to join Hiring Plug</p>
                    </div>

                    {error && <div className="error-msg">{error}</div>}

                    <form onSubmit={handleSubmit} className="signup-form">
                        <div className="form-row">
                            <div className="input-group">
                                <label>Username</label>
                                <input
                                    name="username"
                                    type="text"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                    placeholder="Satoshi"
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="input-group">
                                <label>Email Address</label>
                                <input
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="input-group">
                                <label>Password</label>
                                <input
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    placeholder="••••••••"
                                    minLength="6"
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="input-group">
                                <label>I am joining as a...</label>
                                <div className="role-selector">
                                    <label className={`role-option ${formData.role === 'talent' ? 'active' : ''}`}>
                                        <input
                                            type="radio"
                                            name="role"
                                            value="talent"
                                            checked={formData.role === 'talent'}
                                            onChange={handleChange}
                                        />
                                        Talent
                                    </label>
                                    <label className={`role-option ${formData.role === 'project' ? 'active' : ''}`}>
                                        <input
                                            type="radio"
                                            name="role"
                                            value="project"
                                            checked={formData.role === 'project'}
                                            onChange={handleChange}
                                        />
                                        Project
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="input-group">
                                <label>{formData.role === 'project' ? 'Hiring Position / Role' : 'Primary Focus'}</label>
                                <div className={`custom-dropdown ${isDropdownOpen ? 'open' : ''}`}>
                                    <div
                                        className="dropdown-trigger"
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    >
                                        {formData.primarySkill
                                            ? skillOptions.find(opt => opt.value === formData.primarySkill)?.label
                                            : 'Select your focus'}
                                        <span className="dropdown-arrow"></span>
                                    </div>

                                    {isDropdownOpen && (
                                        <div className="dropdown-menu">
                                            {skillOptions.map((opt) => (
                                                <div
                                                    key={opt.value}
                                                    className={`dropdown-item ${formData.primarySkill === opt.value ? 'selected' : ''}`}
                                                    onClick={() => selectSkill(opt.value)}
                                                >
                                                    {opt.label}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                {/* Hidden input for form submission if needed, though we use formData state */}
                                <input type="hidden" name="primarySkill" value={formData.primarySkill} required />
                            </div>
                        </div>

                        <Button variant="primary" type="submit" className="signup-btn" disabled={loading}>
                            {loading ? 'Creating Account...' : 'Sign Up'}
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
                        Already have an account? <Link to="/login">Log In</Link>
                    </div>
                </div>
            </div>

            {/* Right Side: Brand Card (Exact copy from Login.jsx) */}
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
                .signup-container {
                    display: flex;
                    height: calc(100vh - 60px);
                    margin-top: 60px;
                    background: #000;
                    color: #fff;
                    font-family: var(--font-main);
                    overflow-y: auto;
                }

                /* Left Auth Section */
                .auth-section {
                    flex: 1;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 20px;
                    background: radial-gradient(circle at center, rgba(237, 80, 0, 0.05) 0%, #000 70%);
                    overflow-y: auto; /* Allow scrolling for signup form if needed */
                }

                .auth-content {
                    width: 100%;
                    max-width: 360px;
                    padding: 20px 0;
                }

                .brand-logo img {
                    height: 32px;
                    margin-bottom: 20px;
                }

                .header-text p {
                    color: #aaa;
                    margin-bottom: 20px;
                    font-size: 0.95rem;
                }

                .signup-form {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }

                .input-group {
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                }

                .input-group label {
                    font-size: 0.8rem;
                    color: #fff;
                    font-weight: 500;
                }

                .input-group input, .dropdown-trigger {
                    background: #fff;
                    border: 1px solid #e0e0e0;
                    padding: 12px 14px;
                    border-radius: 10px;
                    font-size: 0.9rem;
                    color: #000;
                    width: 100%;
                    transition: all 0.2s;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.02);
                    cursor: pointer;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .input-group input:focus, .custom-dropdown.open .dropdown-trigger {
                    outline: none;
                    border-color: #333;
                    box-shadow: 0 0 0 3px rgba(237, 80, 0, 0.1);
                }

                .custom-dropdown {
                    position: relative;
                    width: 100%;
                }

                .dropdown-arrow {
                    width: 10px;
                    height: 10px;
                    border-left: 2px solid #666;
                    border-bottom: 2px solid #666;
                    transform: rotate(-45deg);
                    margin-bottom: 4px;
                    transition: transform 0.3s;
                }

                .custom-dropdown.open .dropdown-arrow {
                    transform: rotate(135deg);
                    margin-bottom: -4px;
                }

                .dropdown-menu {
                    position: absolute;
                    top: calc(100% + 5px);
                    left: 0;
                    right: 0;
                    background: #111;
                    border: 1px solid #333;
                    border-radius: 12px;
                    z-index: 100;
                    overflow: hidden;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.5);
                    animation: slideDown 0.2s ease-out;
                }

                @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .dropdown-item {
                    padding: 12px 16px;
                    font-size: 0.9rem;
                    color: #ccc;
                    cursor: pointer;
                    transition: all 0.2s;
                    border-bottom: 1px solid #222;
                }

                .dropdown-item:last-child {
                    border-bottom: none;
                }

                .dropdown-item:hover {
                    background: rgba(237, 80, 0, 0.1);
                    color: var(--primary-orange);
                    padding-left: 20px;
                }

                .dropdown-item.selected {
                    background: rgba(237, 80, 0, 0.2);
                    color: var(--primary-orange);
                    font-weight: 600;
                }

                .role-selector {
                    display: flex;
                    gap: 10px;
                }

                .role-option {
                    flex: 1;
                    padding: 8px;
                    background: #111;
                    border: 1px solid #333;
                    border-radius: 8px;
                    text-align: center;
                    cursor: pointer;
                    font-size: 0.85rem;
                    color: #888;
                    transition: all 0.2s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .role-option input {
                    display: none;
                }

                .role-option.active {
                    background: rgba(237, 80, 0, 0.1);
                    border-color: var(--primary-orange);
                    color: var(--primary-orange);
                    font-weight: 600;
                }

                .signup-btn {
                    margin-top: 12px;
                    padding: 14px !important;
                    font-size: 1rem !important;
                    background: linear-gradient(135deg, var(--primary-orange) 0%, #ff6b1a 100%) !important;
                    color: #fff !important;
                    border-radius: 12px !important;
                    font-weight: 600 !important;
                    border: none !important;
                    cursor: pointer !important;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
                    box-shadow: 0 4px 15px rgba(237, 80, 0, 0.3) !important;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .signup-btn:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(237, 80, 0, 0.4) !important;
                    filter: brightness(1.1);
                }

                .signup-btn:active:not(:disabled) {
                    transform: translateY(0);
                }

                .signup-btn:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                    filter: grayscale(0.5);
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
                    margin: 20px 0;
                }

                .social-item {
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }

                .social-icon-btn {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    border: 1px solid #333;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.1rem;
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
                    font-size: 0.85rem;
                    color: #888;
                }

                .auth-footer a {
                    color: #fff;
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
                    margin-top: 15px;
                    position: relative;
                }

                .promo-content h3 {
                    font-size: 1.25rem;
                    line-height: 1.2;
                    margin-bottom: 10px;
                }

                .promo-content p {
                    font-size: 0.8rem;
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
                    line-height: 1;
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
                    margin: 0;
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
                    .signup-container {
                        height: auto;
                        min-height: calc(100vh - 60px);
                        overflow-y: auto;
                    }
                    .brand-section {
                        display: none;
                    }
                    .auth-section {
                        padding: 40px 20px;
                        height: auto;
                        overflow-y: visible;
                    }
                }
            `}</style>
        </div>
    );
};

export default Signup;
