import React, { useState, useEffect, useRef } from 'react';
import { IoPlay, IoPause, IoRefresh, IoAdd, IoRemove } from 'react-icons/io5';

const Timer = () => {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [counter, setCounter] = useState(0);
  
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else if (!isActive && intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isActive]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setSeconds(0);
  };

  const formatTime = () => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      padding: '20px',
      borderRadius: '16px',
      backgroundColor: '#1E293B',
      border: '1px solid rgba(249, 115, 22, 0.2)',
      boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
      alignItems: 'center',
      maxWidth: '300px',
      width: '100%',
      margin: '0 auto'
    }}>
      <h4 style={{ margin: 0, color: '#F97316', fontSize: '14px', letterSpacing: '1px', textTransform: 'uppercase' }}>
        Workout Tracker
      </h4>

      {/* Stopwatch display */}
      <div style={{
        fontSize: '42px',
        fontWeight: 'bold',
        color: '#FFFFFF',
        fontFamily: 'monospace',
        letterSpacing: '2px',
        textShadow: '0 0 10px rgba(255, 255, 255, 0.2)'
      }}>
        {formatTime()}
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          onClick={toggleTimer}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: isActive ? '#EF4444' : '#10B981',
            color: '#FFF',
            border: 'none',
            cursor: 'pointer',
            transition: 'transform 0.2s',
          }}
          onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
        >
          {isActive ? <IoPause /> : <IoPlay />}
        </button>
        <button
          onClick={resetTimer}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: '#475569',
            color: '#FFF',
            border: 'none',
            cursor: 'pointer',
            transition: 'transform 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
        >
          <IoRefresh />
        </button>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.08)', width: '100%', margin: '4px 0' }} />

      {/* Exercise Counter widget */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', width: '100%' }}>
        <span style={{ fontSize: '12px', color: '#94A3B8', fontWeight: '500' }}>REPETITIONS / SETS</span>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <button
            onClick={() => setCounter((prev) => Math.max(0, prev - 1))}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: '#334155',
              color: '#FFF',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <IoRemove />
          </button>
          
          <span style={{ fontSize: '28px', fontWeight: 'bold', color: '#10B981', minWidth: '40px', textAlign: 'center' }}>
            {counter}
          </span>

          <button
            onClick={() => setCounter((prev) => prev + 1)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: '#F97316',
              color: '#FFF',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <IoAdd />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Timer;
