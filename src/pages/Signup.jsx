
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import { FaUserPlus, FaGoogle, FaGithub, FaWallet } from 'react-icons/fa';

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
                primarySkill: formData.primarySkill
            });

            if (error) throw error;

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

    if (successMsg) {
        return (
            <div className="auth-page">
                <div className="auth-card success-card">
                    <h2><FaUserPlus style={{ color: '#4cd137' }} /> Check Your Email</h2>
                    <p>{successMsg}</p>
                    <Link to="/login" className="back-link">Back to Login</Link>
                </div>
                <style>{`
                    .auth-page { display: flex; align-items: center; justify-content: center; height: 80vh; }
                    .auth-card { background: #111; padding: 2rem; border-radius: 12px; border: 1px solid #222; text-align: center; color: white; }
                    .back-link { display: inline-block; margin-top: 1rem; color: var(--primary-orange); }
                `}</style>
            </div>
        );
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h2>Create Account</h2>

                {error && <div className="error-alert">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
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
                    <div className="form-group">
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
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="Create a password"
                            minLength="6"
                        />
                    </div>

                    <div className="form-group">
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

                    <div className="form-group">
                        <label>{formData.role === 'project' ? 'Hiring Position / Role' : 'Primary Focus'}</label>
                        <select
                            name="primarySkill"
                            value={formData.primarySkill}
                            onChange={handleChange}
                            required
                        >
                            <option value="" disabled>Select your major skill</option>
                            <option value="developer">Developer</option>
                            <option value="designer">Designer</option>
                            <option value="marketing">Marketing & Growth</option>
                            <option value="community">Community Manager</option>
                            <option value="product">Product Manager</option>
                            {formData.role === 'project' && <option value="founder">Founder / CEO</option>}
                            {formData.role === 'project' && <option value="hr">HR / Recruiter</option>}
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <Button variant="primary" type="submit" className="full-width" disabled={loading}>
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </Button>
                </form>

                <div className="divider"><span>OR</span></div>

                <div className="social-login">
                    <button className="social-btn" onClick={() => alert('Metamask Signup - Coming Soon')}><FaWallet /> Sign up with Wallet</button>
                    <button className="social-btn google" onClick={() => alert('Google Signup - Coming Soon')}><FaGoogle /> Google</button>
                    <button className="social-btn github" onClick={() => alert('GitHub Signup - Coming Soon')}><FaGithub /> GitHub</button>
                </div>

                <p className="auth-footer">
                    Already have an account? <Link to="/login">Log In</Link>
                </p>
            </div>

            <style>{`
                .auth-page {
                    min-height: 90vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 2rem;
                }
                .auth-card {
                    background: #111;
                    border: 1px solid #222;
                    padding: 2.5rem;
                    border-radius: 12px;
                    width: 100%;
                    max-width: 480px;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.5);
                }
                h2 {
                    text-align: center;
                    margin-bottom: 2rem;
                    color: white;
                }
                .form-group {
                    margin-bottom: 1.2rem;
                }
                .form-group label {
                    display: block;
                    margin-bottom: 0.5rem;
                    color: #aaa;
                    font-size: 0.9rem;
                }
                .form-group input, .form-group select {
                    width: 100%;
                    padding: 0.8rem 1rem;
                    background: #050505;
                    border: 1px solid #333;
                    border-radius: 6px;
                    color: #fff;
                    font-size: 1rem;
                }
                .form-group input:focus, .form-group select:focus {
                    outline: none;
                    border-color: var(--primary-orange);
                }

                .role-selector {
                    display: flex;
                    gap: 1rem;
                }
                .role-option {
                    flex: 1;
                    padding: 0.8rem;
                    border: 1px solid #333;
                    border-radius: 6px;
                    text-align: center;
                    cursor: pointer;
                    background: #050505;
                    color: #888;
                    transition: all 0.2s;
                    position: relative;
                }
                .role-option input {
                    position: absolute;
                    opacity: 0;
                    cursor: pointer;
                }
                .role-option.active {
                    background: rgba(237, 80, 0, 0.1);
                    border-color: var(--primary-orange);
                    color: var(--primary-orange);
                    font-weight: 600;
                }

                .full-width {
                    width: 100%;
                    font-size: 1.1rem;
                    padding: 0.8rem;
                }
                .error-alert {
                    background: rgba(231, 76, 60, 0.1);
                    color: #e74c3c;
                    padding: 10px;
                    border-radius: 6px;
                    margin-bottom: 1.5rem;
                    font-size: 0.9rem;
                    text-align: center;
                    border: 1px solid #e74c3c;
                }

                .divider {
                    display: flex;
                    align-items: center;
                    margin: 1.5rem 0;
                    color: #444;
                    font-size: 0.8rem;
                }
                .divider::before, .divider::after {
                    content: '';
                    flex: 1;
                    height: 1px;
                    background: #222;
                }
                .divider span {
                    padding: 0 10px;
                }

                .social-login {
                    display: flex;
                    flex-direction: column;
                    gap: 0.8rem;
                }
                .social-btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.8rem;
                    padding: 0.8rem;
                    border-radius: 6px;
                    border: 1px solid #333;
                    background: #1a1a1a;
                    color: #fff;
                    cursor: pointer;
                    transition: all 0.2s;
                    font-weight: 500;
                }
                .social-btn:hover {
                    background: #222;
                }

                .auth-footer {
                    text-align: center;
                    margin-top: 1.5rem;
                    color: #888;
                    font-size: 0.95rem;
                }
                .auth-footer a {
                    color: var(--primary-orange);
                    text-decoration: underline;
                }
            `}</style>
        </div>
    );
};

export default Signup;
