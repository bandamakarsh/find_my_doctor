import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';

export default function QueueTracking() {
  const { doctorId, appointmentId } = useParams();
  const [queueData, setQueueData] = useState(null);
  const [myToken, setMyToken] = useState(null);

  const fetchQueue = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/queue/${doctorId}`);
      setQueueData(res.data);
      const me = res.data.appointments.find(a => a._id === appointmentId);
      if (me) setMyToken(me.tokenNumber);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchQueue();

    const socket = io('http://localhost:5000');
    socket.emit('join_doctor_room', doctorId);

    socket.on('queue_updated', (data) => {
      console.log('Queue updated via Socket:', data);
      fetchQueue();
    });

    return () => socket.disconnect();
  }, [doctorId, appointmentId]);

  if (!queueData || !myToken) return <div className="text-center mt-4">Loading Live Queue...</div>;

  const currentToken = queueData.activeToken || 0;
  const myStatus = queueData.appointments.find(a => a._id === appointmentId)?.status;
  
  let patientsAhead = 0;
  if (myStatus === 'waiting') {
    patientsAhead = queueData.appointments.filter(a => a.status === 'waiting' && a.tokenNumber < myToken).length;
  }

  const estimatedWait = patientsAhead * queueData.avgConsultationTime;

  return (
    <div className="flex" style={{ flexDirection: 'column', alignItems: 'center' }}>
      <h2 className="mb-4">Real-Time Queue Tracking</h2>

      {myStatus === 'completed' ? (
        <div className="card text-center text-success" style={{width: '100%', maxWidth: '600px'}}>
          <h2 className="mb-2">Consultation Completed</h2>
          <p>Thank you for using SmartOP.</p>
        </div>
      ) : myStatus === 'consulting' ? (
        <div className="card text-center text-primary" style={{width: '100%', maxWidth: '600px', borderColor: 'var(--primary-color)'}}>
          <h2 className="mb-2">It's Your Turn!</h2>
          <p>Please enter the consultation room.</p>
        </div>
      ) : (
        <div className="queue-card" style={{width: '100%', maxWidth: '600px'}}>
          <p className="text-xl text-muted">Your Token</p>
          <div className="token-number">{myToken}</div>
          
          <div className="flex justify-between mt-4" style={{borderTop: '1px solid var(--border-color)', paddingTop: '2rem'}}>
            <div>
              <p className="text-muted mb-1">Current Token</p>
              <h3>{currentToken || 'None'}</h3>
            </div>
            <div>
              <p className="text-muted mb-1">Patients Ahead</p>
              <h3>{patientsAhead}</h3>
            </div>
            <div>
              <p className="text-muted mb-1">Est. Time</p>
              <h3 className="text-warning">~{estimatedWait} mins</h3>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
