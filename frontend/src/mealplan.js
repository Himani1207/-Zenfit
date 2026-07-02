import React, { useState, useEffect } from 'react';
import { api, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Skeleton from './components/Skeleton';
import { IoSparkles, IoLeaf, IoHeart, IoSwapHorizontal, IoPrint, IoCart, IoLayers, IoTime } from 'react-icons/io5';
import { motion } from 'framer-motion';

// Premium Empty State Component
const PremiumEmptyState = ({ user, pantryMode, selectedPantry }) => {
  return (
    <div style={{
      backgroundColor: 'var(--bg-secondary)',
      borderRadius: '24px',
      padding: '40px',
      border: '1px solid var(--border-color)',
      boxShadow: '0 15px 30px rgba(0,0,0,0.08)',
      display: 'flex',
      flexDirection: 'column',
      gap: '30px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Title & Description */}
      <div style={{ textAlign: 'center' }}>
        <span style={{ 
          color: '#10B981', 
          fontSize: '11px', 
          fontWeight: '800', 
          letterSpacing: '1.5px', 
          textTransform: 'uppercase',
          display: 'block',
          marginBottom: '6px'
        }}>
          Metabolic Engine
        </span>
        <h2 style={{ margin: '0 0 10px 0', fontSize: '24px', fontWeight: '800', color: 'var(--text-white)' }}>
          Your Personalized Nutrition Guide
        </h2>
        <p style={{ margin: '0 auto', maxWidth: '480px', fontSize: '13px', color: 'var(--text-slate)', lineHeight: '1.5' }}>
          Configure your parameters and ZenFit's metabolic engine will craft a structured daily meal plan tailored to your profile.
        </p>
      </div>

      {/* SVG Illustration */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <svg width="220" height="130" viewBox="0 0 220 130" fill="none">
          <defs>
            <linearGradient id="saladGrad" x1="0" y1="0" x2="1" y2="1">
              <stop stopColor="#10B981" />
              <stop offset="1" stopColor="#059669" />
            </linearGradient>
          </defs>
          <path d="M40 70 C40 100, 180 100, 180 70 Z" fill="url(#saladGrad)" opacity="0.8" />
          <line x1="20" y1="70" x2="200" y2="70" stroke="var(--text-white)" strokeWidth="4" strokeLinecap="round" />
          <path d="M60 70 C60 50, 80 50, 80 70 Z" fill="#34D399" />
          <path d="M140 70 C140 45, 160 45, 160 70 Z" fill="#059669" />
          <circle cx="110" cy="55" r="14" fill="#F97316" opacity="0.9" />
          <path d="M90 40 Q 95 30 90 20" stroke="var(--text-slate)" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.5" />
          <path d="M120 40 Q 125 28 120 16" stroke="var(--text-slate)" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.5" />
        </svg>
      </div>

      {/* Benefits checklist */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '16px',
        backgroundColor: 'var(--bg-inner)',
        borderRadius: '16px',
        padding: '20px',
        border: '1px solid var(--border-color)'
      }}>
        {[
          { title: 'Target Calorie Match', desc: 'Aligns energy intake with your goal.' },
          { title: 'Pantry-First Synergy', desc: 'Crafts recipes with available stock.' },
          { title: 'Metabolic Flexibility', desc: 'Swap alternative recipes instantly.' }
        ].map((benefit, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '12px', fontWeight: '800', color: '#10B981', display: 'flex', alignItems: 'center', gap: '6px' }}>
              ✓ {benefit.title}
            </span>
            <span style={{ fontSize: '11px', color: 'var(--text-slate)' }}>{benefit.desc}</span>
          </div>
        ))}
      </div>

      {/* Example locked preview card */}
      <div style={{ position: 'relative', opacity: 0.45 }}>
        <h4 style={{ margin: '0 0 10px 0', fontSize: '11px', fontWeight: '800', color: 'var(--text-slate)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Example Daily Formulation
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[
            { slot: 'Breakfast', name: 'Poached Eggs & Avocado Toast' },
            { slot: 'Lunch', name: 'Quinoa Grilled Chicken Bowl' }
          ].map((m, i) => (
            <div key={i} style={{
              backgroundColor: 'var(--bg-inner)',
              border: '1px solid var(--border-color)',
              borderRadius: '10px',
              padding: '10px 14px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <span style={{ fontSize: '9px', color: '#10B981', fontWeight: '800' }}>{m.slot}</span>
                <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-white)', display: 'block' }}>{m.name}</span>
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-slate)' }}>-- kcal</span>
            </div>
          ))}
        </div>

        {/* Floating animated badge inside example card */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(30, 41, 59, 0.4)',
          backdropFilter: 'blur(2px)',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'inset 0 0 20px rgba(0,0,0,0.2)'
        }}>
          <div style={{
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: '20px',
            padding: '8px 16px',
            fontSize: '11px',
            fontWeight: '800',
            color: 'var(--text-white)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            animation: 'pulse-badge 2s infinite ease-in-out'
          }}>
            AWAITING FORMULATION
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse-badge {
          0%, 100% { transform: scale(1); opacity: 0.9; }
          50% { transform: scale(1.05); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

const MealPlan = () => {
  const { user, theme, addToast } = useAuth();
  
  // Form states
  const [goal, setGoal] = useState('Stay Healthy');
  const [activityLevel, setActivityLevel] = useState('Moderate');
  const [dietPreference, setDietPreference] = useState('Any');
  const [pantryMode, setPantryMode] = useState(false);
  const [selectedPantry, setSelectedPantry] = useState([]);
  
  // Results
  const [activePlan, setActivePlan] = useState(null);
  const [history, setHistory] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  const pantryIngredients = ['Milk', 'Paneer', 'Rice', 'Curd', 'Tomatoes', 'Oats', 'Bananas', 'Eggs'];

  useEffect(() => {
    if (user) {
      setGoal(user.fitnessGoal || 'Stay Healthy');
    }
    fetchHistoryAndFavorites();
  }, [user]);

  const fetchHistoryAndFavorites = async () => {
    try {
      setLoading(true);
      const histRes = await api.get('/meals/history');
      const favRes = await api.get('/meals/favorites');
      setHistory(histRes.data);
      setFavorites(favRes.data);
    } catch (err) {
      console.error('Error fetching meal histories:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePantryToggle = (ing) => {
    setSelectedPantry(prev => 
      prev.includes(ing) ? prev.filter(i => i !== ing) : [...prev, ing]
    );
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    try {
      setGenerating(true);
      const payload = {
        goal,
        activityLevel,
        dietPreference,
        pantryIngredients: pantryMode ? selectedPantry : []
      };

      const res = await api.post('/meals/generate', payload);
      setActivePlan(res.data.mealPlan);
      addToast(`Meal Plan Generated! +${res.data.xpGained} XP Earned`, 'success');
      
      fetchHistoryAndFavorites();
    } catch (err) {
      console.error('Error generating meal plan:', err);
      addToast('Failed to generate meal plan. Try selecting more ingredients in Pantry mode.', 'error');
    } finally {
      setGenerating(false);
    }
  };

  const handleSwapMeal = async (mealTime) => {
    if (!activePlan) return;
    try {
      const res = await api.post('/meals/swap', {
        mealPlanId: activePlan._id,
        mealTime
      });
      setActivePlan(res.data.mealPlan);
      addToast(`Swapped ${mealTime} option!`, 'success');
    } catch (err) {
      console.error('Error swapping meal:', err);
    }
  };

  const handleSaveFavorite = async () => {
    if (!activePlan) return;
    try {
      const res = await api.post('/meals/save', { mealPlanId: activePlan._id });
      setFavorites(res.data.savedMeals);
      addToast(res.data.message, 'success');
    } catch (err) {
      console.error('Error saving favorite plan:', err);
    }
  };

  const getShoppingList = () => {
    if (!activePlan) return [];
    const list = [];
    ['breakfast', 'lunch', 'dinner', 'snacks'].forEach(slot => {
      if (activePlan[slot] && activePlan[slot].ingredients) {
        activePlan[slot].ingredients.forEach(ing => {
          if (!list.includes(ing)) list.push(ing);
        });
      }
    });
    return list;
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  const isFormDisabled = pantryMode && selectedPantry.length === 0;

  return (
    <>
      <Navbar />
      <div style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-white)',
        padding: '30px 20px',
        fontFamily: 'system-ui, sans-serif',
        transition: 'background-color 0.2s, color 0.2s'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          {/* Header */}
          <div style={{ marginBottom: '30px' }} className="no-print">
            <h1 style={{ margin: '0 0 6px 0', fontSize: '32px', fontWeight: '800', color: 'var(--text-white)', letterSpacing: '-0.5px' }}>
              Intelligent Meal Planner
            </h1>
            <p style={{ margin: 0, color: 'var(--text-slate)', fontSize: '15px' }}>
              Custom recipe combinations formulated to your metabolic parameters
            </p>
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: '30px',
            alignItems: 'start'
          }}>
            
            {/* LEFT: Generation Parameters Form & Favorites list (40%) */}
            <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', gap: '24px' }} className="no-print">
              
              {/* Connected Premium Form Card */}
              <form onSubmit={handleGenerate} style={{
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: '24px',
                padding: '28px',
                border: '1px solid var(--border-color)',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.05)'
              }}>
                <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: '800', color: 'var(--text-white)' }}>
                  Meal Preferences
                </h3>

                {/* Goal Selector (Premium Field Container) */}
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '8px',
                  backgroundColor: 'var(--bg-primary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  padding: '14px 16px',
                  transition: 'border-color 0.2s'
                }}>
                  <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-slate)', letterSpacing: '0.5px' }}>FITNESS GOAL</label>
                  <select
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    style={{
                      backgroundColor: 'var(--bg-secondary)',
                      color: 'var(--text-white)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      padding: '10px 12px',
                      outline: 'none',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: '600',
                      transition: 'border-color 0.2s',
                      width: '100%'
                    }}
                  >
                    <option value="Stay Healthy">Stay Healthy</option>
                    <option value="Weight Loss">Weight Loss</option>
                    <option value="Muscle Gain">Muscle Gain</option>
                    <option value="Strength">Strength & Build</option>
                  </select>
                </div>

                {/* Activity Selector (Premium Field Container) */}
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '8px',
                  backgroundColor: 'var(--bg-primary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  padding: '14px 16px',
                  transition: 'border-color 0.2s'
                }}>
                  <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-slate)', letterSpacing: '0.5px' }}>DAILY ACTIVITY LEVEL</label>
                  <select
                    value={activityLevel}
                    onChange={(e) => setActivityLevel(e.target.value)}
                    style={{
                      backgroundColor: 'var(--bg-secondary)',
                      color: 'var(--text-white)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      padding: '10px 12px',
                      outline: 'none',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: '600',
                      transition: 'border-color 0.2s',
                      width: '100%'
                    }}
                  >
                    <option value="Sedentary">Sedentary (Little/no exercise)</option>
                    <option value="Moderate">Moderate (3-5 days/week active)</option>
                    <option value="High">High (Daily intense training)</option>
                  </select>
                </div>

                {/* Diet preference (Premium Field Container) */}
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '8px',
                  backgroundColor: 'var(--bg-primary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  padding: '14px 16px',
                  transition: 'border-color 0.2s'
                }}>
                  <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-slate)', letterSpacing: '0.5px' }}>DIET PREFERENCE</label>
                  <select
                    value={dietPreference}
                    onChange={(e) => setDietPreference(e.target.value)}
                    disabled={pantryMode}
                    style={{
                      backgroundColor: 'var(--bg-secondary)',
                      color: 'var(--text-white)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      padding: '10px 12px',
                      outline: 'none',
                      cursor: pantryMode ? 'not-allowed' : 'pointer',
                      fontSize: '13px',
                      fontWeight: '600',
                      transition: 'border-color 0.2s',
                      width: '100%',
                      opacity: pantryMode ? 0.5 : 1
                    }}
                  >
                    <option value="Any">Balanced (Any)</option>
                    <option value="Vegetarian">Vegetarian</option>
                    <option value="High Protein">High Protein Focus</option>
                  </select>
                </div>

                {/* Pantry Mode Toggle & stock (Premium Field Container) */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  backgroundColor: 'var(--bg-primary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  padding: '16px'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-white)', display: 'block' }}>Pantry Mode</span>
                      <span style={{ fontSize: '11px', color: 'var(--text-slate)' }}>Generate meals using ingredients you have</span>
                    </div>
                    {/* Custom Toggle Switch */}
                    <div 
                      onClick={() => setPantryMode(!pantryMode)}
                      style={{
                        width: '42px',
                        height: '24px',
                        borderRadius: '12px',
                        backgroundColor: pantryMode ? '#10B981' : 'var(--border-color)',
                        padding: '2px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: pantryMode ? 'flex-end' : 'flex-start',
                        transition: 'background-color 0.2s',
                        border: '1px solid var(--border-color)'
                      }}
                    >
                      <motion.div 
                        layout
                        style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          backgroundColor: '#FFFFFF',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                        }}
                      />
                    </div>
                  </div>

                  {pantryMode && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
                      <span style={{ fontSize: '10px', color: 'var(--text-slate)', fontWeight: '800', letterSpacing: '0.5px' }}>AVAILABLE PANTRY STOCK</span>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '8px'
                      }}>
                        {pantryIngredients.map(ing => (
                          <label key={ing} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontSize: '12px',
                            cursor: 'pointer',
                            padding: '8px 10px',
                            backgroundColor: selectedPantry.includes(ing) ? 'rgba(16, 185, 129, 0.08)' : 'transparent',
                            border: selectedPantry.includes(ing) ? '1px solid rgba(16,185,129,0.3)' : '1px solid var(--border-color)',
                            borderRadius: '8px',
                            color: 'var(--text-white)',
                            transition: 'all 0.2s'
                          }}>
                            <input
                              type="checkbox"
                              checked={selectedPantry.includes(ing)}
                              onChange={() => handlePantryToggle(ing)}
                              style={{ accentColor: '#10B981' }}
                            />
                            {ing}
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Premium Action Generate button with loader and disabled state */}
                <motion.button
                  whileHover={!isFormDisabled && !generating ? { scale: 1.02, translateY: -1 } : {}}
                  whileTap={!isFormDisabled && !generating ? { scale: 0.98 } : {}}
                  disabled={isFormDisabled || generating}
                  type="submit"
                  style={{
                    background: isFormDisabled 
                      ? 'rgba(255,255,255,0.05)'
                      : 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                    color: isFormDisabled ? 'var(--text-slate)' : '#FFF',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '14px',
                    fontWeight: '800',
                    fontSize: '14px',
                    cursor: isFormDisabled || generating ? 'not-allowed' : 'pointer',
                    boxShadow: isFormDisabled ? 'none' : '0 4px 15px rgba(16, 185, 129, 0.2)',
                    marginTop: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'all 0.2s',
                    opacity: generating ? 0.85 : 1
                  }}
                >
                  {generating ? (
                    <>
                      <div style={{
                        width: '18px',
                        height: '18px',
                        border: '2px solid rgba(255,255,255,0.3)',
                        borderTopColor: '#FFF',
                        borderRadius: '50%',
                        animation: 'spin-loader 0.8s linear infinite'
                      }} />
                      <span>Formulating recipes...</span>
                    </>
                  ) : (
                    <>
                      <IoSparkles />
                      <span>Generate New Plan</span>
                    </>
                  )}
                </motion.button>
              </form>

              {/* Bookmarked Plans Favorites panel */}
              <div style={{
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: '24px',
                padding: '24px',
                border: '1px solid var(--border-color)',
                boxShadow: '0 8px 20px rgba(0,0,0,0.03)'
              }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '800', color: 'var(--text-white)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <IoLayers style={{ color: '#8B5CF6' }} /> Bookmarked Plans
                </h3>
                {favorites.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {favorites.map((fav, index) => (
                      <div
                        key={index}
                        onClick={() => setActivePlan(fav)}
                        style={{
                          backgroundColor: 'var(--bg-inner)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '12px',
                          padding: '12px',
                          cursor: 'pointer',
                          transition: 'border-color 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.borderColor = '#10B981'}
                        onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
                      >
                        <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-white)', display: 'block' }}>
                          Plan - {fav.totalCalories} Calories
                        </span>
                        <span style={{ fontSize: '11px', color: 'var(--text-slate)' }}>
                          {fav.breakfast?.name} • {fav.lunch?.name}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span style={{ fontSize: '12px', color: 'var(--text-slate)', fontStyle: 'italic' }}>No bookmarks saved.</span>
                )}
              </div>
            </div>

            {/* RIGHT: Active Plan Details OR Premium Empty State (60%) */}
            <div style={{ flex: '1.6 1 600px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {activePlan ? (
                <div className="print-area" style={{
                  backgroundColor: 'var(--bg-secondary)',
                  borderRadius: '24px',
                  padding: '30px',
                  border: '1px solid var(--border-color)',
                  boxShadow: '0 15px 30px rgba(0,0,0,0.08)'
                }}>
                  
                  {/* Active Header controls */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: '1px solid var(--border-color)',
                    paddingBottom: '20px',
                    marginBottom: '24px'
                  }} className="no-print">
                    <div>
                      <span style={{ fontSize: '11px', color: '#10B981', fontWeight: '800', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                        ACTIVE TARGET
                      </span>
                      <h2 style={{ margin: '4px 0 0 0', fontSize: '22px', fontWeight: '800', color: 'var(--text-white)' }}>
                        Daily Intake: {activePlan.totalCalories} kcal
                      </h2>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={handleSaveFavorite}
                        style={{
                          backgroundColor: 'rgba(255,255,255,0.02)',
                          border: '1px solid var(--border-color)',
                          color: 'var(--text-white)',
                          padding: '10px 16px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontSize: '13px',
                          fontWeight: '600'
                        }}
                      >
                        <IoHeart style={{ color: '#EF4444' }} /> Bookmark
                      </button>
                      <button
                        onClick={handleDownloadPDF}
                        style={{
                          backgroundColor: 'var(--bg-primary)',
                          border: '1px solid var(--border-color)',
                          color: 'var(--text-white)',
                          padding: '10px 16px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontSize: '13px',
                          fontWeight: '600'
                        }}
                      >
                        <IoPrint /> Print Page
                      </button>
                    </div>
                  </div>

                  <div className="print-only" style={{ display: 'none', borderBottom: '2px solid #000', paddingBottom: '14px', marginBottom: '20px' }}>
                    <h2 style={{ margin: 0 }}>ZenFit Daily Meal Prescription</h2>
                    <span style={{ fontSize: '13px' }}>Formula target: {activePlan.totalCalories} kcal • Created for: {user.name}</span>
                  </div>

                  {/* Meal Slots List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {[
                      { key: 'breakfast', label: 'Breakfast Slot' },
                      { key: 'lunch', label: 'Lunch Slot' },
                      { key: 'dinner', label: 'Dinner Slot' },
                      { key: 'snacks', label: 'Snacks Slot' }
                    ].map(slot => {
                      const meal = activePlan[slot.key];
                      if (!meal) return null;
                      return (
                        <div key={slot.key} style={{
                          backgroundColor: 'var(--bg-inner)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '16px',
                          padding: '20px',
                          position: 'relative'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                            <div>
                              <span style={{ fontSize: '10px', color: '#10B981', fontWeight: '800', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                                {slot.label}
                              </span>
                              <h3 style={{ margin: '4px 0 0 0', fontSize: '18px', fontWeight: '700', color: 'var(--text-white)' }}>
                                {meal.name}
                              </h3>
                            </div>

                            <button
                              onClick={() => handleSwapMeal(slot.key)}
                              className="no-print"
                              style={{
                                backgroundColor: 'rgba(255,255,255,0.02)',
                                border: '1px solid var(--border-color)',
                                color: 'var(--text-slate)',
                                borderRadius: '6px',
                                padding: '6px 10px',
                                fontSize: '11px',
                                fontWeight: '700',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                            >
                              <IoSwapHorizontal /> Alternate
                            </button>
                          </div>

                          <p style={{ margin: '0 0 14px 0', fontSize: '13px', color: 'var(--text-slate)', lineHeight: '1.4' }}>
                            {meal.instructions || 'Recipe guide formulating ingredients to nutritional goals.'}
                          </p>

                          <div style={{ display: 'flex', gap: '14px', fontSize: '12px', borderTop: '1px solid var(--border-color)', paddingTop: '10px', flexWrap: 'wrap' }}>
                            <span style={{ color: 'var(--text-slate)' }}>Cal: <strong style={{ color: '#EF4444' }}>{meal.calories} kcal</strong></span>
                            <span style={{ color: 'var(--text-slate)' }}>Carbs: <strong style={{ color: '#F97316' }}>{meal.carbs}g</strong></span>
                            <span style={{ color: 'var(--text-slate)' }}>Protein: <strong style={{ color: '#10B981' }}>{meal.protein}g</strong></span>
                            <span style={{ color: 'var(--text-slate)' }}>Fat: <strong style={{ color: '#0EA5E9' }}>{meal.fat}g</strong></span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Shopping List checklist */}
                  <div style={{
                    marginTop: '30px',
                    backgroundColor: 'var(--bg-inner)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '16px',
                    padding: '20px'
                  }}>
                    <h3 style={{ margin: '0 0 12px 0', fontSize: '15px', fontWeight: '700', color: 'var(--text-white)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <IoCart style={{ color: '#10B981' }} /> Shopping Grocery Checklist
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '10px' }}>
                      {getShoppingList().map((ing, i) => (
                        <label key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-white)', cursor: 'pointer' }}>
                          <input type="checkbox" style={{ accentColor: '#10B981' }} />
                          {ing}
                        </label>
                      ))}
                    </div>
                  </div>

                </div>
              ) : (
                <PremiumEmptyState 
                  user={user} 
                  pantryMode={pantryMode} 
                  selectedPantry={selectedPantry}
                />
              )}
            </div>

          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes spin-loader {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
};

export default MealPlan;
