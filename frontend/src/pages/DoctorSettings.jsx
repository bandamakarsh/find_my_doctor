import React, { useState, useEffect } from 'react';

const DoctorSettings = ({ user }) => {
    const [formData, setFormData] = useState({
        name: user.name || '',
        specialty: '',
        experience: '',
        consultationFee: '',
        imageUrl: '',
        description: ''
    });
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (user.doctorId) {
            fetch(`http://localhost:5000/api/doctors/${user.doctorId}`)
                .then(res => res.json())
                .then(data => {
                    setFormData({
                        name: data.name || '',
                        specialty: data.specialty || '',
                        experience: data.experience || '',
                        consultationFee: data.consultationFee || '',
                        imageUrl: data.imageUrl || '',
                        description: data.description || ''
                    });
                })
                .catch(err => console.error(err));
        }
    }, [user.doctorId]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`http://localhost:5000/api/doctors/${user.doctorId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                setMessage('Profile updated successfully!');
                setTimeout(() => setMessage(''), 3000);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div style={{ background: 'white', borderRadius: '1rem', border: '1px solid #E2E8F0', padding: '2rem' }}>
            <h2 style={{ margin: '0 0 1.5rem 0', color: '#0F172A' }}>Profile Settings</h2>
            {message && <div style={{ padding: '1rem', marginBottom: '1rem', background: '#D1FAE5', color: '#065F46', borderRadius: '0.5rem' }}>{message}</div>}
            
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#334155' }}>Name</label>
                        <input name="name" value={formData.name} onChange={handleChange} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #CBD5E1' }} />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#334155' }}>Specialty</label>
                        <input name="specialty" value={formData.specialty} onChange={handleChange} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #CBD5E1' }} />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#334155' }}>Experience (Years)</label>
                        <input type="number" name="experience" value={formData.experience} onChange={handleChange} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #CBD5E1' }} />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#334155' }}>Consultation Fee (₹)</label>
                        <input type="number" name="consultationFee" value={formData.consultationFee} onChange={handleChange} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #CBD5E1' }} />
                    </div>
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#334155' }}>Profile Image URL</label>
                    <input name="imageUrl" value={formData.imageUrl} onChange={handleChange} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #CBD5E1' }} />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#334155' }}>Description / Bio</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} rows="4" style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #CBD5E1' }}></textarea>
                </div>

                <button type="submit" style={{ padding: '0.75rem 1.5rem', background: '#4F46E5', color: 'white', border: 'none', borderRadius: '0.5rem', fontWeight: 'bold', cursor: 'pointer', maxWidth: '200px' }}>Save Changes</button>
            </form>
        </div>
    );
};

export default DoctorSettings;
