import React, { useState } from 'react';
import { useAuth, api } from './context/AuthContext';
import Navbar from './components/Navbar';
import { motion } from 'framer-motion';
import { 
  IoCheckmarkCircle, 
  IoSparkles, 
  IoRibbon, 
  IoFlame, 
  IoShieldCheckmark,
  IoStatsChart,
  IoNutrition,
  IoFitness,
  IoCalendar,
  IoHourglassOutline
} from 'react-icons/io5';

const Membership = () => {
  const { user, setUser, addToast } = useAuth();
  const [loadingPlan, setLoadingPlan] = useState(null);

  const handleUpgrade = async (planName) => {
    if (user?.membershipType === planName) return;
    setLoadingPlan(planName);
    try {
      const res = await api.post('/membership/upgrade', { plan: planName });
      setUser((prev) => ({
        ...prev,
        membershipType: planName,
        membershipStatus: 'Active',
        membershipStartDate: res.data.user.membershipStartDate,
        membershipEndDate: res.data.user.membershipEndDate,
        membershipHistory: res.data.user.membershipHistory
      }));
      addToast(`Plan updated to ${planName} successfully!`, 'success');
    } catch (err) {
      console.error(err);
      addToast(err.response?.data?.message || 'Failed to update membership plan', 'error');
    } finally {
      setLoadingPlan(null);
    }
  };

  const currentPlan = user?.membershipType || 'Starter';
  const getBadgeName = (plan) => {
    if (plan === 'Pro') return '🏆 Pro Athlete';
    if (plan === 'Elite') return '👑 Elite Catalyst';
    return '⚡ Starter';
  };

  const getBadgeColor = (plan) => {
    if (plan === 'Pro') return '#F97316';
    if (plan === 'Elite') return '#8B5CF6';
    return '#94A3B8';
  };

  return (
    <>
      <Navbar />
      <div style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-white)',
        padding: '40px 20px',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          {/* HEADER SECTION */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <motion.span 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                backgroundColor: 'rgba(139, 92, 246, 0.1)',
                color: '#8B5CF6',
                fontSize: '12px',
                fontWeight: '800',
                padding: '6px 16px',
                borderRadius: '20px',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                display: 'inline-block',
                marginBottom: '14px',
                border: '1px solid rgba(139, 92, 246, 0.2)'
              }}
            >
              ZenFit Premium
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ fontSize: '42px', fontWeight: '800', margin: '0 0 10px 0' }}
            >
              ZenFit Membership
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              style={{ fontSize: '15px', color: 'var(--text-slate)', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}
            >
              Unlock premium fitness experiences with structured programs, exclusive challenges, and advanced nutrition planning.
            </motion.p>
          </div>

          {/* CURRENT PLAN SUMMARY CARD */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: 'rgba(255, 255, 255, 0.02)',
              backdropFilter: 'blur(10px)',
              border: '1px solid var(--border-color)',
              borderRadius: '24px',
              padding: '24px',
              marginBottom: '40px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '24px',
              boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1)'
            }}
          >
            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-slate)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Active Plan
              </span>
              <h3 style={{ margin: '4px 0 0 0', fontSize: '24px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
                ZenFit <span style={{ color: getBadgeColor(currentPlan) }}>{currentPlan}</span>
              </h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '20px', flex: 1, justifyItems: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <span style={{ display: 'block', fontSize: '10px', color: 'var(--text-slate)', fontWeight: '600', textTransform: 'uppercase' }}>STATUS</span>
                <span style={{ fontSize: '14px', fontWeight: '800', color: '#10B981', display: 'flex', alignItems: 'center', justifyItems: 'center', gap: '4px', marginTop: '4px' }}>
                  <IoShieldCheckmark /> Active
                </span>
              </div>
              <div style={{ textAlign: 'center' }}>
                <span style={{ display: 'block', fontSize: '10px', color: 'var(--text-slate)', fontWeight: '600', textTransform: 'uppercase' }}>XP LEVEL</span>
                <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-white)', display: 'block', marginTop: '4px' }}>
                  Level {user?.level || 1}
                </span>
              </div>
              <div style={{ textAlign: 'center' }}>
                <span style={{ display: 'block', fontSize: '10px', color: 'var(--text-slate)', fontWeight: '600', textTransform: 'uppercase' }}>BADGE</span>
                <span style={{ 
                  fontSize: '12px', 
                  fontWeight: '700', 
                  color: getBadgeColor(currentPlan),
                  border: `1px solid ${getBadgeColor(currentPlan)}`,
                  padding: '2px 8px',
                  borderRadius: '12px',
                  display: 'inline-block',
                  marginTop: '4px',
                  backgroundColor: 'rgba(255, 255, 255, 0.01)'
                }}>
                  {getBadgeName(currentPlan)}
                </span>
              </div>
            </div>
          </motion.div>

          {/* SUBSCRIPTION PLANS SECTION */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px',
            marginBottom: '60px',
            alignItems: 'stretch'
          }}>
            
            {/* STARTER CARD */}
            <motion.div 
              whileHover={{ y: -6 }}
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: currentPlan === 'Starter' ? '2px solid #94A3B8' : '1px solid var(--border-color)',
                borderRadius: '24px',
                padding: '32px 24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 8px 32px 0 rgba(0,0,0,0.1)'
              }}
            >
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: '800', margin: 0 }}>Starter</h3>
                <div style={{ margin: '16px 0', display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                  <span style={{ fontSize: '36px', fontWeight: '800' }}>FREE</span>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-slate)', marginBottom: '24px' }}>Essential features to start tracking workouts and meals.</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
                  {['Guided Workout Sessions', 'Meal Planner', 'Daily Mission Tracking', 'Activity Calendar', 'Progress Dashboard'].map((feat, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                      <IoCheckmarkCircle style={{ color: '#10B981', fontSize: '18px' }} />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
              <button 
                onClick={() => handleUpgrade('Starter')}
                disabled={currentPlan === 'Starter' || loadingPlan !== null}
                style={{
                  backgroundColor: currentPlan === 'Starter' ? 'rgba(255,255,255,0.05)' : 'transparent',
                  border: currentPlan === 'Starter' ? 'none' : '1px solid var(--border-color)',
                  color: currentPlan === 'Starter' ? 'var(--text-slate)' : '#FFF',
                  width: '100%',
                  padding: '12px',
                  borderRadius: '12px',
                  fontWeight: '700',
                  cursor: currentPlan === 'Starter' ? 'default' : 'pointer'
                }}
              >
                {currentPlan === 'Starter' ? 'Current Plan' : 'Select Plan'}
              </button>
            </motion.div>

            {/* PRO CARD */}
            <motion.div 
              whileHover={{ y: -6 }}
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: currentPlan === 'Pro' ? '2px solid #F97316' : '1px solid var(--border-color)',
                borderRadius: '24px',
                padding: '32px 24px',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 8px 32px 0 rgba(0,0,0,0.1)'
              }}
            >
              {/* Popular Badge */}
              <span style={{
                position: 'absolute',
                top: '-12px',
                right: '24px',
                backgroundColor: '#F97316',
                color: '#FFF',
                fontSize: '10px',
                fontWeight: '800',
                padding: '4px 12px',
                borderRadius: '20px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Popular
              </span>

              <div>
                <h3 style={{ fontSize: '20px', fontWeight: '800', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  Pro <IoSparkles style={{ color: '#F97316' }} />
                </h3>
                <div style={{ margin: '16px 0', display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                  <span style={{ fontSize: '36px', fontWeight: '800' }}>₹499</span>
                  <span style={{ fontSize: '13px', color: 'var(--text-slate)' }}>/ month</span>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-slate)', marginBottom: '24px' }}>Perfect for dedicated athletes wanting custom workouts and history.</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
                  {['Unlimited Workout Programs', 'Premium Guided Sessions', 'Advanced Meal Planning', 'Weekly Challenges', 'Unlimited Workout History', 'Premium Badges'].map((feat, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                      <IoCheckmarkCircle style={{ color: '#F97316', fontSize: '18px' }} />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
              <button 
                onClick={() => handleUpgrade('Pro')}
                disabled={currentPlan === 'Pro' || loadingPlan !== null}
                style={{
                  backgroundColor: currentPlan === 'Pro' ? 'rgba(249,115,22,0.15)' : '#F97316',
                  border: currentPlan === 'Pro' ? '1px solid rgba(249,115,22,0.3)' : 'none',
                  color: currentPlan === 'Pro' ? '#F97316' : '#FFF',
                  width: '100%',
                  padding: '12px',
                  borderRadius: '12px',
                  fontWeight: '700',
                  cursor: currentPlan === 'Pro' ? 'default' : 'pointer',
                  boxShadow: currentPlan === 'Pro' ? 'none' : '0 4px 12px rgba(249,115,22,0.3)'
                }}
              >
                {loadingPlan === 'Pro' ? 'Upgrading...' : currentPlan === 'Pro' ? 'Current Plan' : 'Upgrade Plan'}
              </button>
            </motion.div>

            {/* ELITE CARD */}
            <motion.div 
              whileHover={{ y: -6 }}
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: currentPlan === 'Elite' ? '2px solid #8B5CF6' : '1px solid var(--border-color)',
                borderRadius: '24px',
                padding: '32px 24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 8px 32px 0 rgba(0,0,0,0.1)'
              }}
            >
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: '800', margin: 0 }}>Elite</h3>
                <div style={{ margin: '16px 0', display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                  <span style={{ fontSize: '36px', fontWeight: '800' }}>₹999</span>
                  <span style={{ fontSize: '13px', color: 'var(--text-slate)' }}>/ month</span>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-slate)', marginBottom: '24px' }}>Ultimate experience including personal plans and AI features.</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
                  {['Everything in Pro', 'Personalized Programs', 'Exclusive Challenges', 'Elite Achievement Badges', 'Early Access Features', 'Future AI Recommendations'].map((feat, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                      <IoCheckmarkCircle style={{ color: '#8B5CF6', fontSize: '18px' }} />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
              <button 
                onClick={() => handleUpgrade('Elite')}
                disabled={currentPlan === 'Elite' || loadingPlan !== null}
                style={{
                  backgroundColor: currentPlan === 'Elite' ? 'rgba(139,92,246,0.15)' : '#8B5CF6',
                  border: currentPlan === 'Elite' ? '1px solid rgba(139,92,246,0.3)' : 'none',
                  color: currentPlan === 'Elite' ? '#8B5CF6' : '#FFF',
                  width: '100%',
                  padding: '12px',
                  borderRadius: '12px',
                  fontWeight: '700',
                  cursor: currentPlan === 'Elite' ? 'default' : 'pointer',
                  boxShadow: currentPlan === 'Elite' ? 'none' : '0 4px 12px rgba(139,92,246,0.3)'
                }}
              >
                {loadingPlan === 'Elite' ? 'Upgrading...' : currentPlan === 'Elite' ? 'Current Plan' : 'Upgrade Plan'}
              </button>
            </motion.div>

          </div>

          {/* FEATURE COMPARISON TABLE */}
          <div style={{ marginBottom: '60px' }}>
            <h3 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '20px', textAlign: 'center' }}>Plan Comparison</h3>
            <div style={{ overflowX: 'auto', background: 'rgba(255, 255, 255, 0.01)', border: '1px solid var(--border-color)', borderRadius: '20px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-slate)', fontSize: '12px', textTransform: 'uppercase' }}>
                    <th style={{ padding: '16px 24px' }}>Feature</th>
                    <th style={{ padding: '16px 24px' }}>Starter</th>
                    <th style={{ padding: '16px 24px' }}>Pro</th>
                    <th style={{ padding: '16px 24px' }}>Elite</th>
                  </tr>
                </thead>
                <tbody style={{ fontSize: '13px' }}>
                  {[
                    { name: 'Workout Sessions', starter: '✓', pro: '✓', elite: '✓' },
                    { name: 'Meal Planner', starter: '✓', pro: '✓', elite: '✓' },
                    { name: 'Workout Programs', starter: 'Limited', pro: 'Unlimited', elite: 'Unlimited' },
                    { name: 'Challenges', starter: '✕', pro: '✓', elite: '✓' },
                    { name: 'Workout History', starter: 'Limited', pro: 'Unlimited', elite: 'Unlimited' },
                    { name: 'Activity Calendar', starter: '✓', pro: '✓', elite: '✓' },
                    { name: 'Premium Badges', starter: '✕', pro: '✓', elite: '✓' },
                    { name: 'Future AI Features', starter: '✕', pro: '✕', elite: '✓' }
                  ].map((row, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '16px 24px', fontWeight: '600' }}>{row.name}</td>
                      <td style={{ padding: '16px 24px', color: row.starter === '✕' ? '#EF4444' : '#10B981', fontWeight: '700' }}>{row.starter}</td>
                      <td style={{ padding: '16px 24px', color: row.pro === '✕' ? '#EF4444' : '#10B981', fontWeight: '700' }}>{row.pro}</td>
                      <td style={{ padding: '16px 24px', color: row.elite === '✕' ? '#EF4444' : '#10B981', fontWeight: '700' }}>{row.elite}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* WHY UPGRADE SECTION */}
          <div style={{ marginBottom: '60px' }}>
            <h3 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '32px', textAlign: 'center' }}>Why Upgrade to Premium?</h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px'
            }}>
              {[
                { title: 'Unlimited Workout Programs', desc: 'Unlock structured, multi-week programs designed for fat loss, strength gain, and active conditioning.', icon: <IoFitness /> },
                { title: 'Advanced Nutrition', desc: 'Formulate pantry meal recommendations, customize dietary preferences, and track macros.', icon: <IoNutrition /> },
                { title: 'Exclusive Challenges', desc: 'Participate in weekly community consistency challenges and earn level booster points.', icon: <IoFlame /> },
                { title: 'Premium Badges', desc: 'Unlock elite profile badges like "Elite Catalyst" or "Pro Athlete" to display on your profile dashboard.', icon: <IoRibbon /> },
                { title: 'Unlimited Workout History', desc: 'Keep track of all completed workouts, total durations, reps, and calories burned history.', icon: <IoStatsChart /> },
                { title: 'Priority Feature Access', desc: 'Get immediate access to early release updates, customized planners, and future support systems.', icon: <IoCalendar /> }
              ].map((benefit, i) => (
                <div key={i} style={{
                  background: 'rgba(255,255,255,0.01)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '16px',
                  padding: '20px',
                  display: 'flex',
                  gap: '16px'
                }}>
                  <span style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(139, 92, 246, 0.08)',
                    color: '#8B5CF6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    flexShrink: 0
                  }}>
                    {benefit.icon}
                  </span>
                  <div>
                    <h4 style={{ margin: '0 0 6px 0', fontSize: '15px', fontWeight: '700', color: 'var(--text-white)' }}>{benefit.title}</h4>
                    <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-slate)', lineHeight: '1.4' }}>{benefit.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* COMING SOON SECTION */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.01)',
            border: '1px solid var(--border-color)',
            borderRadius: '24px',
            padding: '30px',
            textAlign: 'center'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <IoHourglassOutline style={{ color: '#8B5CF6' }} /> Future Pipeline Features
            </h3>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px',
              justifyContent: 'center'
            }}>
              {['AI Fitness Coach', 'Recovery Analytics', 'Wearable Device Sync', 'Community Challenges', 'Nutrition Insights'].map((tag, i) => (
                <span key={i} style={{
                  backgroundColor: 'rgba(255,255,255,0.02)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '20px',
                  padding: '6px 16px',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: 'var(--text-slate)'
                }}>
                  ✨ {tag}
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default Membership;
