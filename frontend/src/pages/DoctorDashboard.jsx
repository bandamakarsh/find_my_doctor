import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Users, Clock, CheckCircle, XCircle, LayoutDashboard, Calendar, Settings, Bell, TrendingUp } from 'lucide-react';
import DoctorSettings from './DoctorSettings';

const DoctorDashboard = () => {
    const { user } = useContext(AuthContext);
    const [appointments, setAppointments] = useState([]);
    const [activeTab, setActiveTab] = useState('overview');
    const [showNotifications, setShowNotifications] = useState(false);
    const [patientHistory, setPatientHistory] = useState([]);

    useEffect(() => {
        if (user && user.doctorId) {
            // Fetch today's queue
            fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/queue/${user.doctorId}`)
                .then(res => res.json())
                .then(data => setAppointments(data.appointments || []))
                .catch(err => console.error("Error fetching appointments:", err));
                
            // Fetch patient history
            fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/appointments/doctor/${user.doctorId}`)
                .then(res => res.json())
                .then(data => setPatientHistory(data))
                .catch(err => console.error("Error fetching history:", err));
        }
    }, [user]);

    const updateStatus = async (appointmentId, status) => {
        try {
            await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/appointments/${appointmentId}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            setAppointments(appointments.map(app =>
                app._id === appointmentId ? { ...app, status } : app
            ));
        } catch (err) {
            console.error(err);
        }
    };

    const waiting = appointments.filter(a => a.status === 'waiting').length;
    const completed = appointments.filter(a => a.status === 'completed').length;
    const total = appointments.length;

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#F8FAFC', margin: '-2rem' }}>
            {/* Sidebar */}
            <div style={{ width: '260px', background: 'white', borderRight: '1px solid #E2E8F0', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontWeight: 'bold', fontSize: '1.2rem' }}>
                        {user?.name?.charAt(user.name.indexOf('.') > -1 ? user.name.indexOf('.') + 2 : 0) || 'D'}
                    </div>
                    <div>
                        <h3 style={{ margin: 0, fontSize: '1rem', color: '#1E293B' }}>{user?.name || 'Doctor'}</h3>
                        <span style={{ fontSize: '0.8rem', color: '#64748B' }}>Physician Portal</span>
                    </div>
                </div>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <button onClick={() => setActiveTab('overview')} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.875rem 1rem', borderRadius: '0.75rem', background: activeTab === 'overview' ? '#EEF2FF' : 'transparent', color: activeTab === 'overview' ? '#4F46E5' : '#64748B', fontWeight: activeTab === 'overview' ? '600' : '500', border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%' }}>
                        <LayoutDashboard size={20} /> Overview
                    </button>
                    <button onClick={() => setActiveTab('patients')} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.875rem 1rem', borderRadius: '0.75rem', background: activeTab === 'patients' ? '#EEF2FF' : 'transparent', color: activeTab === 'patients' ? '#4F46E5' : '#64748B', fontWeight: activeTab === 'patients' ? '600' : '500', border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%' }}>
                        <Users size={20} /> Patient List
                    </button>
                    <button onClick={() => setActiveTab('settings')} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.875rem 1rem', borderRadius: '0.75rem', background: activeTab === 'settings' ? '#EEF2FF' : 'transparent', color: activeTab === 'settings' ? '#4F46E5' : '#64748B', fontWeight: activeTab === 'settings' ? '600' : '500', border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%' }}>
                        <Settings size={20} /> Settings
                    </button>
                </nav>
            </div>

            {/* Main Content */}
            <div style={{ flex: 1, padding: '2.5rem 3rem', overflowY: 'auto' }}>
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                    <div>
                        <h1 style={{ margin: '0 0 0.25rem 0', fontSize: '2rem', color: '#0F172A', fontWeight: '800' }}>Dashboard Overview</h1>
                        <p style={{ margin: 0, color: '#64748B' }}>Track your queue and daily metrics in real-time.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', position: 'relative' }}>
                        <button onClick={() => setShowNotifications(!showNotifications)} style={{ background: 'white', border: '1px solid #E2E8F0', padding: '0.75rem', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                            <Bell size={20} color="#64748B" />
                            {appointments.filter(a => a.status === 'waiting').length > 0 && <span style={{ position: 'absolute', top: 0, right: 0, background: '#EF4444', border: '2px solid white', width: '10px', height: '10px', borderRadius: '50%' }}></span>}
                        </button>

                        {/* Notifications Dropdown */}
                        {showNotifications && (
                            <div style={{ position: 'absolute', top: '120%', right: 0, background: 'white', border: '1px solid #E2E8F0', borderRadius: '0.5rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', width: '300px', zIndex: 50, overflow: 'hidden' }}>
                                <div style={{ padding: '1rem', borderBottom: '1px solid #E2E8F0', background: '#F8FAFC', fontWeight: 'bold' }}>
                                    Upcoming Appointments
                                </div>
                                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                    {appointments.filter(a => a.status === 'waiting').slice(0, 3).map(app => (
                                        <div key={app._id} onClick={() => { setShowNotifications(false); setActiveTab('overview'); }} style={{ padding: '1rem', borderBottom: '1px solid #E2E8F0', cursor: 'pointer', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = '#F8FAFC'} onMouseOut={e => e.currentTarget.style.background = 'white'}>
                                            <div style={{ fontWeight: '600', color: '#0F172A', display: 'flex', justifyContent: 'space-between' }}>
                                                <span>{app.patientName}</span>
                                                <span style={{ fontSize: '0.75rem', color: '#4F46E5', background: '#EEF2FF', padding: '0.2rem 0.5rem', borderRadius: '1rem' }}>Token {app.tokenNumber}</span>
                                            </div>
                                            <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '0.25rem' }}>Age: {app.age} • Phone: {app.phone}</div>
                                        </div>
                                    ))}
                                    {appointments.filter(a => a.status === 'waiting').length === 0 && (
                                        <div style={{ padding: '1.5rem 1rem', textAlign: 'center', color: '#64748B' }}>No pending appointments.</div>
                                    )}
                                </div>
                                {appointments.filter(a => a.status === 'waiting').length > 0 && (
                                    <div onClick={() => { setShowNotifications(false); setActiveTab('overview'); }} style={{ padding: '0.75rem', textAlign: 'center', background: '#F8FAFC', color: '#4F46E5', fontWeight: '600', cursor: 'pointer', borderTop: '1px solid #E2E8F0', fontSize: '0.875rem' }}>
                                        View all in Queue
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </header>

                {activeTab === 'overview' && (
                    <>
                        {/* Stats Row */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
                            <div style={{ background: 'white', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                    <div style={{ background: '#EEF2FF', padding: '0.75rem', borderRadius: '0.75rem', color: '#4F46E5' }}><Users size={24} /></div>
                                    <span style={{ color: '#10B981', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem' }}><TrendingUp size={16} /> +12%</span>
                                </div>
                                <h2 style={{ fontSize: '2rem', margin: '0 0 0.25rem 0', color: '#0F172A' }}>{total}</h2>
                                <span style={{ color: '#64748B', fontWeight: '500' }}>Total Patients Today</span>
                            </div>
                            <div style={{ background: 'white', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                    <div style={{ background: '#FEF3C7', padding: '0.75rem', borderRadius: '0.75rem', color: '#D97706' }}><Clock size={24} /></div>
                                </div>
                                <h2 style={{ fontSize: '2rem', margin: '0 0 0.25rem 0', color: '#0F172A' }}>{waiting}</h2>
                                <span style={{ color: '#64748B', fontWeight: '500' }}>Waiting in Queue</span>
                            </div>
                            <div style={{ background: 'white', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                    <div style={{ background: '#D1FAE5', padding: '0.75rem', borderRadius: '0.75rem', color: '#059669' }}><CheckCircle size={24} /></div>
                                </div>
                                <h2 style={{ fontSize: '2rem', margin: '0 0 0.25rem 0', color: '#0F172A' }}>{completed}</h2>
                                <span style={{ color: '#64748B', fontWeight: '500' }}>Consultations Completed</span>
                            </div>
                        </div>

                        {/* Queue Table */}
                        <div style={{ background: 'white', borderRadius: '1rem', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)', overflow: 'hidden' }}>
                            <div style={{ padding: '1.5rem', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#0F172A' }}>Live Token Queue</h2>
                                <span style={{ padding: '0.5rem 1rem', background: '#F1F5F9', color: '#475569', borderRadius: '2rem', fontSize: '0.875rem', fontWeight: '600' }}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
                            </div>

                            {appointments.length === 0 ? (
                                <div style={{ padding: '3rem', textAlign: 'center', color: '#64748B' }}>No appointments booked yet today.</div>
                            ) : (
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ background: '#F8FAFC', textAlign: 'left', color: '#64748B', fontSize: '0.875rem' }}>
                                            <th style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>Token</th>
                                            <th style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>Patient Info</th>
                                            <th style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>Status</th>
                                            <th style={{ padding: '1rem 1.5rem', fontWeight: '600', textAlign: 'right' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {appointments.map((app) => (
                                            <tr key={app._id} style={{ borderBottom: '1px solid #E2E8F0', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = '#F8FAFC'} onMouseOut={e => e.currentTarget.style.background = 'white'}>
                                                <td style={{ padding: '1.25rem 1.5rem' }}>
                                                    <div style={{ width: '40px', height: '40px', background: '#EEF2FF', color: '#4F46E5', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem' }}>
                                                        {app.tokenNumber}
                                                    </div>
                                                </td>
                                                <td style={{ padding: '1.25rem 1.5rem' }}>
                                                    <div style={{ fontWeight: '600', color: '#0F172A', marginBottom: '0.25rem' }}>{app.patientName}</div>
                                                    <div style={{ fontSize: '0.875rem', color: '#64748B' }}>Age: {app.age} • {app.phone}</div>
                                                </td>
                                                <td style={{ padding: '1.25rem 1.5rem' }}>
                                                    <span style={{
                                                        padding: '0.375rem 0.75rem',
                                                        borderRadius: '2rem',
                                                        fontSize: '0.75rem',
                                                        fontWeight: '700',
                                                        textTransform: 'uppercase',
                                                        letterSpacing: '0.05em',
                                                        backgroundColor: app.status === 'completed' ? '#D1FAE5' : app.status === 'consulting' ? '#DBEAFE' : app.status === 'cancelled' ? '#FEE2E2' : '#FEF3C7',
                                                        color: app.status === 'completed' ? '#065F46' : app.status === 'consulting' ? '#1E40AF' : app.status === 'cancelled' ? '#991B1B' : '#92400E'
                                                    }}>
                                                        {app.status}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                                                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                                        {app.status === 'waiting' && (
                                                            <button onClick={() => updateStatus(app._id, 'consulting')} style={{ padding: '0.5rem 1rem', background: '#4F46E5', color: 'white', border: 'none', borderRadius: '0.5rem', fontWeight: '600', cursor: 'pointer' }}>Start Consult</button>
                                                        )}
                                                        {app.status === 'consulting' && (
                                                            <button onClick={() => updateStatus(app._id, 'completed')} style={{ padding: '0.5rem 1rem', background: '#10B981', color: 'white', border: 'none', borderRadius: '0.5rem', fontWeight: '600', cursor: 'pointer' }}>Mark Built</button>
                                                        )}
                                                        {(app.status === 'waiting' || app.status === 'consulting') && (
                                                            <button onClick={() => updateStatus(app._id, 'cancelled')} style={{ padding: '0.5rem', background: 'transparent', color: '#EF4444', border: '1px solid #EF4444', borderRadius: '0.5rem', cursor: 'pointer' }}><XCircle size={18} /></button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </>
                )}

                {activeTab === 'patients' && (
                    <div style={{ background: 'white', borderRadius: '1rem', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)', overflow: 'hidden' }}>
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#0F172A' }}>Patient History ({patientHistory.length} Total)</h2>
                        </div>
                        {patientHistory.length === 0 ? (
                            <div style={{ padding: '3rem', textAlign: 'center', color: '#64748B' }}>No patient history found.</div>
                        ) : (
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ background: '#F8FAFC', textAlign: 'left', color: '#64748B', fontSize: '0.875rem' }}>
                                        <th style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>Date</th>
                                        <th style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>Patient Info</th>
                                        <th style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {patientHistory.map((app) => (
                                        <tr key={app._id} style={{ borderBottom: '1px solid #E2E8F0' }}>
                                            <td style={{ padding: '1.25rem 1.5rem', color: '#64748B' }}>
                                                {new Date(app.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                            </td>
                                            <td style={{ padding: '1.25rem 1.5rem' }}>
                                                <div style={{ fontWeight: '600', color: '#0F172A' }}>{app.patientName}</div>
                                                <div style={{ fontSize: '0.875rem', color: '#64748B' }}>Age: {app.age} • {app.phone}</div>
                                            </td>
                                            <td style={{ padding: '1.25rem 1.5rem' }}>
                                                <span style={{
                                                    padding: '0.375rem 0.75rem',
                                                    borderRadius: '2rem',
                                                    fontSize: '0.75rem',
                                                    fontWeight: '700',
                                                    textTransform: 'uppercase',
                                                    backgroundColor: app.status === 'completed' ? '#D1FAE5' : app.status === 'cancelled' ? '#FEE2E2' : '#FEF3C7',
                                                    color: app.status === 'completed' ? '#065F46' : app.status === 'cancelled' ? '#991B1B' : '#92400E'
                                                }}>
                                                    {app.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}

                {activeTab === 'schedule' && (
                    <div style={{ padding: '3rem', textAlign: 'center', color: '#64748B', background: 'white', borderRadius: '1rem', border: '1px solid #E2E8F0' }}>
                        Feature coming soon.
                    </div>
                )}

                {activeTab === 'settings' && (
                    <DoctorSettings user={user} />
                )}
            </div>
        </div>
    );
};

export default DoctorDashboard;
