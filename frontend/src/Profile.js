import React, { useState, useEffect } from 'react';
import { api, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import { IoSettings, IoRibbon, IoHeart, IoLockClosed } from 'react-icons/io5';

const Profile = () => {
  const { user, updateProfileMetrics, addToast } = useAuth();

  // Edit details states
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [fitnessGoal, setFitnessGoal] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);

  // Password change states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Lists
  const [savedWorkouts, setSavedWorkouts] = useState([]);
  const [savedMeals, setSavedMeals] = useState([]);


  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setAge(user.age || '25');
      setHeight(user.height || '170');
      setWeight(user.weight || '70');
      setFitnessGoal(user.fitnessGoal || 'Stay Healthy');
      
      fetchSavedItemsAndBookings();
    }
  }, [user]);

  const fetchSavedItemsAndBookings = async () => {
    try {
      const workoutRes = await api.get('/workouts/favorites');
      const mealRes = await api.get('/meals/favorites');
      setSavedWorkouts(workoutRes.data);
      setSavedMeals(mealRes.data);
    } catch (err) {
      console.error('Error fetching profile details:', err);
    }
  };

  const handleUpdateMetrics = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    const success = await updateProfileMetrics({ name, age, height, weight, fitnessGoal });
    if (success) {
      setEditMode(false);
    }
    setProfileLoading(false);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      addToast('Please fill in both password fields.', 'error');
      return;
    }

    try {
      setPasswordLoading(true);
      await api.put('/users/change-password', { currentPassword, newPassword });
      addToast('Password updated successfully!', 'success');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      addToast(err.response?.data?.message || 'Password update failed.', 'error');
    } finally {
      setPasswordLoading(false);
    }
  };

  if (!user) return null;



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
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '30px' }}>
          
          {/* LEFT: User Profile Metrics & Edit Box (45%) */}
          <div style={{ flex: '1 1 450px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Header info card */}
            <div style={{
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: '16px',
              padding: '30px 24px',
              border: '1px solid var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              position: 'relative'
            }}>
              <div style={{
                width: '90px',
                height: '90px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.02)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '42px',
                border: '3px solid #10B981',
                marginBottom: '16px',
                color: 'var(--text-white)'
              }}>
                👤
              </div>

              <h2 style={{ margin: '0 0 4px 0', fontSize: '22px', fontWeight: '700', color: 'var(--text-white)' }}>{user.name}</h2>
              <span style={{ fontSize: '13px', color: 'var(--text-slate)', display: 'block', marginBottom: '20px' }}>{user.email}</span>

              {/* Physical Parameters summary grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '12px',
                width: '100%',
                backgroundColor: 'var(--bg-inner)',
                padding: '16px',
                borderRadius: '12px',
                border: '1px solid var(--border-color)',
                marginBottom: '20px'
              }}>
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-slate)', display: 'block', textTransform: 'uppercase' }}>Height</span>
                  <span style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-white)' }}>{user.height} cm</span>
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-slate)', display: 'block', textTransform: 'uppercase' }}>Weight</span>
                  <span style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-white)' }}>{user.weight} kg</span>
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-slate)', display: 'block', textTransform: 'uppercase' }}>BMI Score</span>
                  <span style={{ fontSize: '15px', fontWeight: '800', color: '#10B981' }}>{user.bmi}</span>
                </div>
              </div>

              <button
                onClick={() => setEditMode(!editMode)}
                style={{
                  width: '100%',
                  backgroundColor: 'rgba(255,255,255,0.02)',
                  color: 'var(--text-white)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '10px',
                  padding: '10px',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <IoSettings /> {editMode ? 'Cancel Editing' : 'Edit Physical Metrics'}
              </button>
            </div>

            {/* Edit Parameters Form */}
            {editMode && (
              <form onSubmit={handleUpdateMetrics} style={{
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid #F97316',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px'
              }}>
                <h3 style={{ margin: '0 0 6px 0', fontSize: '16px', fontWeight: '700', color: 'var(--text-white)' }}>Update Metrics</h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '11px', color: 'var(--text-slate)' }}>FULL NAME</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '10px', color: 'var(--text-white)', fontSize: '13px' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '11px', color: 'var(--text-slate)' }}>AGE</label>
                    <input type="number" value={age} onChange={e => setAge(e.target.value)} style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '10px', color: 'var(--text-white)', fontSize: '13px' }} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '11px', color: 'var(--text-slate)' }}>HEIGHT (CM)</label>
                    <input type="number" value={height} onChange={e => setHeight(e.target.value)} style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '10px', color: 'var(--text-white)', fontSize: '13px' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '11px', color: 'var(--text-slate)' }}>WEIGHT (KG)</label>
                    <input type="number" value={weight} onChange={e => setWeight(e.target.value)} style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '10px', color: 'var(--text-white)', fontSize: '13px' }} />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '11px', color: 'var(--text-slate)' }}>FITNESS TARGET</label>
                  <select value={fitnessGoal} onChange={e => setFitnessGoal(e.target.value)} style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '10px', color: 'var(--text-white)', fontSize: '13px', cursor: 'pointer' }}>
                    <option value="Stay Healthy">Stay Healthy</option>
                    <option value="Weight Loss">Weight Loss</option>
                    <option value="Muscle Gain">Muscle Gain</option>
                    <option value="Strength">Strength</option>
                  </select>
                </div>

                <button type="submit" disabled={profileLoading} style={{ backgroundColor: '#F97316', color: '#FFF', border: 'none', borderRadius: '8px', padding: '12px', fontWeight: '700', cursor: 'pointer', marginTop: '6px' }}>
                  {profileLoading ? 'Saving...' : 'Save Parameters'}
                </button>
              </form>
            )}

            {/* Change Password Card */}
            <div style={{
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid var(--border-color)'
            }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '700', color: 'var(--text-white)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <IoLockClosed style={{ color: '#F97316' }} /> Security Settings
              </h3>
              <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '11px', color: 'var(--text-slate)' }}>CURRENT PASSWORD</label>
                  <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} placeholder="••••••••" style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '10px', color: 'var(--text-white)', fontSize: '13px' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '11px', color: 'var(--text-slate)' }}>NEW PASSWORD</label>
                  <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="••••••••" style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '10px', color: 'var(--text-white)', fontSize: '13px' }} />
                </div>
                <button type="submit" disabled={passwordLoading} style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-white)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '12px', fontWeight: '700', cursor: 'pointer', marginTop: '6px' }}>
                  {passwordLoading ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </div>
          </div>

          {/* RIGHT: Achievements gallery, Saved content bookmarks, and history logs (55%) */}
          <div style={{ flex: '2 1 550px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Badge gallery */}
            <div style={{
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid var(--border-color)'
            }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '700', color: 'var(--text-white)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <IoRibbon style={{ color: '#F59E0B' }} /> Milestone Badges
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
                gap: '12px'
              }}>
                {[
                  { name: 'First Step', icon: '🏆', desc: 'Ticked first checklist' },
                  { name: 'Streak Enthusiast', icon: '🔥', desc: '3-day streak active' },
                  { name: 'Zen Warrior', icon: '🛡️', desc: '7-day streak active' },
                  { name: 'Powerhouse', icon: '⚡', desc: 'Reached level 5' },
                  { name: 'Iron Legend', icon: '👑', desc: 'Reached level 10' },
                  { name: 'Coached Athlete', icon: '🤝', desc: 'Booked first session' }
                ].map((badge) => {
                  const unlocked = user.badges && user.badges.includes(badge.name);
                  return (
                    <div key={badge.name} style={{
                      backgroundColor: unlocked ? 'rgba(16, 185, 129, 0.03)' : 'rgba(255,255,255,0.01)',
                      border: unlocked ? '1.5px solid #10B981' : '1px solid var(--border-color)',
                      borderRadius: '12px',
                      padding: '16px 12px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      opacity: unlocked ? 1 : 0.35,
                      boxShadow: unlocked ? '0 4px 12px rgba(16, 185, 129, 0.05)' : 'none'
                    }}>
                      <span style={{ fontSize: '28px', marginBottom: '8px', display: 'block' }}>{badge.icon}</span>
                      <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-white)', display: 'block', marginBottom: '4px' }}>{badge.name}</span>
                      <span style={{ fontSize: '10px', color: 'var(--text-slate)' }}>{badge.desc}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Saved Workouts & Meals Bookmarks */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '20px'
            }}>
              {/* Saved Exercises */}
              <div style={{
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: '16px',
                padding: '20px',
                border: '1px solid var(--border-color)'
              }}>
                <h3 style={{ margin: '0 0 14px 0', fontSize: '15px', fontWeight: '700', color: 'var(--text-white)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <IoHeart style={{ color: '#EF4444' }} /> Saved Exercises ({savedWorkouts.length})
                </h3>
                {savedWorkouts.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {savedWorkouts.map(w => (
                      <div key={w._id} style={{ fontSize: '13px', color: 'var(--text-white)', padding: '8px 10px', backgroundColor: 'var(--bg-inner)', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
                        {w.title}
                      </div>
                    ))}
                  </div>
                ) : (
                  <span style={{ fontSize: '12px', color: 'var(--text-slate)', fontStyle: 'italic' }}>No bookmarks saved.</span>
                )}
              </div>

              {/* Saved Meals */}
              <div style={{
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: '16px',
                padding: '20px',
                border: '1px solid var(--border-color)'
              }}>
                <h3 style={{ margin: '0 0 14px 0', fontSize: '15px', fontWeight: '700', color: 'var(--text-white)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <IoHeart style={{ color: '#F97316' }} /> Saved Meal Plans ({savedMeals.length})
                </h3>
                {savedMeals.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {savedMeals.map((m, idx) => (
                      <div key={idx} style={{ fontSize: '13px', color: 'var(--text-white)', padding: '8px 10px', backgroundColor: 'var(--bg-inner)', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
                        Plan - {m.totalCalories} kcal
                      </div>
                    ))}
                  </div>
                ) : (
                  <span style={{ fontSize: '12px', color: 'var(--text-slate)', fontStyle: 'italic' }}>No saved meals.</span>
                )}
              </div>
            </div>

            {/* Current Membership & Subscription Details */}
            <div style={{
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid var(--border-color)'
            }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '700', color: 'var(--text-white)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <IoRibbon style={{ color: '#8B5CF6' }} /> Membership & Subscription
              </h3>
              
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                backgroundColor: 'var(--bg-inner)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '16px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                  <span style={{ color: 'var(--text-slate)', fontWeight: '600' }}>Current Membership</span>
                  <strong style={{ color: user?.membershipType === 'Elite' ? '#8B5CF6' : user?.membershipType === 'Pro' ? '#F97316' : '#94A3B8', fontSize: '15px' }}>
                    {user?.membershipType || 'Starter'}
                  </strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                  <span style={{ color: 'var(--text-slate)', fontWeight: '600' }}>Membership Status</span>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: '800',
                    color: '#10B981',
                    textTransform: 'uppercase',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    padding: '2px 8px',
                    borderRadius: '8px'
                  }}>
                    {user?.membershipStatus || 'Active'}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                  <span style={{ color: 'var(--text-slate)', fontWeight: '600' }}>Membership Badge</span>
                  <span style={{
                    fontSize: '12px',
                    fontWeight: '700',
                    color: user?.membershipType === 'Elite' ? '#8B5CF6' : user?.membershipType === 'Pro' ? '#F97316' : '#94A3B8'
                  }}>
                    {user?.membershipType === 'Pro' ? '🏆 Pro Athlete' : user?.membershipType === 'Elite' ? '👑 Elite Catalyst' : '⚡ Starter'}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                  <span style={{ color: 'var(--text-slate)', fontWeight: '600' }}>Start Date</span>
                  <span style={{ color: 'var(--text-white)' }}>
                    {user?.membershipStartDate ? new Date(user.membershipStartDate).toLocaleDateString() : new Date().toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
