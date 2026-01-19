
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import { FaGoogle, FaGithub, FaWallet, FaLock } from 'react-icons/fa';

const Login = () => {
    const { signIn } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const { error } = await signIn(email, password);
            if (error) throw error;
            navigate('/projects');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h2><FaLock style={{ color: 'var(--primary-orange)', marginRight: '10px' }} /> Log In</h2>

                {error && <div className="error-alert">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="you@example.com"
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                        />
                    </div>

                    <Button variant="primary" type="submit" className="full-width" disabled={loading}>
                        {loading ? 'Logging in...' : 'Log In'}
                    </Button>
                </form>

                <div className="divider"><span>OR</span></div>

                <div className="social-login">
                    <button className="social-btn" onClick={() => alert('Metamask Login - Coming Soon')}><FaWallet /> Connect Wallet</button>
                    <button className="social-btn google" onClick={() => alert('Google Login - Coming Soon')}><FaGoogle /> Google</button>
                    <button className="social-btn github" onClick={() => alert('GitHub Login - Coming Soon')}><FaGithub /> GitHub</button>
                </div>

                <p className="auth-footer">
                    Don't have an account? <Link to="/signup">Sign Up</Link>
                </p>
            </div>

            <style>{`
                .auth-page {
                    min-height: 80vh;
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
                    max-width: 420px;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.5);
                }
                h2 {
                    text-align: center;
                    margin-bottom: 2rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.8rem;
                }
                .form-group {
                    margin-bottom: 1.5rem;
                }
                .form-group label {
                    display: block;
                    margin-bottom: 0.5rem;
                    color: #aaa;
                    font-size: 0.9rem;
                }
                .form-group input {
                    width: 100%;
                    padding: 0.8rem 1rem;
                    background: #050505;
                    border: 1px solid #333;
                    border-radius: 6px;
                    color: #fff;
                    font-size: 1rem;
                }
                .form-group input:focus {
                    outline: none;
                    border-color: var(--primary-orange);
                }
                .full-width {
                    width: 100%;
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
                .social-btn.google:hover { background: #333; border-color: #444; }
                .social-btn.github:hover { background: #333; border-color: #444; }

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

export default Login;
