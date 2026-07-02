import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, api } from './context/AuthContext';
import Navbar from './components/Navbar';
import ActivityCalendar from './components/ActivityCalendar';
import { IoFitness, IoRestaurant, IoCalendar, IoStatsChart, IoRibbon, IoCheckmarkCircle, IoPlay } from 'react-icons/io5';

const HomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [calendarData, setCalendarData] = useState([]);

  useEffect(() => {
    const fetchCalendarData = async () => {
      if (user) {
        try {
          const res = await api.get('/users/activity-calendar');
          setCalendarData(res.data);
        } catch (err) {
          console.error('Error fetching calendar data:', err);
        }
      }
    };
    fetchCalendarData();
  }, [user]);

  // Testimonials Slider state
  const testimonials = [
    { name: "Himani Sharma", role: "Yoga Practitioner", text: "ZenFit transformed my morning routine! Ticking off the checklist daily keeps me focused, and the XP level-up system actually makes fitness fun.", rating: 5 },
    { name: "Naman Verma", role: "Strength Athlete", text: "The exercise explorer has crystal clear guides. I stopped making simple form mistakes on squats. Truly a premium experience.", rating: 5 },
    { name: "Komal Preet", role: "Home Fitness Enthusiast", text: "Pantry Mode in the Meal Planner is a life saver! I select eggs, tomatoes, and paneer, and the backend gives me exact healthy recipes immediately.", rating: 5 }
  ];
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <Navbar />
      <div style={{
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-white)',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        overflow: 'hidden',
        transition: 'background-color 0.2s, color 0.2s'
      }}>
        {/* HERO SECTION */}
        <section style={{
          minHeight: '85vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          padding: '60px 20px',
          textAlign: 'center',
          borderBottom: '1px solid var(--border-color)'
        }}>
          {/* Animated/Abstract floating background blobs */}
          <div style={{
            position: 'absolute',
            width: '280px',
            height: '280px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(249,115,22,0.12) 0%, transparent 70%)',
            top: '10%',
            left: '15%',
            filter: 'blur(30px)',
            zIndex: 0
          }} />
          <div style={{
            position: 'absolute',
            width: '320px',
            height: '320px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)',
            bottom: '15%',
            right: '15%',
            filter: 'blur(30px)',
            zIndex: 0
          }} />

          <div style={{ maxWidth: '800px', zIndex: 1 }}>
            <span style={{
              backgroundColor: 'rgba(249, 115, 22, 0.08)',
              color: '#F97316',
              fontSize: '12px',
              fontWeight: '800',
              padding: '6px 14px',
              borderRadius: '20px',
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              display: 'inline-block',
              marginBottom: '20px',
              border: '1px solid rgba(249,115,22,0.2)'
            }}>
              Your premium full-stack gym companion
            </span>
            <h1 style={{
              fontSize: '56px',
              fontWeight: '800',
              lineHeight: '1.15',
              letterSpacing: '-1px',
              margin: '0 0 20px 0',
              textShadow: '0 0 40px rgba(255,255,255,0.05)'
            }}>
              Unleash Your Potential With <span style={{ color: '#F97316' }}>ZenFit</span>
            </h1>
            <p style={{
              fontSize: '18px',
              color: 'var(--text-slate)',
              lineHeight: '1.6',
              maxWidth: '600px',
              margin: '0 auto 36px auto'
            }}>
              Track workouts, generate pantry-matched meal plans, unlock premium memberships, and progress through a gamified level system. Start your premium journey today.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <Link to={user ? "/journey" : "/signup"} style={{
                textDecoration: 'none',
                backgroundColor: '#F97316',
                color: '#FFF',
                padding: '14px 32px',
                borderRadius: '10px',
                fontSize: '15px',
                fontWeight: '700',
                boxShadow: '0 0 15px rgba(249, 115, 22, 0.4)',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-1px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
              >
                {user ? "Go to My Journey" : "Get Started Now"}
              </Link>
              <Link to="/workout" style={{
                textDecoration: 'none',
                backgroundColor: 'var(--bg-secondary)',
                color: 'var(--text-white)',
                border: '1px solid var(--border-color)',
                padding: '14px 32px',
                borderRadius: '10px',
                fontSize: '15px',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-1px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
              >
                Explore Exercises <IoPlay />
              </Link>
            </div>
          </div>
        </section>

        {/* STATISTICS SECTION */}
        <section style={{
          padding: '50px 20px',
          backgroundColor: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border-color)',
          borderTop: '1px solid var(--border-color)'
        }}>
          <div style={{
            maxWidth: '1000px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '30px',
            textAlign: 'center'
          }}>
            {[
              { num: "12,000+", label: "Active Athletes" },
              { num: "500+", label: "Professional Exercises" },
              { num: "98.4%", label: "Satisfaction Rating" },
              { num: "450k+", label: "XP Points Rewarded" }
            ].map((stat, idx) => (
              <div key={idx}>
                <h3 style={{ fontSize: '38px', fontWeight: '800', color: '#10B981', margin: '0 0 6px 0' }}>{stat.num}</h3>
                <span style={{ fontSize: '13px', color: 'var(--text-slate)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ACTIVITY CALENDAR SECTION */}
        <section style={{
          padding: '60px 20px',
          maxWidth: '800px',
          margin: '0 auto',
          position: 'relative'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <span style={{ color: '#F97316', fontSize: '11px', fontWeight: '800', letterSpacing: '1.2px', textTransform: 'uppercase' }}>
              Daily Consistency
            </span>
            <h2 style={{ fontSize: '36px', fontWeight: '800', margin: '6px 0 10px 0' }}>
              {user ? "Your Workout Consistency" : "Track Your Fitness Consistency"}
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--text-slate)', maxWidth: '500px', margin: '0 auto', lineHeight: '1.5' }}>
              {user 
                ? "Every workout session, meal plan generated, and program day completed lights up your activity calendar. Keep the fire burning!"
                : "Just like a developer commits code, commit to your daily workout, meal, and training missions to light up your calendar."
              }
            </p>
          </div>

          <ActivityCalendar activities={calendarData} mock={!user} />
        </section>

        {/* FEATURES GRID */}
        <section style={{ padding: '80px 20px', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <span style={{ color: '#10B981', fontSize: '11px', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase' }}>
              Advanced features
            </span>
            <h2 style={{ fontSize: '36px', fontWeight: '800', margin: '6px 0 0 0' }}>Engineered for Results</h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px'
          }}>
            {[
              { title: "Exercise Explorer", desc: "Browse full detail exercise sheets with target muscles, common form mistakes, and integrated rep counters.", icon: <IoFitness />, color: '#10B981' },
              { title: "Intelligent Pantry Meal Generator", desc: "Select milk, eggs, paneer, and oats, and our backend generator instantly formulates delicious macros-balanced plans.", icon: <IoRestaurant />, color: '#F97316' },
              { title: "Gamified XP Level System", desc: "Stay motivated by earning XP points. Tick off daily checklists, log water goals, and unlock elite badges.", icon: <IoRibbon />, color: '#F59E0B' },
              { title: "Premium Membership Levels", desc: "Unlock premium structured fitness programs, advanced nutrition planners, and exclusive weekly challenges.", icon: <IoCalendar />, color: '#8B5CF6' }
            ].map((feat, idx) => (
              <div key={idx} style={{
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: '16px',
                padding: '30px 24px',
                transition: 'transform 0.2s',
              }}
              className="feature-card"
              >
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--bg-inner)',
                  color: feat.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  marginBottom: '20px'
                }}>
                  {feat.icon}
                </div>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', fontWeight: '700', color: 'var(--text-white)' }}>{feat.title}</h3>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-slate)', lineHeight: '1.6' }}>{feat.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section style={{
          padding: '80px 20px',
          backgroundColor: 'var(--bg-secondary)',
          borderTop: '1px solid var(--border-color)'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '50px' }}>
              <span style={{ color: '#F97316', fontSize: '11px', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase' }}>
                Simple workflow
              </span>
              <h2 style={{ fontSize: '36px', fontWeight: '800', margin: '6px 0 0 0' }}>Three Steps to Transformation</h2>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '40px'
            }}>
              {[
                { step: "01", title: "Join & Calibrate", desc: "Create an account and key in height, weight, and fitness targets. ZenFit instantly computes BMI scores." },
                { step: "02", title: "Follow & Execute", desc: "Generate custom diet plans or check the exercise logs. Tick daily checklist items like sleep, workouts, and water." },
                { step: "03", title: "Level Up & Reward", desc: "Gain XP for every complete task, level up, maintain active streaks, and display badges in your user profile." }
              ].map((item, idx) => (
                <div key={idx} style={{ position: 'relative' }}>
                  <span style={{
                    fontSize: '60px',
                    fontWeight: '800',
                    color: 'var(--bg-inner)',
                    position: 'absolute',
                    top: '-20px',
                    left: '0',
                    zIndex: 0
                  }}>{item.step}</span>
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', fontWeight: '700', color: 'var(--text-white)' }}>{item.title}</h3>
                    <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-slate)', lineHeight: '1.6' }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIALS SLIDER */}
        <section style={{ padding: '80px 20px', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <span style={{ color: '#8B5CF6', fontSize: '11px', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase' }}>
            Success stories
          </span>
          <h2 style={{ fontSize: '36px', fontWeight: '800', margin: '6px 0 30px 0' }}>Endorsed by Zen Athletes</h2>

          <div style={{
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: '16px',
            padding: '40px 30px',
            border: '1px solid var(--border-color)',
            boxShadow: '0 10px 20px rgba(0,0,0,0.05)',
            minHeight: '200px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <p style={{
              fontSize: '16px',
              fontStyle: 'italic',
              lineHeight: '1.7',
              color: 'var(--text-white)',
              margin: '0 0 20px 0'
            }}>
              "{testimonials[activeTestimonial].text}"
            </p>
            <span style={{ fontSize: '14px', fontWeight: '700', color: '#10B981', display: 'block', marginBottom: '2px' }}>
              {testimonials[activeTestimonial].name}
            </span>
            <span style={{ fontSize: '11px', color: 'var(--text-slate)' }}>
              {testimonials[activeTestimonial].role}
            </span>
          </div>

          {/* Dots Indicator */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '20px' }}>
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTestimonial(idx)}
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: activeTestimonial === idx ? '#F97316' : 'rgba(255,255,255,0.2)',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0
                }}
              />
            ))}
          </div>
        </section>

        {/* CALL TO ACTION */}
        <section style={{
          padding: '80px 20px',
          textAlign: 'center',
          backgroundColor: 'var(--bg-secondary)',
          borderTop: '1px solid var(--border-color)'
        }}>
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '36px', fontWeight: '800', margin: '0 0 16px 0' }}>Ready to Elevate Your Routine?</h2>
            <p style={{ fontSize: '15px', color: 'var(--text-slate)', lineHeight: '1.6', marginBottom: '30px' }}>
              Create an account now to start leveling up, tracking hydration, generating grocery lists, and booking workouts.
            </p>
            <Link to={user ? "/journey" : "/signup"} style={{
              textDecoration: 'none',
              backgroundColor: '#10B981',
              color: '#FFF',
              padding: '14px 36px',
              borderRadius: '10px',
              fontSize: '15px',
              fontWeight: '700',
              boxShadow: '0 0 15px rgba(16, 185, 129, 0.4)',
              display: 'inline-block',
              transition: 'transform 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-1px)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            >
              {user ? "Return to Dashboard" : "Sign Up and Start"}
            </Link>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{
          padding: '40px 20px',
          borderTop: '1px solid var(--border-color)',
          backgroundColor: 'var(--bg-primary)',
          fontSize: '13px',
          color: 'var(--text-slate)'
        }}>
          <div style={{
            maxWidth: '1000px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '20px'
          }}>
            <div>
              <span style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-white)' }}>
                ZEN<span style={{ color: '#F97316' }}>FIT</span>
              </span>
              <p style={{ margin: '4px 0 0 0', fontSize: '12px' }}>Your premium transformation partner.</p>
            </div>
            <div>
              &copy; {new Date().getFullYear()} ZenFit. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default HomePage;
