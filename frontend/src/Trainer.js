import React, { useState, useEffect } from 'react';
import { api, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Skeleton from './components/Skeleton';
import { IoStar, IoCheckmarkCircle, IoClose, IoMedal } from 'react-icons/io5';

const TrainerManagement = () => {
  const { addToast } = useAuth();
  
  const [trainers, setTrainers] = useState([]);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  // Booking history categorization states
  const [bookings, setBookings] = useState({ upcoming: [], past: [], cancelled: [] });

  useEffect(() => {
    fetchTrainers();
    fetchBookingHistory();
  }, []);

  const fetchTrainers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/trainers');
      setTrainers(res.data);
    } catch (err) {
      console.error('Error fetching trainers:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookingHistory = async () => {
    try {
      const res = await api.get('/trainers/bookings/history');
      setBookings({
        upcoming: res.data.upcoming || [],
        past: res.data.past || [],
        cancelled: res.data.cancelled || []
      });
    } catch (err) {
      console.error('Error fetching bookings:', err);
    }
  };

  const handleBookSession = (trainer) => {
    setSelectedTrainer(trainer);
    setSelectedTime('');
    setBookingSuccess(false);
  };

  const handleConfirmBooking = async () => {
    if (!selectedTime) {
      addToast('Please select a time slot!', 'error');
      return;
    }

    try {
      setBookingLoading(true);
      const res = await api.post('/trainers/book', {
        trainerId: selectedTrainer._id,
        timeSlot: selectedTime
      });

      setBookingSuccess(true);
      addToast(`Session with ${selectedTrainer.name} at ${selectedTime} booked! +${res.data.xpGained} XP`, 'success');
      
      if (res.data.unlockedBadges && res.data.unlockedBadges.length > 0) {
        res.data.unlockedBadges.forEach(badge => {
          addToast(`🏆 New Achievement: ${badge}!`, 'success');
        });
      }

      fetchBookingHistory();
    } catch (err) {
      console.error('Booking error:', err);
      addToast(err.response?.data?.message || 'Failed to book session.', 'error');
    } finally {
      setBookingLoading(false);
    }
  };

  const handleCancelBooking = async (id) => {
    try {
      await api.put(`/trainers/bookings/${id}/cancel`);
      addToast('Appointment cancelled successfully.', 'info');
      fetchBookingHistory();
    } catch (err) {
      console.error('Error cancelling booking:', err);
    }
  };

  return (
    <>
      <Navbar />
      <div style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-white)',
        padding: '30px 20px',
        fontFamily: 'system-ui, sans-serif'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          {/* Header */}
          <div style={{ marginBottom: '30px' }}>
            <h1 style={{ margin: '0 0 6px 0', fontSize: '32px', fontWeight: '800', color: 'var(--text-white)' }}>Professional Trainer Sessions</h1>
            <p style={{ margin: 0, color: 'var(--text-slate)', fontSize: '15px' }}>Book one-on-one appointments with certified fitness experts</p>
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: '30px'
          }}>
            
            {/* LEFT: Trainers List (65%) */}
            <div style={{ flex: '2 1 600px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '800', margin: 0, color: 'var(--text-white)' }}>Available Coaches</h2>
              
              {loading ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
                  {[1, 2].map(i => (
                    <div key={i} style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '16px', height: '280px', padding: '20px' }}>
                      <Skeleton height="140px" width="100%" borderRadius="12px" />
                      <Skeleton height="20px" width="80%" style={{ marginTop: '12px' }} />
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                  {trainers.map((trainer) => (
                    <div
                      key={trainer._id}
                      style={{
                        backgroundColor: 'var(--bg-secondary)',
                        borderRadius: '16px',
                        border: '1px solid var(--border-color)',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        transition: 'transform 0.2s',
                      }}
                      className="trainer-card"
                    >
                      <div>
                        {/* Placeholder image */}
                        <div style={{
                          height: '160px',
                          backgroundColor: 'rgba(255,255,255,0.02)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '48px',
                          position: 'relative',
                          borderBottom: '1px solid var(--border-color)'
                        }}>
                          👤
                          <span style={{
                            position: 'absolute',
                            bottom: '12px',
                            right: '12px',
                            backgroundColor: 'var(--bg-primary)',
                            color: '#F59E0B',
                            fontSize: '12px',
                            fontWeight: '700',
                            padding: '2px 8px',
                            borderRadius: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            border: '1px solid var(--border-color)'
                          }}>
                            <IoStar /> {trainer.rating}
                          </span>
                        </div>

                        {/* Trainer info */}
                        <div style={{ padding: '20px' }}>
                          <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: '700', color: 'var(--text-white)' }}>{trainer.name}</h3>
                          <span style={{ color: '#F97316', fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>
                            {trainer.specialty}
                          </span>
                          <span style={{ fontSize: '12px', color: 'var(--text-slate)', display: 'block', marginBottom: '12px' }}>
                            Experience: {trainer.experience} Years
                          </span>

                          {/* Credentials */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '10px' }}>
                            {trainer.certificates && trainer.certificates.map((cert, i) => (
                              <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-slate)' }}>
                                <IoMedal style={{ color: '#10B981' }} /> {cert}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div style={{ padding: '0 20px 20px 20px' }}>
                        <button
                          onClick={() => handleBookSession(trainer)}
                          style={{
                            width: '100%',
                            backgroundColor: '#F97316',
                            color: '#FFF',
                            border: 'none',
                            borderRadius: '10px',
                            padding: '10px',
                            fontSize: '13px',
                            fontWeight: '700',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s',
                          }}
                        >
                          Book Appointment
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT: Booking Flow Modal / Timeline Panel (35%) */}
            <div style={{ flex: '1 1 350px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Active Appointment Booking block */}
              {selectedTrainer && (
                <div style={{
                  backgroundColor: 'var(--bg-secondary)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid var(--border-color)',
                  boxShadow: '0 10px 30px -5px rgba(0,0,0,0.1)',
                  position: 'relative'
                }}>
                  <button
                    onClick={() => setSelectedTrainer(null)}
                    style={{
                      position: 'absolute',
                      top: '16px',
                      right: '16px',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-slate)',
                      fontSize: '20px',
                      cursor: 'pointer'
                    }}
                  >
                    <IoClose />
                  </button>

                  <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: '700', color: 'var(--text-white)' }}>
                    Reserve Slot
                  </h3>
                  <span style={{ fontSize: '13px', color: 'var(--text-slate)', display: 'block', marginBottom: '16px' }}>
                    Trainer: <strong style={{ color: '#F97316' }}>{selectedTrainer.name}</strong>
                  </span>

                  {!bookingSuccess ? (
                    <>
                      <span style={{ fontSize: '12px', color: 'var(--text-slate)', fontWeight: '700', display: 'block', marginBottom: '8px' }}>
                        AVAILABLE TIMES
                      </span>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                        {selectedTrainer.availability.map((time) => (
                          <button
                            key={time}
                            onClick={() => setSelectedTime(time)}
                            style={{
                              backgroundColor: selectedTime === time ? 'rgba(249, 115, 22, 0.1)' : 'rgba(255,255,255,0.02)',
                              border: selectedTime === time ? '1px solid #F97316' : '1px solid var(--border-color)',
                              borderRadius: '8px',
                              padding: '10px 14px',
                              color: selectedTime === time ? '#F97316' : 'var(--text-white)',
                              textAlign: 'left',
                              fontSize: '13px',
                              cursor: 'pointer',
                              fontWeight: selectedTime === time ? '600' : '500'
                            }}
                          >
                            {time}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={handleConfirmBooking}
                        disabled={bookingLoading || !selectedTime}
                        style={{
                          width: '100%',
                          backgroundColor: '#10B981',
                          color: '#FFF',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '12px',
                          fontSize: '14px',
                          fontWeight: '700',
                          cursor: 'pointer'
                        }}
                      >
                        {bookingLoading ? 'Reserving...' : 'Confirm Appointment'}
                      </button>
                    </>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '20px 0' }}>
                      <IoCheckmarkCircle style={{ color: '#10B981', fontSize: '48px', marginBottom: '12px' }} />
                      <h4 style={{ margin: '0 0 6px 0', fontSize: '16px', color: 'var(--text-white)' }}>Slot Reserved!</h4>
                      <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-slate)' }}>
                        Your session with {selectedTrainer.name} at {selectedTime} has been recorded.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Booking History Timeline */}
              <div style={{
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid var(--border-color)'
              }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '700', color: 'var(--text-white)' }}>
                  Booking Schedule
                </h3>

                {/* Upcoming */}
                <div style={{ marginBottom: '20px' }}>
                  <span style={{ fontSize: '11px', color: '#8B5CF6', fontWeight: '700', display: 'block', marginBottom: '8px' }}>
                    UPCOMING APPOINTMENTS
                  </span>
                  {bookings.upcoming.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {bookings.upcoming.map(b => (
                        <div key={b._id} style={{
                          backgroundColor: 'var(--bg-primary)',
                          padding: '12px',
                          borderRadius: '8px',
                          border: '1px solid var(--border-color)',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}>
                          <div>
                            <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-white)', display: 'block' }}>
                              {b.trainerName}
                            </span>
                            <span style={{ fontSize: '11px', color: 'var(--text-slate)' }}>{b.timeSlot} • {new Date(b.date).toLocaleDateString()}</span>
                          </div>
                          <button
                            onClick={() => handleCancelBooking(b._id)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#EF4444',
                              fontSize: '11px',
                              cursor: 'pointer',
                              fontWeight: '600'
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span style={{ fontSize: '12px', color: 'var(--text-slate)', fontStyle: 'italic' }}>No upcoming sessions.</span>
                  )}
                </div>

                {/* Completed / Past */}
                <div>
                  <span style={{ fontSize: '11px', color: '#10B981', fontWeight: '700', display: 'block', marginBottom: '8px' }}>
                    PAST SESSIONS
                  </span>
                  {bookings.past.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {bookings.past.map(b => (
                        <div key={b._id} style={{
                          backgroundColor: 'var(--bg-primary)',
                          padding: '10px 12px',
                          borderRadius: '8px',
                          border: '1px solid var(--border-color)',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          opacity: 0.6
                        }}>
                          <div>
                            <span style={{ fontSize: '13px', color: 'var(--text-white)', display: 'block' }}>{b.trainerName}</span>
                            <span style={{ fontSize: '11px', color: 'var(--text-slate)' }}>{b.timeSlot}</span>
                          </div>
                          <span style={{ fontSize: '11px', color: '#10B981', fontWeight: '600' }}>Completed</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span style={{ fontSize: '12px', color: 'var(--text-slate)', fontStyle: 'italic' }}>No past records.</span>
                  )}
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default TrainerManagement;
