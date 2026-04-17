import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stethoscope } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const DoctorRegister = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        specialty: '',
        experience: '',
        consultationFee: '',
        description: '',
        imageUrl: '',
        hospital: '',
        availability: ''
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const { login, user } = useContext(AuthContext);
    const navigate = useNavigate();

    React.useEffect(() => {
        if (user && user.role === 'doctor') {
            navigate('/doctor-dashboard');
        }
    }, [user, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/register-doctor`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            if (res.ok) {
                setMessage(data.message || 'Registration successful! Pending admin approval.');
                if (data.token) {
                    login(data);
                    setTimeout(() => {
                        navigate('/doctor-dashboard');
                    }, 2000);
                } else {
                    setTimeout(() => {
                        navigate('/doctor-login');
                    }, 3000);
                }
            } else {
                setError(data.message || 'Registration failed');
            }
        } catch (err) {
            setError('Server error');
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '0 1rem' }}>
            <div className="card">
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <Stethoscope size={48} color="#818CF8" />
                    <h2>Doctor Registration</h2>
                    <p style={{ color: '#6b7280' }}>Join our platform. Your profile will be visible after admin approval.</p>
                </div>

                {message && <div style={{ padding: '1rem', marginBottom: '1rem', background: '#D1FAE5', color: '#065F46', borderRadius: '0.5rem' }}>{message}</div>}
                {error && <div style={{ padding: '1rem', marginBottom: '1rem', background: '#FEE2E2', color: '#991B1B', borderRadius: '0.5rem' }}>{error}</div>}

                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
                    <div>
                        <label className="form-label">Full Name</label>
                        <input name="name" type="text" className="form-input" required onChange={handleChange} />
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label className="form-label">Email</label>
                            <input name="email" type="email" className="form-input" required onChange={handleChange} />
                        </div>
                        <div>
                            <label className="form-label">Password</label>
                            <input name="password" type="password" className="form-input" required onChange={handleChange} />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label className="form-label">Phone Number</label>
                            <input name="phone" type="text" className="form-input" required onChange={handleChange} />
                        </div>
                        <div>
                            <label className="form-label">Specialty (e.g., Cardiologist)</label>
                            <input name="specialty" type="text" className="form-input" required onChange={handleChange} />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label className="form-label">Experience (Years)</label>
                            <input name="experience" type="number" className="form-input" required onChange={handleChange} />
                        </div>
                        <div>
                            <label className="form-label">Consultation Fee (₹)</label>
                            <input name="consultationFee" type="number" className="form-input" required onChange={handleChange} />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label className="form-label">Hospital / Clinic Name</label>
                            <input name="hospital" type="text" className="form-input" required onChange={handleChange} />
                        </div>
                        <div>
                            <label className="form-label">Availability (e.g., Mon-Fri, 9AM-5PM)</label>
                            <input name="availability" type="text" className="form-input" required onChange={handleChange} />
                        </div>
                    </div>

                    <div>
                        <label className="form-label">Profile Image URL (Optional)</label>
                        <input name="imageUrl" type="text" className="form-input" onChange={handleChange} placeholder="https://example.com/photo.jpg" />
                    </div>

                    <div>
                        <label className="form-label">Description / Bio</label>
                        <textarea name="description" className="form-input" rows="3" onChange={handleChange}></textarea>
                    </div>

                    <button type="submit" className="btn" style={{ marginTop: '1rem' }}>Register as Doctor</button>
                    <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                        <a href="/doctor-login" style={{ color: '#4F46E5', textDecoration: 'none' }}>Already registered? Sign in here</a>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DoctorRegister;
