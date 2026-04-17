import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Stethoscope } from 'lucide-react';
import Home from './pages/Home';
import Search from './pages/Search';
import DoctorProfile from './pages/DoctorProfile';
import QueueTracking from './pages/QueueTracking';
import Admin from './pages/Admin';
import DoctorLogin from './pages/DoctorLogin';
import DoctorRegister from './pages/DoctorRegister';
import PatientLogin from './pages/PatientLogin';
import DoctorDashboard from './pages/DoctorDashboard';
import PatientDashboard from './pages/PatientDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthContext } from './context/AuthContext';

function Navigation() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="nav-bar">
            <Link to="/" className="nav-brand">
                <Stethoscope color="#818CF8" /> SmartOP
            </Link>
            <div className="nav-links">
                {user ? (
                    <>
                        <span style={{ marginRight: '1rem', color: '#4B5563', fontWeight: 'bold' }}>Hello, {user.name}</span>
                        {user.role === 'doctor' && <Link to="/doctor-dashboard" className="nav-link">Dashboard</Link>}
                        {user.role === 'patient' && <Link to="/patient-dashboard" className="nav-link">Dashboard</Link>}
                        <button onClick={handleLogout} className="btn" style={{ padding: '0.5rem 1rem', background: '#EF4444' }}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/search" className="nav-link">Find Doctors</Link>
                        <Link to="/patient-login" className="nav-link">Patient Login</Link>
                        <Link to="/doctor-register" className="nav-link">For Doctors</Link>
                        <Link to="/doctor-login" className="btn" style={{ padding: '0.5rem 1rem' }}>Doctor Login</Link>
                    </>
                )}
            </div>
        </nav>
    );
}

function App() {
  return (
    <BrowserRouter>
      <Navigation />
      
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/doctor/:id" element={<DoctorProfile />} />
          <Route path="/queue/:doctorId/:appointmentId" element={<QueueTracking />} />
          <Route path="/admin" element={<Admin />} />
          
          <Route path="/doctor-register" element={<DoctorRegister />} />
          <Route path="/doctor-login" element={<DoctorLogin />} />
          <Route path="/patient-login" element={<PatientLogin />} />

          <Route element={<ProtectedRoute allowedRoles={['doctor']} />}>
              <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['patient']} />}>
              <Route path="/patient-dashboard" element={<PatientDashboard />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
