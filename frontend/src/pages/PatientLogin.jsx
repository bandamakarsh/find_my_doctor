import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { User, KeyRound, Smartphone } from 'lucide-react';

const PatientLogin = () => {
    const [step, setStep] = useState(1);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const { login, user } = useContext(AuthContext);
    const navigate = useNavigate();

    React.useEffect(() => {
        if (user && user.role === 'patient') {
            navigate('/patient-dashboard');
        }
    }, [user, navigate]);

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        try {
            const res = await fetch('http://localhost:5000/api/auth/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, phone }),
            });

            const data = await res.json();
            if (res.ok) {
                setMessage('OTP sent! Check the backend console.');
                setStep(2);
            } else {
                setError(data.message || 'Failed to send OTP');
            }
        } catch (err) {
            setError('Server error');
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await fetch('http://localhost:5000/api/auth/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone, otp }),
            });

            const data = await res.json();
            if (res.ok) {
                login(data);
                navigate('/patient-dashboard');
            } else {
                setError(data.message || 'Invalid OTP');
            }
        } catch (err) {
            setError('Server error');
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
                    <p style={{ color: '#94A3B8' }}>{step === 1 ? 'Log in securely with your mobile number' : 'Enter the verification code sent to your phone'}</p>
                </div>
                
                {error && <div style={{ color: '#EF4444', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1.5rem', textAlign: 'center', fontWeight: '500' }}>{error}</div>}
                {message && <div style={{ color: '#10B981', backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1.5rem', textAlign: 'center', fontWeight: '500' }}>{message}</div>}

                {step === 1 ? (
                    <form onSubmit={handleSendOTP} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: '#E2E8F0', fontWeight: '500' }}>
                                <User size={18} /> Full Name
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. John Doe"
                                required
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
                                required
                                style={{ width: '100%', padding: '1rem', borderRadius: '0.75rem', border: '1px solid #334155', background: 'rgba(15, 23, 42, 0.8)', color: 'white', fontSize: '1.1rem' }}
                            />
                        </div>
                        <button type="submit" style={{ padding: '1rem', backgroundColor: '#10B981', color: 'white', border: 'none', borderRadius: '0.75rem', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.1rem', transition: 'background-color 0.2s', boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.39)' }}>
                            Send Secure Code
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOTP} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: '#E2E8F0', fontWeight: '500' }}>
                                <KeyRound size={18} /> 6-Digit OTP
                            </label>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder="• • • • • •"
                                maxLength="6"
                                required
                                style={{ width: '100%', padding: '1rem', borderRadius: '0.75rem', border: '1px solid #334155', background: 'rgba(15, 23, 42, 0.8)', color: 'white', fontSize: '1.5rem', letterSpacing: '0.5rem', textAlign: 'center' }}
                            />
                        </div>
                        <button type="submit" style={{ padding: '1rem', backgroundColor: '#10B981', color: 'white', border: 'none', borderRadius: '0.75rem', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.1rem', transition: 'background-color 0.2s', boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.39)' }}>
                            Verify & Login
                        </button>
                        <button type="button" onClick={() => setStep(1)} style={{ padding: '0.75rem', backgroundColor: 'transparent', color: '#94A3B8', border: '1px solid #334155', borderRadius: '0.75rem', cursor: 'pointer', fontWeight: '500' }}>
                            Go Back
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default PatientLogin;
