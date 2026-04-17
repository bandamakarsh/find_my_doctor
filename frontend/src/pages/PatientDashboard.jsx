import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Search, Calendar, Activity, Clock, FileText, ChevronRight, Star } from 'lucide-react';
import axios from 'axios';

const PatientDashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [doctors, setDoctors] = useState([]);
    const [appointments, setAppointments] = useState([]);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const resDoctors = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/doctors`);
                setDoctors(resDoctors.data);

                if (user?.phone) {
                    const resApts = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/appointments/patient/${user.phone}`);
                    setAppointments(resApts.data);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [user?.phone]);

    return (
        <div style={{ background: '#F8FAFC', minHeight: '100vh', margin: '-2rem', padding: '3rem' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#0F172A', margin: '0 0 0.5rem 0' }}>
                        Hello, {user.name || 'Patient'} 👋
                    </h1>
                    <p style={{ color: '#64748B', fontSize: '1.1rem', margin: 0 }}>
                        Welcome back to your personal health portal.
                    </p>
                </div>
                <div style={{ background: 'white', padding: '0.75rem 1.5rem', borderRadius: '1rem', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '0.75rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
                    <Activity color="#10B981" />
                    <span style={{ fontWeight: '600', color: '#1E293B' }}>All systems operational</span>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '2rem' }}>
                {/* Main Content - Left Side */}
                <div style={{ gridColumn: 'span 8', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    
                    {/* Action Banner */}
                    <div style={{ 
                        background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', 
                        borderRadius: '1.5rem', 
                        padding: '2.5rem',
                        color: 'white',
                        position: 'relative',
                        overflow: 'hidden',
                        boxShadow: '0 20px 25px -5px rgba(16, 185, 129, 0.3)'
                    }}>
                        <div style={{ position: 'relative', zIndex: 2, maxWidth: '60%' }}>
                            <h2 style={{ fontSize: '1.8rem', margin: '0 0 1rem 0', fontWeight: '700' }}>Need a Consultation?</h2>
                            <p style={{ margin: '0 0 2rem 0', opacity: 0.9, fontSize: '1.1rem' }}>Find the best hyperlocal doctors and book your digital token instantly to avoid waiting in queues.</p>
                            <button 
                                onClick={() => navigate('/search')}
                                style={{ background: 'white', color: '#059669', border: 'none', padding: '1rem 2rem', borderRadius: '1rem', fontSize: '1.1rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'transform 0.2s' }}
                                onMouseOver={e=>e.currentTarget.style.transform='translateY(-2px)'}
                                onMouseOut={e=>e.currentTarget.style.transform='translateY(0)'}
                            >
                                <Search size={20} /> Browse Doctors
                            </button>
                        </div>
                        <Calendar size={200} color="white" style={{ position: 'absolute', right: '-20px', bottom: '-40px', opacity: 0.1, transform: 'rotate(-15deg)' }} />
                    </div>

                    {/* Appointments List */}
                    <div style={{ background: 'white', borderRadius: '1.5rem', padding: '2rem', border: '1px solid #E2E8F0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#0F172A', fontWeight: '700' }}>Your Appointments</h3>
                            <button style={{ background: 'transparent', border: 'none', color: '#6366F1', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>View all <ChevronRight size={16} /></button>
                        </div>
                        
                        {appointments.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {appointments.map(apt => (
                                    <div key={apt._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', border: '1px solid #E2E8F0', borderRadius: '1rem', background: '#F8FAFC' }}>
                                        <div>
                                            <h4 style={{ margin: '0 0 0.5rem 0', color: '#0F172A', fontSize: '1.1rem' }}>Token #{apt.tokenNumber}</h4>
                                            <p style={{ margin: '0 0 0.25rem 0', color: '#64748B', fontSize: '0.875rem', fontWeight: '500' }}>Dr. {apt.doctorId?.name || 'Unknown Doctor'}</p>
                                            <p style={{ margin: 0, color: '#94A3B8', fontSize: '0.875rem' }}>{new Date(apt.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <div style={{ 
                                            padding: '0.5rem 1rem', 
                                            borderRadius: '2rem', 
                                            fontSize: '0.875rem', 
                                            fontWeight: '600', 
                                            background: apt.status === 'completed' ? '#D1FAE5' : apt.status === 'consulting' ? '#FEF3C7' : '#E0E7FF',
                                            color: apt.status === 'completed' ? '#059669' : apt.status === 'consulting' ? '#D97706' : '#4338CA'
                                        }}>
                                            {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={{ padding: '2rem', textAlign: 'center', border: '2px dashed #E2E8F0', borderRadius: '1rem', color: '#64748B' }}>
                                <Clock size={40} style={{ margin: '0 auto 1rem auto', opacity: 0.5 }} />
                                <p style={{ margin: 0, fontWeight: '500' }}>You have no active appointments right now.</p>
                            </div>
                        )}
                    </div>

                    {/* Available Doctors List */}
                    <div style={{ background: 'white', borderRadius: '1.5rem', padding: '2rem', border: '1px solid #E2E8F0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#0F172A', fontWeight: '700' }}>Our Top Doctors</h3>
                            <button onClick={() => navigate('/search')} style={{ background: 'transparent', border: 'none', color: '#6366F1', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>See all <ChevronRight size={16} /></button>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
                            {doctors.length > 0 ? doctors.slice(0, 3).map(doc => (
                                <div key={doc._id} style={{ border: '1px solid #E2E8F0', borderRadius: '1rem', padding: '1.5rem', backgroundColor: '#F8FAFC' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                        <span style={{ background: '#E0E7FF', color: '#4338CA', padding: '0.25rem 0.5rem', borderRadius: '0.5rem', fontSize: '0.75rem', fontWeight: '600' }}>{doc.specialty}</span>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#F59E0B', fontSize: '0.875rem' }}>
                                            <Star size={14} fill="currentColor" /> {doc.rating || 5.0}
                                        </div>
                                    </div>
                                    <h4 style={{ margin: '0 0 0.5rem 0', color: '#0F172A', fontSize: '1.1rem' }}>{doc.name}</h4>
                                    <p style={{ margin: '0 0 1rem 0', color: '#64748B', fontSize: '0.875rem' }}>{doc.hospital}</p>
                                    <Link to={`/doctor/${doc._id}`} style={{ display: 'block', textAlign: 'center', background: '#10B981', color: 'white', textDecoration: 'none', padding: '0.5rem', borderRadius: '0.5rem', fontWeight: '600' }}>View Profile</Link>
                                </div>
                            )) : <p style={{ color: '#64748B' }}>No doctors available right now.</p>}
                        </div>
                    </div>

                </div>

                {/* Sidebar - Right Side */}
                <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    
                    {/* Profile Summary */}
                    <div style={{ background: 'white', borderRadius: '1.5rem', padding: '2rem', border: '1px solid #E2E8F0', textAlign: 'center' }}>
                        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#F1F5F9', margin: '0 auto 1rem auto', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B', fontSize: '2rem', fontWeight: '800' }}>
                           {user.name ? user.name.charAt(0).toUpperCase() : 'P'}
                        </div>
                        <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.25rem', color: '#0F172A' }}>{user.name || 'Patient'}</h3>
                        <p style={{ margin: '0 0 1.5rem 0', color: '#64748B', fontSize: '0.875rem' }}>{user.phone}</p>
                        
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                            <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '1rem', flex: 1 }}>
                                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#10B981' }}>{appointments.length}</div>
                                <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: '600', textTransform: 'uppercase' }}>Visits</div>
                            </div>
                            <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '1rem', flex: 1 }}>
                                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#4F46E5' }}>0</div>
                                <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: '600', textTransform: 'uppercase' }}>Reports</div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div style={{ background: 'white', borderRadius: '1.5rem', padding: '2rem', border: '1px solid #E2E8F0' }}>
                        <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.25rem', color: '#0F172A', fontWeight: '700' }}>Quick Links</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '1rem', textDecoration: 'none', color: '#475569', fontWeight: '500', padding: '1rem', borderRadius: '1rem', border: '1px solid #E2E8F0', transition: 'border-color 0.2s' }} onMouseOver={e=>e.currentTarget.style.borderColor='#10B981'} onMouseOut={e=>e.currentTarget.style.borderColor='#E2E8F0'}>
                                <div style={{ background: '#D1FAE5', padding: '0.5rem', borderRadius: '0.5rem', color: '#059669' }}><FileText size={20} /></div>
                                Medical History
                            </a>
                            <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '1rem', textDecoration: 'none', color: '#475569', fontWeight: '500', padding: '1rem', borderRadius: '1rem', border: '1px solid #E2E8F0', transition: 'border-color 0.2s' }} onMouseOver={e=>e.currentTarget.style.borderColor='#10B981'} onMouseOut={e=>e.currentTarget.style.borderColor='#E2E8F0'}>
                                <div style={{ background: '#FEF3C7', padding: '0.5rem', borderRadius: '0.5rem', color: '#D97706' }}><Activity size={20} /></div>
                                Lab Results
                            </a>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default PatientDashboard;
