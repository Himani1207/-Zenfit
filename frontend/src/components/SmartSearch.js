import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoSearch, IoClose, IoFlash, IoFitness, IoRestaurant, IoPeople } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { api } from '../context/AuthContext';


const SmartSearch = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ workouts: [], meals: [] });
  const [searching, setSearching] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery('');
      setResults({ workouts: [], meals: [] });
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults({ workouts: [], meals: [] });
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setSearching(true);
      try {
        // Query exercises (workouts)
        const workoutRes = await api.get(`/workouts?search=${query}`);
        
        // Query local recipes from MealGeneratorService
        const staticRecipes = [
          { name: 'Oats and Eggs', description: 'Oats and scrambled eggs' },
          { name: 'Grilled Chicken Salad', description: 'Lean protein and greens' },
          { name: 'Baked Salmon with Veggies', description: 'Salmon with steamed broccoli' },
          { name: 'Apple and Peanut Butter', description: 'Quick fruit protein snack' },
          { name: 'Banana Oatmeal Shake', description: 'Creamy high-carb shaker' },
          { name: 'Paneer Rice Stir-Fry', description: 'Sautéed cottage cheese block' },
          { name: 'Classic Curd Rice', description: 'Yogurt rice bowl' }
        ];
        
        const matchedMeals = staticRecipes.filter(m => 
          m.name.toLowerCase().includes(query.toLowerCase()) || 
          m.description.toLowerCase().includes(query.toLowerCase())
        );

        setResults({
          workouts: workoutRes.data.slice(0, 3),
          meals: matchedMeals.slice(0, 3)
        });
      } catch (err) {
        console.error('Smart search error:', err);
      } finally {
        setSearching(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const handleItemClick = (path) => {
    onClose();
    navigate(path);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            zIndex: 99999,
            backdropFilter: 'blur(8px)',
            display: 'flex',
            justifyContent: 'center',
            paddingTop: '80px',
            fontFamily: 'system-ui, sans-serif'
          }}
        >
          <motion.div
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -30, opacity: 0 }}
            style={{
              width: '90%',
              maxWidth: '650px',
              height: 'fit-content',
              maxHeight: '80vh',
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: '#1E293B',
              borderRadius: '16px',
              border: '1px solid rgba(249, 115, 22, 0.3)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
              overflow: 'hidden'
            }}
          >
            {/* Search Input Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              padding: '18px 24px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
              <IoSearch style={{ color: '#F97316', fontSize: '24px', marginRight: '16px' }} />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search exercises or recipes..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{
                  flex: 1,
                  background: 'none',
                  border: 'none',
                  outline: 'none',
                  color: '#FFFFFF',
                  fontSize: '18px',
                  fontWeight: '500'
                }}
              />
              <button
                onClick={onClose}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94A3B8',
                  cursor: 'pointer',
                  fontSize: '24px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <IoClose />
              </button>
            </div>

            {/* Results body */}
            <div style={{ overflowY: 'auto', padding: '16px 24px', maxHeight: '55vh' }}>
              {!query.trim() ? (
                <div style={{ textAlign: 'center', color: '#64748B', padding: '40px 0' }}>
                  <IoFlash style={{ fontSize: '32px', color: '#F97316', marginBottom: '8px' }} />
                  <p style={{ margin: 0, fontSize: '14px' }}>Type to search instantly across ZenFit resources.</p>
                </div>
              ) : searching ? (
                <div style={{ textAlign: 'center', color: '#94A3B8', padding: '40px 0', fontSize: '14px' }}>
                  Searching database...
                </div>
              ) : (results.workouts.length === 0 && results.meals.length === 0) ? (
                <div style={{ textAlign: 'center', color: '#64748B', padding: '40px 0', fontSize: '14px' }}>
                  No matches found for "{query}"
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* Exercises category */}
                  {results.workouts.length > 0 && (
                    <div>
                      <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10B981', margin: '0 0 10px 0', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        <IoFitness /> Exercises ({results.workouts.length})
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {results.workouts.map(w => (
                          <div
                            key={w._id}
                            onClick={() => handleItemClick('/workout')}
                            style={{
                              padding: '10px 14px',
                              borderRadius: '8px',
                              backgroundColor: 'rgba(255,255,255,0.03)',
                              cursor: 'pointer',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              transition: 'background-color 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)'}
                          >
                            <span style={{ color: '#FFF', fontSize: '14px', fontWeight: '500' }}>{w.title}</span>
                            <span style={{ color: '#64748B', fontSize: '12px' }}>{w.difficulty} • {w.duration}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Meals category */}
                  {results.meals.length > 0 && (
                    <div>
                      <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#F97316', margin: '0 0 10px 0', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        <IoRestaurant /> Recipes ({results.meals.length})
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {results.meals.map((m, idx) => (
                          <div
                            key={idx}
                            onClick={() => handleItemClick('/mealplan')}
                            style={{
                              padding: '10px 14px',
                              borderRadius: '8px',
                              backgroundColor: 'rgba(255,255,255,0.03)',
                              cursor: 'pointer',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              transition: 'background-color 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)'}
                          >
                            <span style={{ color: '#FFF', fontSize: '14px', fontWeight: '500' }}>{m.name}</span>
                            <span style={{ color: '#64748B', fontSize: '12px' }}>{m.description}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SmartSearch;
