import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { User, KeyRound, Mail, Smartphone } from 'lucide-react';

const PatientLogin = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const { login, user } = useContext(AuthContext);
    const navigate = useNavigate();

    React.useEffect(() => {
        if (user && user.role === 'patient') {
            navigate('/patient-dashboard');
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
        const payload = isLogin 
            ? { email, password, role: 'patient' }
            : { name, email, password, phone, role: 'patient' };

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            if (res.ok) {
                if (isLogin) {
                    login(data);
                    navigate('/patient-dashboard');
                } else {
                    setMessage('Registration successful! Logging you in...');
                    setTimeout(() => {
                        login(data);
                        navigate('/patient-dashboard');
                    }, 1000);
                }
            } else {
                setError(data.message || 'Authentication failed');
            }
        } catch (err) {
            setError('Server error. Please try again later.');
        }
    };

    return (
        <div className="login-container" style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(15, 23, 42, 1) 100%)', margin: '-2rem', padding: '2rem' }}>
            <div className="login-card" style={{ maxWidth: '450px', background: 'rgba(30, 41, 59, 0.95)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <div style={{ display: 'inline-flex', padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '50%', marginBottom: '1rem' }}>
                        <User size={48} color="#10B981" />
                    </div>
                    <h2 style={{ fontSize: '1.8rem', color: 'white', marginBottom: '0.5rem' }}>Patient Portal</h2>
                    <p style={{ color: '#94A3B8' }}>{isLogin ? 'Log in securely with your email' : 'Create a new account'}</p>
                </div>
                
                {error && <div style={{ color: '#EF4444', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1.5rem', textAlign: 'center', fontWeight: '500' }}>{error}</div>}
                {message && <div style={{ color: '#10B981', backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1.5rem', textAlign: 'center', fontWeight: '500' }}>{message}</div>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {!isLogin && (
                        <>
                            <div>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: '#E2E8F0', fontWeight: '500' }}>
                                    <User size={18} /> Full Name
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. John Doe"
                                    required={!isLogin}
                                    style={{ width: '100%', padding: '1rem', borderRadius: '0.75rem', border: '1px solid #334155', background: 'rgba(15, 23, 42, 0.8)', color: 'white', fontSize: '1.1rem' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: '#E2E8F0', fontWeight: '500' }}>
                                    <Smartphone size={18} /> Mobile Number
                                </label>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="e.g. 1234567890"
                                    required={!isLogin}
                                    style={{ width: '100%', padding: '1rem', borderRadius: '0.75rem', border: '1px solid #334155', background: 'rgba(15, 23, 42, 0.8)', color: 'white', fontSize: '1.1rem' }}
                                />
                            </div>
                        </>
                    )}
                    
                    <div>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: '#E2E8F0', fontWeight: '500' }}>
                            <Mail size={18} /> Email Address
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            required
                            style={{ width: '100%', padding: '1rem', borderRadius: '0.75rem', border: '1px solid #334155', background: 'rgba(15, 23, 42, 0.8)', color: 'white', fontSize: '1.1rem' }}
                        />
                    </div>
                    
                    <div>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: '#E2E8F0', fontWeight: '500' }}>
                            <KeyRound size={18} /> Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            style={{ width: '100%', padding: '1rem', borderRadius: '0.75rem', border: '1px solid #334155', background: 'rgba(15, 23, 42, 0.8)', color: 'white', fontSize: '1.1rem' }}
                        />
                    </div>
                    
                    <button type="submit" style={{ padding: '1rem', backgroundColor: '#10B981', color: 'white', border: 'none', borderRadius: '0.75rem', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.1rem', transition: 'background-color 0.2s', boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.39)' }}>
                        {isLogin ? 'Log In' : 'Sign Up'}
                    </button>
                    
                    <button type="button" onClick={() => setIsLogin(!isLogin)} style={{ padding: '0.75rem', backgroundColor: 'transparent', color: '#94A3B8', border: 'none', cursor: 'pointer', fontWeight: '500' }}>
                        {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PatientLogin;

