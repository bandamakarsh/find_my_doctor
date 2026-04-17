import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Admin() {
  const [doctors, setDoctors] = useState([]);
  const [pendingDoctors, setPendingDoctors] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState('');
  const [appointments, setAppointments] = useState([]);

  const fetchDoctors = () => {
    axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/doctors`).then(res => setDoctors(res.data));
    axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/doctors?pending=true`).then(res => setPendingDoctors(res.data));
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchQueue = () => {
    if (!selectedDoc) return;
    axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/queue/${selectedDoc}`).then(res => {
      setAppointments(res.data.appointments);
    });
  };

  useEffect(() => {
    fetchQueue();
    // naive polling for admin, or could use sockets
    const interval = setInterval(fetchQueue, 5000);
    return () => clearInterval(interval);
  }, [selectedDoc]);

  const updateStatus = async (appId, status) => {
    try {
      await axios.patch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/appointments/${appId}/status`, { status });
      fetchQueue();
    } catch (error) {
      console.error(error);
    }
  };

  const approveDoctor = async (id) => {
    try {
      await axios.patch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/doctors/${id}/approve`);
      fetchDoctors(); // refresh lists
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2 className="mb-4">Admin Simulation Panel</h2>

      {/* Pending Doctors Section */}
      <div className="card mb-4">
        <h3 className="mb-2">Pending Doctor Approvals</h3>
        {pendingDoctors.length === 0 ? <p className="text-muted">No pending approvals.</p> : (
          <table style={{width: '100%', textAlign: 'left', borderCollapse: 'collapse', marginBottom: '1rem'}}>
            <thead>
              <tr style={{borderBottom: '1px solid var(--border-color)'}}>
                <th style={{padding: '1rem'}}>Name</th>
                <th style={{padding: '1rem'}}>Specialty</th>
                <th style={{padding: '1rem'}}>Experience</th>
                <th style={{padding: '1rem'}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingDoctors.map(doc => (
                <tr key={doc._id} style={{borderBottom: '1px solid var(--border-color)'}}>
                  <td style={{padding: '1rem'}}>{doc.name}</td>
                  <td style={{padding: '1rem'}}>{doc.specialty}</td>
                  <td style={{padding: '1rem'}}>{doc.experience} years</td>
                  <td style={{padding: '1rem'}}>
                    <button className="btn" style={{padding: '0.25rem 0.5rem', backgroundColor: 'var(--success)'}} onClick={() => approveDoctor(doc._id)}>Approve</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="card mb-4">
        <label className="form-label">Select Doctor to manage queue:</label>
        <select className="form-input" value={selectedDoc} onChange={e => setSelectedDoc(e.target.value)}>
          <option value="">-- Select Doctor --</option>
          {doctors.map(d => <option key={d._id} value={d._id}>{d.name} ({d.specialty})</option>)}
        </select>
      </div>

      {selectedDoc && (
        <div className="card">
          <h3 className="mb-2">Today's Appointments</h3>
          {appointments.length === 0 ? <p className="text-muted">No appointments yet.</p> : (
            <table style={{width: '100%', textAlign: 'left', borderCollapse: 'collapse'}}>
              <thead>
                <tr style={{borderBottom: '1px solid var(--border-color)'}}>
                  <th className="mb-1" style={{padding: '1rem'}}>Token</th>
                  <th className="mb-1" style={{padding: '1rem'}}>Patient</th>
                  <th className="mb-1" style={{padding: '1rem'}}>Status</th>
                  <th className="mb-1" style={{padding: '1rem'}}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map(app => (
                  <tr key={app._id} style={{borderBottom: '1px solid var(--border-color)'}}>
                    <td style={{padding: '1rem'}}><strong>{app.tokenNumber}</strong></td>
                    <td style={{padding: '1rem'}}>{app.patientName}</td>
                    <td style={{padding: '1rem'}}>
                      <span className={`badge ${app.status === 'consulting' ? 'text-primary' : app.status === 'completed' ? 'text-success' : ''}`}>
                        {app.status}
                      </span>
                    </td>
                    <td style={{padding: '1rem'}} className="flex gap-2">
                      <button className="btn" style={{padding: '0.25rem 0.5rem', fontSize: '0.875rem'}} onClick={() => updateStatus(app._id, 'waiting')}>Wait</button>
                      <button className="btn" style={{padding: '0.25rem 0.5rem', fontSize: '0.875rem', backgroundColor: 'var(--primary-color)'}} onClick={() => updateStatus(app._id, 'consulting')}>Consult</button>
                      <button className="btn" style={{padding: '0.25rem 0.5rem', fontSize: '0.875rem', backgroundColor: 'var(--success)'}} onClick={() => updateStatus(app._id, 'completed')}>Complete</button>
                      <button className="btn" style={{padding: '0.25rem 0.5rem', fontSize: '0.875rem', backgroundColor: 'var(--danger)'}} onClick={() => updateStatus(app._id, 'cancelled')}>Cancel</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
