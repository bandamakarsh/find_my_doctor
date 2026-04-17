import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Search as SearchIcon, Star } from 'lucide-react';

export default function Search() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/doctors');
        setDoctors(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  if (loading) return <div className="text-center mt-4">Loading doctors...</div>;

  const filteredDoctors = doctors.filter(doc => 
    doc.specialty.toLowerCase().includes(searchQuery.toLowerCase()) || 
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2>Available Doctors</h2>
        <div className="flex items-center gap-2">
          <SearchIcon size={20} className="text-muted" />
          <input 
            type="text" 
            className="form-input" 
            placeholder="Search specialties..." 
            style={{ width: '250px', marginBottom: 0 }} 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid">
        {filteredDoctors.map(doc => (
          <div key={doc._id} className="card">
            {doc.imageUrl && <img src={doc.imageUrl} alt={doc.name} className="doctor-img" />}
            <div className="flex justify-between items-center mb-1">
              <span className="badge">{doc.specialty}</span>
              <div className="flex items-center gap-2 text-warning">
                <Star size={16} fill="currentColor" />
                <span style={{color:'var(--text-main)'}}>{doc.rating}</span>
              </div>
            </div>
            <h3 className="mb-1">{doc.name}</h3>
            <p className="text-muted mb-2">{doc.experience} Years Exp • ₹{doc.consultationFee}</p>
            <Link to={`/doctor/${doc._id}`} className="btn" style={{width: '100%', textAlign: 'center'}}>View Profile</Link>
          </div>
        ))}
        {filteredDoctors.length === 0 && <p className="text-muted">No doctors found matching your search.</p>}
      </div>
    </div>
  );
}
