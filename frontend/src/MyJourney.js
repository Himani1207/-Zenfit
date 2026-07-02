import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, api } from './context/AuthContext';
import Navbar from './components/Navbar';
import ActivityCalendar from './components/ActivityCalendar';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  IoFlame, IoSparkles, IoCalendar, IoBulb, IoNavigate, 
  IoChevronForward, IoBicycle, IoTime, IoPlay, IoStatsChart, 
  IoRibbon, IoCheckmarkCircle, IoRestaurant, IoWaterOutline, 
  IoPersonCircle, IoBookOutline 
} from 'react-icons/io5';

const MyJourney = () => {
  const { user, toggleChecklist, logWater, addToast } = useAuth();
  const navigate = useNavigate();

  const [dbData, setDbData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [waterAmount, setWaterAmount] = useState(250);
  const [calendarData, setCalendarData] = useState([]);
  const [showCelebration, setShowCelebration] = useState(false);

  const fetchDashboard = async () => {
    try {
      const res = await api.get('/users/dashboard');
      setDbData(res.data);
      
      const calRes = await api.get('/users/activity-calendar');
      setCalendarData(calRes.data);
    } catch (err) {
      console.error('Error fetching dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchDashboard();
  }, [user, navigate]);

  useEffect(() => {
    if (dbData && dbData.dailyMission) {
      const todayStr = new Date().toISOString().split('T')[0];
      const celebrated = localStorage.getItem(`celebrated-${todayStr}`);
      
      if (dbData.dailyMission.missionCompleted && celebrated !== 'true') {
        setShowCelebration(true);
        localStorage.setItem(`celebrated-${todayStr}`, 'true');
      }
    }
  }, [dbData]);

  const handleToggleChecklist = async (key) => {
    await toggleChecklist(key);
    fetchDashboard();
  };

  const handleLogWater = async (amt) => {
    await logWater(amt);
    fetchDashboard();
  };

  if (!user) return null;

  // Loading Skeleton
  if (loading || !dbData) {
    return (
      <>
        <Navbar />
        <div style={{
          minHeight: '100vh',
          backgroundColor: 'var(--bg-primary)',
          color: 'var(--text-white)',
          padding: '40px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, sans-serif'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div className="spinner" style={{
              width: '50px',
              height: '50px',
              border: '3px solid rgba(255,255,255,0.1)',
              borderTopColor: '#F97316',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 20px auto'
            }} />
            <h3 style={{ fontWeight: '600' }}>Aligning your premium ZenFit experience...</h3>
          </div>
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </>
    );
  }

  const {
    progressPercent,
    workoutFocus,
    mealRec,
    weeklyChallenge,
    recentAchievement,
    insights,
    timeline
  } = dbData;

  const currentLevelName = user.level < 3 ? 'Fitness Starter' 
                        : user.level < 6 ? 'Fitness Explorer' 
                        : user.level < 10 ? 'Athletic Catalyst' 
                        : user.level < 15 ? 'Iron Warrior' 
                        : 'Zen Master';

  const xpPercent = Math.min(100, (user.xp / (user.xpToNextLevel || 200)) * 100);

  // SVG Illustration with Floating Animation
  const FloatingIllustration = () => (
    <motion.div
      animate={{ y: [0, -12, 0] }}
      transition={{
        duration: 5,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
      style={{ width: '100%', maxWidth: '380px', margin: '0 auto' }}
    >
      <svg viewBox="0 0 400 280" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="circleGrad" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" transform="translate(200 140) rotate(90) scale(110)">
            <stop stopColor="#F97316" stopOpacity="0.25" />
            <stop offset="1" stopColor="var(--bg-primary)" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="greenGrad" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" transform="translate(130 90) rotate(90) scale(60)">
            <stop stopColor="#10B981" stopOpacity="0.15" />
            <stop offset="1" stopColor="var(--bg-primary)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient background glows */}
        <circle cx="200" cy="140" r="110" fill="url(#circleGrad)" />
        <circle cx="130" cy="90" r="60" fill="url(#greenGrad)" />

        {/* Floor Line */}
        <line x1="50" y1="220" x2="350" y2="220" stroke="var(--border-color)" strokeWidth="4" strokeLinecap="round" />

        {/* Floating Ring Orbs */}
        <motion.circle 
          cx="80" 
          cy="70" 
          r="8" 
          fill="#10B981" 
          animate={{ y: [0, -8, 0] }} 
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.circle 
          cx="330" 
          cy="110" 
          r="12" 
          fill="#F97316" 
          animate={{ y: [0, 8, 0] }} 
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        />

        {/* Premium Athlete Shape (Vector Art Yoga/Stretch pose) */}
        <path d="M140 220 L170 160 L145 130 L190 95 L220 135 L260 180 L290 220" stroke="#F97316" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="200" cy="72" r="15" fill="var(--text-white)" filter="drop-shadow(0 0 8px rgba(255,255,255,0.3))" />
        
        {/* Kettlebell / Gym weights details */}
        <circle cx="310" cy="200" r="18" fill="var(--bg-secondary)" stroke="#10B981" strokeWidth="4" />
        <path d="M302 186 C302 178 318 178 318 186" stroke="#10B981" strokeWidth="3" fill="none" />
      </svg>
    </motion.div>
  );

  return (
    <>
      <Navbar />
      <div style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-white)',
        padding: '30px 20px',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          
          {/* ==========================================
              TOP SECTION (Greeting, progress, streaking)
              ========================================== */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '24px',
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: '24px',
            padding: '30px',
            border: '1px solid var(--border-color)',
            boxShadow: '0 15px 30px rgba(0,0,0,0.1)',
            marginBottom: '30px'
          }}>
            
            {/* Greeting & Goal */}
            <div style={{ flex: '1 1 300px' }}>
              <span style={{ 
                color: '#10B981', 
                fontSize: '12px', 
                fontWeight: '800', 
                letterSpacing: '1px', 
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '4px'
              }}>
                Action Dashboard
              </span>
              <h1 style={{ margin: '0 0 6px 0', fontSize: '32px', fontWeight: '800' }}>
                Welcome back, {user.name}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ 
                  backgroundColor: 'rgba(249, 115, 22, 0.1)', 
                  color: '#F97316', 
                  fontSize: '13px', 
                  fontWeight: '700', 
                  padding: '4px 12px', 
                  borderRadius: '20px',
                  border: '1px solid rgba(249,115,22,0.2)'
                }}>
                  Target: {user.fitnessGoal}
                </span>
                <span style={{ fontSize: '13px', color: 'var(--text-slate)' }}>
                  Level {user.level} • {currentLevelName}
                </span>
              </div>
            </div>

            {/* Circular Progress & Streaking */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '24px',
              flexWrap: 'wrap'
            }}>
              
              {/* Progress Ring */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ position: 'relative', width: '64px', height: '64px' }}>
                  <svg width="64" height="64" viewBox="0 0 64 64">
                    <circle cx="32" cy="32" r="27" stroke="rgba(255,255,255,0.05)" strokeWidth="5" fill="transparent" />
                    <motion.circle
                      cx="32"
                      cy="32"
                      r="27"
                      stroke="#10B981"
                      strokeWidth="5"
                      fill="transparent"
                      strokeDasharray="169.6"
                      initial={{ strokeDashoffset: 169.6 }}
                      animate={{ strokeDashoffset: 169.6 - (169.6 * progressPercent) / 100 }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      strokeLinecap="round"
                      transform="rotate(-90 32 32)"
                    />
                  </svg>
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    fontSize: '12px',
                    fontWeight: '800',
                    color: 'var(--text-white)'
                  }}>
                    {progressPercent}%
                  </div>
                </div>
                <div>
                  <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-slate)', fontWeight: '700', textTransform: 'uppercase' }}>Today's Tasks</span>
                  <span style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-white)' }}>
                    {Object.values(user.checklist || {}).filter(Boolean).length}/5 Completed
                  </span>
                </div>
              </div>

              {/* Current Streak */}
              <div style={{ 
                backgroundColor: 'rgba(249, 115, 22, 0.08)',
                border: '1px solid rgba(249,115,22,0.2)',
                borderRadius: '16px',
                padding: '12px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <IoFlame style={{ color: '#F97316', fontSize: '24px' }} />
                <div>
                  <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-slate)', fontWeight: '600' }}>CURRENT STREAK</span>
                  <span style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-white)' }}>🔥 {user.currentStreak || user.streak || 0} Days</span>
                </div>
              </div>

              {/* Longest Streak */}
              <div style={{ 
                backgroundColor: 'rgba(168, 85, 247, 0.08)',
                border: '1px solid rgba(168, 85, 247, 0.2)',
                borderRadius: '16px',
                padding: '12px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <IoRibbon style={{ color: '#A855F7', fontSize: '24px' }} />
                <div>
                  <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-slate)', fontWeight: '600' }}>LONGEST STREAK</span>
                  <span style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-white)' }}>🏆 {user.longestStreak || 0} Days</span>
                </div>
              </div>

            </div>

            {/* Quick Action Navigation Buttons */}
            <div style={{ 
              width: '100%', 
              borderTop: '1px solid var(--border-color)', 
              paddingTop: '20px',
              display: 'flex',
              gap: '12px',
              flexWrap: 'wrap'
            }}>
              <motion.button 
                whileHover={{ scale: 1.03 }}
                onClick={() => navigate('/workout')}
                style={{
                  backgroundColor: '#F97316',
                  color: '#FFF',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '10px 18px',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 10px rgba(249,115,22,0.2)'
                }}
              >
                Continue Workout <IoPlay />
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.03 }}
                onClick={() => navigate('/mealplan')}
                style={{
                  backgroundColor: '#10B981',
                  color: '#FFF',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '10px 18px',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 10px rgba(16,185,129,0.2)'
                }}
              >
                Generate Meal Plan <IoRestaurant />
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.03 }}
                onClick={() => navigate('/profile')}
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--text-white)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '10px',
                  padding: '10px 18px',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                View Profile <IoPersonCircle />
              </motion.button>
            </div>

          </div>

          {/* ==========================================
              MAIN GRID (Left 65% content, Right 35% illustration/actions)
              ========================================== */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '30px',
            alignItems: 'start'
          }}>
            
            {/* LEFT AREA: Today's Focus & Timeline */}
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '30px',
              gridColumn: 'span 2' 
            }}>
              
              {/* Today's Focus Grid */}
              <div>
                <h2 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <IoSparkles style={{ color: '#F97316' }} /> Today's Focus
                </h2>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '20px'
                }}>
                  
                  {/* Workout Recommendation Card */}
                  <motion.div 
                    whileHover={{ y: -5, borderColor: '#F97316' }}
                    style={{
                      backgroundColor: 'var(--bg-secondary)',
                      borderRadius: '20px',
                      padding: '24px',
                      border: '1px solid var(--border-color)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      transition: 'border-color 0.3s'
                    }}
                  >
                    <div>
                      <span style={{ fontSize: '11px', color: '#F97316', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase' }}>
                        RECOMMENDED SESSION
                      </span>
                      <h3 style={{ margin: '8px 0 6px 0', fontSize: '18px', fontWeight: '700' }}>
                        {workoutFocus ? workoutFocus.title : 'Upper Body Strength'}
                      </h3>
                      <p style={{ margin: '0 0 16px 0', color: 'var(--text-slate)', fontSize: '13px' }}>
                        Based on your fitness targets and streak targets.
                      </p>
                      <div style={{ display: 'flex', gap: '14px', fontSize: '13px', color: 'var(--text-white)', marginBottom: '20px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <IoTime style={{ color: '#F97316' }} /> {workoutFocus ? `${workoutFocus.duration} minutes` : '30 mins'}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <IoFlame style={{ color: '#EF4444' }} /> {workoutFocus ? `${workoutFocus.difficulty}` : 'Intermediate'}
                        </span>
                      </div>
                    </div>
                    
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      onClick={() => navigate(`/workout?startSessionId=${workoutFocus?._id || ''}`)}
                      style={{
                        backgroundColor: '#F97316',
                        color: '#FFF',
                        border: 'none',
                        borderRadius: '10px',
                        padding: '12px',
                        fontSize: '13px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                      Start Session <IoPlay />
                    </motion.button>
                  </motion.div>

                  {/* Meal Recommendation Card */}
                  <motion.div 
                    whileHover={{ y: -5, borderColor: '#10B981' }}
                    style={{
                      backgroundColor: 'var(--bg-secondary)',
                      borderRadius: '20px',
                      padding: '24px',
                      border: '1px solid var(--border-color)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      transition: 'border-color 0.3s'
                    }}
                  >
                    <div>
                      <span style={{ fontSize: '11px', color: '#10B981', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase' }}>
                        MEAL RECOMMENDATION
                      </span>
                      <h3 style={{ margin: '8px 0 6px 0', fontSize: '18px', fontWeight: '700' }}>
                        {mealRec.title}
                      </h3>
                      <p style={{ margin: '0 0 16px 0', color: 'var(--text-slate)', fontSize: '13px', lineHeight: '1.4' }}>
                        {mealRec.summary}
                      </p>
                      <div style={{ display: 'flex', gap: '14px', fontSize: '13px', color: 'var(--text-white)', marginBottom: '20px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <IoFlame style={{ color: '#EF4444' }} /> {mealRec.calories} Calories
                        </span>
                      </div>
                    </div>
                    
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      onClick={() => navigate('/mealplan')}
                      style={{
                        backgroundColor: '#10B981',
                        color: '#FFF',
                        border: 'none',
                        borderRadius: '10px',
                        padding: '12px',
                        fontSize: '13px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                      Generate Plan <IoNavigate />
                    </motion.button>
                  </motion.div>

                  {/* Weekly Challenge Card */}
                  <motion.div 
                    whileHover={{ y: -5 }}
                    style={{
                      backgroundColor: 'var(--bg-secondary)',
                      borderRadius: '20px',
                      padding: '24px',
                      border: '1px solid var(--border-color)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <span style={{ fontSize: '11px', color: '#8B5CF6', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase' }}>
                        WEEKLY CHALLENGE
                      </span>
                      <h3 style={{ margin: '8px 0 10px 0', fontSize: '16px', fontWeight: '700' }}>
                        {weeklyChallenge.title}
                      </h3>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-slate)', marginBottom: '6px' }}>
                        <span>Challenge Progress</span>
                        <span style={{ fontWeight: '800', color: '#10B981' }}>
                          {weeklyChallenge.current} / {weeklyChallenge.goal} Days
                        </span>
                      </div>
                      
                      {/* Progress bar container */}
                      <div style={{ height: '8px', backgroundColor: 'var(--bg-primary)', borderRadius: '4px', overflow: 'hidden', marginBottom: '20px' }}>
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${weeklyChallenge.percentage}%` }}
                          transition={{ duration: 1, ease: 'easeOut' }}
                          style={{ height: '100%', backgroundColor: '#8B5CF6', borderRadius: '4px' }}
                        />
                      </div>
                    </div>
                    
                    <div style={{ 
                      fontSize: '12px', 
                      color: 'var(--text-slate)', 
                      backgroundColor: 'rgba(255,255,255,0.01)', 
                      borderRadius: '8px', 
                      padding: '8px 12px',
                      textAlign: 'center',
                      border: '1px solid var(--border-color)'
                    }}>
                      Complete all checklist tasks in a day to progress
                    </div>
                  </motion.div>

                  {/* Recent Achievement Card */}
                  <motion.div 
                    whileHover={{ y: -5 }}
                    style={{
                      backgroundColor: 'var(--bg-secondary)',
                      borderRadius: '20px',
                      padding: '24px',
                      border: '1px solid var(--border-color)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <span style={{ fontSize: '11px', color: '#F59E0B', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase' }}>
                        LATEST ACHIEVEMENT
                      </span>
                      
                      {recentAchievement ? (
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginTop: '14px' }}>
                          <span style={{ 
                            fontSize: '44px', 
                            width: '64px', 
                            height: '64px', 
                            borderRadius: '50%',
                            backgroundColor: 'var(--bg-primary)',
                            border: '2px solid #F59E0B',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 0 15px rgba(245,158,11,0.1)'
                          }}>
                            {recentAchievement.icon}
                          </span>
                          <div>
                            <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: 'var(--text-white)' }}>
                              {recentAchievement.badgeName}
                            </h4>
                            <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--text-slate)', lineHeight: '1.3' }}>
                              {recentAchievement.description}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div style={{ marginTop: '16px', color: 'var(--text-slate)', fontStyle: 'italic', fontSize: '13px' }}>
                          Unlock badges by completing checklist goals or programs!
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: 'var(--text-slate)', marginTop: '20px' }}>
                      <span>Earned: {recentAchievement ? `+${recentAchievement.xpEarned} XP` : 'N/A'}</span>
                      <span>Verified Badge</span>
                    </div>
                  </motion.div>

                </div>
              </div>

              {/* Today's Dynamic Insights */}
              <div style={{
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: '20px',
                padding: '24px',
                border: '1px solid var(--border-color)'
              }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <IoBulb style={{ color: '#F59E0B' }} /> Today's Insights
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {insights.map((ins, idx) => (
                    <div key={idx} style={{
                      backgroundColor: 'rgba(249, 115, 22, 0.03)',
                      border: '1px solid rgba(249, 115, 22, 0.1)',
                      borderRadius: '12px',
                      padding: '14px 18px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}>
                      <span style={{ fontSize: '18px', color: '#F97316' }}>•</span>
                      <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-white)', lineHeight: '1.4' }}>
                        {ins}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Water Intake Logging widget */}
              <div style={{
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: '20px',
                padding: '24px',
                border: '1px solid var(--border-color)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '20px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <span style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(14,165,233,0.1)',
                    color: '#0EA5E9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px'
                  }}>
                    <IoWaterOutline />
                  </span>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700' }}>Water Intake Tracker</h3>
                    <span style={{ fontSize: '13px', color: 'var(--text-slate)' }}>
                      Logged today: <strong style={{ color: '#0EA5E9' }}>{user.waterIntake || 0} ml</strong> / 2000 ml
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <select 
                    value={waterAmount}
                    onChange={(e) => setWaterAmount(Number(e.target.value))}
                    style={{
                      backgroundColor: 'var(--bg-primary)',
                      color: 'var(--text-white)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      outline: 'none',
                      fontSize: '13px'
                    }}
                  >
                    <option value="250">250 ml (Glass)</option>
                    <option value="500">500 ml (Bottle)</option>
                    <option value="750">750 ml (Large shaker)</option>
                  </select>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    onClick={() => handleLogWater(waterAmount)}
                    style={{
                      backgroundColor: '#0EA5E9',
                      color: '#FFF',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '8px 16px',
                      fontSize: '13px',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    Log Water
                  </motion.button>
                </div>
              </div>

              {/* Checklist details & Weekly calendar */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '20px'
              }}>

                {/* Daily Checklist Card */}
                <div style={{
                  backgroundColor: 'var(--bg-secondary)',
                  borderRadius: '20px',
                  padding: '24px',
                  border: '1px solid var(--border-color)'
                }}>
                  <h3 style={{ margin: '0 0 14px 0', fontSize: '16px', fontWeight: '700' }}>Daily Checklist</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {[
                      { key: 'workout', label: 'Workout Completed' },
                      { key: 'meal', label: 'Healthy Meals Tracked' },
                      { key: 'water', label: 'Water Goal Completed' },
                      { key: 'stretch', label: 'Stretching Completed' },
                      { key: 'sleep', label: 'Sleep Goal Achieved' }
                    ].map(item => (
                      <label key={item.key} style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 14px',
                        backgroundColor: 'rgba(255,255,255,0.01)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        userSelect: 'none'
                      }}>
                        <span style={{ 
                          fontSize: '13px', 
                          color: (user.checklist && user.checklist[item.key]) ? '#10B981' : 'var(--text-white)',
                          fontWeight: (user.checklist && user.checklist[item.key]) ? '700' : '500'
                        }}>
                          {item.label}
                        </span>
                        <input 
                          type="checkbox" 
                          checked={(user.checklist && user.checklist[item.key]) || false}
                          onChange={() => handleToggleChecklist(item.key)}
                          style={{
                            accentColor: '#10B981',
                            width: '16px',
                            height: '16px',
                            cursor: 'pointer'
                          }}
                        />
                      </label>
                    ))}
                  </div>
                </div>

                {/* Calendar */}
                <div style={{
                  backgroundColor: 'var(--bg-secondary)',
                  borderRadius: '20px',
                  padding: '24px',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '700' }}>Weekly Calendar</h3>
                    <p style={{ margin: '0 0 16px 0', color: 'var(--text-slate)', fontSize: '12px' }}>Checklist milestones completed</p>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    {(user.weeklyCalendar || []).map((d, index) => (
                      <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '12px', color: 'var(--text-slate)', fontWeight: '700' }}>{d.day}</span>
                        <div style={{
                          width: '26px',
                          height: '26px',
                          borderRadius: '50%',
                          backgroundColor: d.completed ? '#10B981' : 'rgba(255,255,255,0.02)',
                          border: d.completed ? '2px solid #059669' : '1px solid var(--border-color)',
                          boxShadow: d.completed ? '0 0 10px rgba(16, 185, 129, 0.4)' : 'none',
                          transition: 'all 0.3s'
                        }} />
                      </div>
                    ))}
                  </div>

                  <div style={{ 
                    marginTop: '20px', 
                    fontSize: '11px', 
                    color: 'var(--text-slate)',
                    backgroundColor: 'rgba(16,185,129,0.02)',
                    border: '1px solid rgba(16,185,129,0.08)',
                    borderRadius: '8px',
                    padding: '8px',
                    textAlign: 'center'
                  }}>
                    Complete all 5 daily tasks to light up today's orb
                  </div>
                </div>

              </div>

              {/* XP Level progression tracker */}
              <div style={{
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: '20px',
                padding: '24px',
                border: '1px solid var(--border-color)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div>
                    <span style={{ fontSize: '11px', color: '#F97316', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>XP progress</span>
                    <h3 style={{ margin: '2px 0 0 0', fontSize: '18px', fontWeight: '800' }}>
                      Level {user.level} • <span style={{ color: '#F97316' }}>{currentLevelName}</span>
                    </h3>
                  </div>
                  <span style={{ fontSize: '13px', color: 'var(--text-slate)', fontWeight: '600' }}>
                    {user.xp} / {user.xpToNextLevel || 200} XP
                  </span>
                </div>
                
                {/* Bar */}
                <div style={{ height: '8px', backgroundColor: 'var(--bg-primary)', borderRadius: '4px', overflow: 'hidden', marginBottom: '14px' }}>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${xpPercent}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    style={{ height: '100%', backgroundColor: '#F97316', borderRadius: '4px' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {(user.badges || []).map((badge, idx) => (
                    <span key={idx} title={badge} style={{
                      backgroundColor: 'var(--bg-primary)',
                      color: '#10B981',
                      border: '1px solid #10B981',
                      borderRadius: '20px',
                      padding: '4px 12px',
                      fontSize: '12px',
                      fontWeight: '700'
                    }}>
                      🏆 {badge}
                    </span>
                  ))}
                </div>
              </div>

              {/* Recent Activity Timeline */}
              <div style={{
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: '20px',
                padding: '24px',
                border: '1px solid var(--border-color)'
              }}>
                <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '800' }}>Recent Activity Timeline</h3>
                
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px',
                  position: 'relative',
                  paddingLeft: '20px'
                }}>
                  
                  {/* Vertical Timeline bar line */}
                  <div style={{
                    position: 'absolute',
                    top: '5px',
                    bottom: '5px',
                    left: '5px',
                    width: '2px',
                    backgroundColor: 'var(--border-color)'
                  }} />

                  {timeline.map((item, index) => (
                    <div key={index} style={{
                      position: 'relative',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '12px'
                    }}>
                      
                      {/* Timeline dot */}
                      <span style={{
                        position: 'absolute',
                        left: '-20px',
                        top: '6px',
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        backgroundColor: item.type === 'workout' ? '#10B981' : item.type === 'bookmark' ? '#F97316' : '#8B5CF6',
                        border: '2px solid var(--bg-secondary)',
                        boxShadow: '0 0 8px rgba(255,255,255,0.1)'
                      }} />

                      <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-white)' }}>
                        {item.text}
                      </p>
                      
                      <span style={{ fontSize: '11px', color: 'var(--text-slate)', whiteSpace: 'nowrap' }}>
                        {item.time}
                      </span>

                    </div>
                  ))}

                </div>
              </div>

            </div>

            {/* RIGHT AREA: Illustration & Quick actions navigation */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '30px'
            }}>
              
              {/* Activity Calendar Component */}
              <ActivityCalendar activities={calendarData} />

              {/* Quick Actions List (Hover scale) */}
              <div style={{
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: '24px',
                padding: '24px',
                border: '1px solid var(--border-color)'
              }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '800', color: 'var(--text-slate)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                  Quick Nav Menu
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[
                    { text: 'Start Guided Workouts', desc: 'Category cards & active timers', path: '/workout', color: '#F97316', icon: <IoBicycle /> },
                    { text: 'Pantry Meal Planner', desc: 'Select ingredients & get recipes', path: '/mealplan', color: '#10B981', icon: <IoRestaurant /> },
                    { text: 'Membership Plans', desc: 'Unlock premium subscription levels', path: '/membership', color: '#8B5CF6', icon: <IoCalendar /> },
                    { text: 'Analyze Progress Profile', desc: 'Milestones, BMI, & metrics logs', path: '/profile', color: '#0EA5E9', icon: <IoStatsChart /> }
                  ].map((item, idx) => (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: 1.02, x: 4 }}
                      onClick={() => navigate(item.path)}
                      style={{
                        backgroundColor: 'var(--bg-primary)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '16px',
                        padding: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        cursor: 'pointer',
                        textAlign: 'left',
                        width: '100%'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.borderColor = item.color}
                      onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
                    >
                      <span style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '10px',
                        backgroundColor: 'rgba(255,255,255,0.02)',
                        color: item.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '20px'
                      }}>
                        {item.icon}
                      </span>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: 'var(--text-white)' }}>
                          {item.text}
                        </h4>
                        <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: 'var(--text-slate)' }}>
                          {item.desc}
                        </p>
                      </div>
                      <IoChevronForward style={{ color: '#475569' }} />
                    </motion.button>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>

      {/* CELEBRATION MODAL OVERLAY */}
      <AnimatePresence>
        {showCelebration && (
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(15, 23, 42, 0.9)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10000,
              padding: '20px'
            }}
            onClick={() => setShowCelebration(false)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.8, y: 50, opacity: 0 }}
              transition={{ type: 'spring', damping: 15, stiffness: 200 }}
              style={{
                background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
                border: '2px solid #10B981',
                borderRadius: '30px',
                padding: '40px 30px',
                textAlign: 'center',
                maxWidth: '400px',
                width: '100%',
                boxShadow: '0 0 30px rgba(16, 185, 129, 0.4)',
                position: 'relative'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Celebration Icon */}
              <motion.div
                animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{
                  fontSize: '70px',
                  marginBottom: '20px'
                }}
              >
                🎉
              </motion.div>

              <h2 style={{
                fontSize: '28px',
                fontWeight: '800',
                color: '#10B981',
                margin: '0 0 10px 0'
              }}>
                Daily Mission Complete!
              </h2>
              <p style={{
                fontSize: '14px',
                color: 'var(--text-slate)',
                lineHeight: '1.5',
                margin: '0 0 24px 0'
              }}>
                Fantastic job! You've checked off your Workout, Meal Plan, and Program Day today.
              </p>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                marginBottom: '30px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  fontSize: '18px',
                  fontWeight: '800',
                  color: '#F97316'
                }}>
                  <IoRibbon /> +150 XP Earned Today
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  fontSize: '18px',
                  fontWeight: '800',
                  color: '#EF4444'
                }}>
                  <IoFlame /> Streak Increased!
                </div>
              </div>

              <button
                onClick={() => setShowCelebration(false)}
                style={{
                  backgroundColor: '#10B981',
                  color: '#FFF',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '12px 28px',
                  fontWeight: '700',
                  fontSize: '15px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)'
                }}
              >
                Awesome, Let's Continue!
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MyJourney;
