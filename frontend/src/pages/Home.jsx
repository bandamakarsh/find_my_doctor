import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Activity } from 'lucide-react';

export default function Home() {
  return (
    <div>
      <div className="hero">
        <h1>SmartOP</h1>
        <p>Advanced Hyperlocal Doctor Appointment & Real-Time Queue Management System. Say goodbye to waiting room uncertainty.</p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link to="/patient-login" className="btn">Patient Login</Link>
          <Link to="/doctor-login" className="btn" style={{ background: 'white', color: '#6366f1' }}>Doctor Login</Link>
        </div>
      </div>

      <div className="grid">
        <div className="card text-center">
          <Activity size={48} color="#818CF8" className="mb-2" />
          <h2 className="mb-1">Real-Time Tracking</h2>
          <p className="text-muted">Track the exact Token Number currently inside the consultation room.</p>
        </div>
        <div className="card text-center">
          <Clock size={48} color="#818CF8" className="mb-2" />
          <h2 className="mb-1">Smart Estimates</h2>
          <p className="text-muted">Know exactly when your turn is coming based on average consultation time.</p>
        </div>
        <div className="card text-center">
          <Calendar size={48} color="#818CF8" className="mb-2" />
          <h2 className="mb-1">Easy Booking</h2>
          <p className="text-muted">Get your OP Token instantly without standing in long queues.</p>
        </div>
      </div>
    </div>
  );
}
