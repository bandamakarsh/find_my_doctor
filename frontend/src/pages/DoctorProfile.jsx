import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

export default function DoctorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [formData, setFormData] = useState({ patientName: '', age: '', phone: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/doctors/${id}`).then(res => setDoctor(res.data));
  }, [id]);

  const handleBook = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/appointments`, {
        ...formData,
        doctorId: id
      });
      alert(`Appointment Booked! Your OP Token is ${res.data.tokenNumber}`);
      navigate(`/queue/${id}/${res.data._id}`);
    } catch (error) {
      console.error(error);
      alert('Error booking appointment');
    } finally {
      setLoading(false);
    }
  };

  if (!doctor) return <div className="text-center mt-4">Loading...</div>;

  return (
    <div className="flex gap-2" style={{ flexDirection: 'column' }}>
      <div className="card mb-4">
        {doctor.imageUrl && <img src={doctor.imageUrl} alt={doctor.name} style={{width: '100%', height: '300px', objectFit: 'cover', borderRadius: '12px'}} className="mb-2" />}
        <span className="badge mb-1">{doctor.specialty}</span>
        <h1>{doctor.name}</h1>
        <p className="text-xl text-muted mb-2">{doctor.description}</p>
        <div className="flex justify-between mb-2">
          <div>
            <strong>Experience:</strong> {doctor.experience} Years
          </div>
          <div>
            <strong>Fee:</strong> ₹{doctor.consultationFee}
          </div>
          <div>
            <strong>Avg. Time:</strong> ~{doctor.averageConsultationTime} mins / patient
          </div>
        </div>
        <div className="flex justify-between mb-2">
          <div>
            <strong>Hospital:</strong> {doctor.hospital}
          </div>
          <div>
            <strong>Contact:</strong> {doctor.contact}
          </div>
          <div>
            <strong>Availability:</strong> {doctor.availability}
          </div>
        </div>
      </div>

      <div className="card" style={{ maxWidth: '600px', margin: '0 auto', width: '100%' }}>
        <h2 className="mb-2 text-center">Book Appointment</h2>
        <form onSubmit={handleBook}>
          <div className="form-group">
            <label className="form-label">Patient Name</label>
            <input required type="text" className="form-input" value={formData.patientName} onChange={e => setFormData({...formData, patientName: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">Age</label>
            <input required type="number" className="form-input" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input required type="text" className="form-input" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
          </div>
          <button type="submit" className="btn" style={{width: '100%'}} disabled={loading}>
            {loading ? 'Booking...' : 'Confirm OP Token'}
          </button>
        </form>
      </div>
    </div>
  );
}
