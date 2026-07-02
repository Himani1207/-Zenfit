import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  IoChevronBack, 
  IoChevronForward, 
  IoClose, 
  IoCheckmarkCircle, 
  IoCloseCircle, 
  IoFlame, 
  IoRibbon,
  IoFitness,
  IoRestaurant,
  IoTimeOutline,
  IoSparkles,
  IoWaterOutline
} from 'react-icons/io5';

const ActivityCalendar = ({ activities = [], mock = false }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDayDetail, setSelectedDayDetail] = useState(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Helper to format date object to YYYY-MM-DD
  const formatDateString = (y, m, d) => {
    const mm = String(m + 1).padStart(2, '0');
    const dd = String(d).padStart(2, '0');
    return `${y}-${mm}-${dd}`;
  };

  // Generate Mock Data if mock mode is true (simplifying to new binary completed/not completed logic)
  const mockActivities = useMemo(() => {
    if (!mock) return null;
    
    const mockMap = {};
    const today = new Date();
    
    for (let i = 0; i < 60; i++) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const yStr = d.getFullYear();
      const mStr = String(d.getMonth() + 1).padStart(2, '0');
      const dStr = String(d.getDate()).padStart(2, '0');
      const dateKey = `${yStr}-${mStr}-${dStr}`;

      // 40% chance of completed mission
      const completed = Math.random() < 0.4;
      if (completed) {
        mockMap[dateKey] = {
          date: dateKey,
          workoutCompleted: true,
          mealCompleted: true,
          programCompleted: true,
          completed: true,
          xpEarned: 120,
          streakOnDay: Math.floor(Math.random() * 8) + 1,
          completionTime: new Date(d.setHours(10 + Math.floor(Math.random() * 8), Math.floor(Math.random() * 60), 0))
        };
      } else {
        // partial logs
        const rand = Math.random();
        mockMap[dateKey] = {
          date: dateKey,
          workoutCompleted: rand < 0.5,
          mealCompleted: rand > 0.4 && rand < 0.8,
          programCompleted: rand > 0.6,
          completed: false,
          xpEarned: rand < 0.5 ? 40 : 0,
          streakOnDay: 0,
          completionTime: null
        };
      }
    }
    return mockMap;
  }, [mock]);

  // Lookup map by YYYY-MM-DD string
  const activityMap = useMemo(() => {
    if (mock) return mockActivities;
    
    const map = {};
    activities.forEach(act => {
      map[act.date] = act;
    });
    return map;
  }, [activities, mock, mockActivities]);

  // Today string at midnight
  const todayStr = useMemo(() => {
    const t = new Date();
    return formatDateString(t.getFullYear(), t.getMonth(), t.getDate());
  }, []);

  const todayDateMidnight = useMemo(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return t;
  }, []);

  // Day cells
  const calendarCells = useMemo(() => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayIndex = new Date(year, month, 1).getDay();

    const cells = [];
    
    // Pad previous month days
    for (let i = 0; i < firstDayIndex; i++) {
      cells.push({ isPlaceholder: true, key: `pad-${i}` });
    }

    // Add days of month
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = formatDateString(year, month, d);
      const activity = activityMap[dateStr] || null;
      
      const cellDate = new Date(year, month, d);
      cellDate.setHours(0, 0, 0, 0);
      const isFuture = cellDate > todayDateMidnight;
      const isToday = dateStr === todayStr;

      const isCompleted = activity ? (activity.missionCompleted || activity.completed) : false;

      cells.push({
        isPlaceholder: false,
        dayNum: d,
        dateString: dateStr,
        activity,
        isCompleted,
        isFuture,
        isToday,
        key: `day-${d}`
      });
    }

    return cells;
  }, [year, month, activityMap, todayStr, todayDateMidnight]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.02)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      border: '1px solid var(--border-color)',
      borderRadius: '24px',
      padding: '24px',
      boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.15)',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      color: 'var(--text-white)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* GLOW DECORATIVE BACKGROUND */}
      <div style={{
        position: 'absolute',
        width: '120px',
        height: '120px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)',
        top: '-20px',
        right: '-20px',
        filter: 'blur(15px)',
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      {/* HEADER */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        position: 'relative',
        zIndex: 1
      }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800' }}>
            {monthNames[month]} {year}
          </h3>
          <span style={{ fontSize: '11px', color: 'var(--text-slate)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {mock ? '🔥 Consistency Preview Mode' : 'Daily Mission consistency'}
          </span>
        </div>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            onClick={handlePrevMonth}
            style={{
              backgroundColor: 'var(--bg-inner)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              width: '32px',
              height: '32px',
              color: 'var(--text-white)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px'
            }}
          >
            <IoChevronBack />
          </button>
          <button 
            onClick={handleNextMonth}
            style={{
              backgroundColor: 'var(--bg-inner)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              width: '32px',
              height: '32px',
              color: 'var(--text-white)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px'
            }}
          >
            <IoChevronForward />
          </button>
        </div>
      </div>

      {/* WEEKDAYS HEADER */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: '6px',
        textAlign: 'center',
        marginBottom: '10px',
        position: 'relative',
        zIndex: 1
      }}>
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day, idx) => (
          <span key={idx} style={{
            fontSize: '11px',
            color: 'var(--text-slate)',
            fontWeight: '800',
            textTransform: 'uppercase'
          }}>
            {day}
          </span>
        ))}
      </div>

      {/* DAYS GRID */}
      <motion.div 
        key={`${year}-${month}`}
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.008
            }
          }
        }}
        initial="hidden"
        animate="visible"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '6px',
          position: 'relative',
          zIndex: 1
        }}
      >
        {calendarCells.map((cell) => {
          if (cell.isPlaceholder) {
            return (
              <div 
                key={cell.key} 
                style={{ 
                  aspectRatio: '1/1',
                  borderRadius: '6px',
                  backgroundColor: 'transparent'
                }} 
              />
            );
          }

          const isInteractable = !cell.isFuture;

          return (
            <motion.div
              key={cell.key}
              variants={{
                hidden: { scale: 0.8, opacity: 0 },
                visible: { scale: 1, opacity: 1 }
              }}
              whileHover={isInteractable ? { 
                scale: 1.18, 
                zIndex: 10,
                boxShadow: cell.isCompleted ? `0 0 12px rgba(16, 185, 129, 0.4)` : `0 0 8px rgba(255,255,255,0.08)`
              } : {}}
              onClick={() => {
                if (isInteractable && cell.activity) {
                  setSelectedDayDetail(cell);
                }
              }}
              animate={{
                backgroundColor: cell.isCompleted ? '#10B981' : 'var(--bg-inner)',
                opacity: cell.isFuture ? 0.25 : 1
              }}
              transition={{ duration: 0.5 }}
              style={{
                aspectRatio: '1/1',
                borderRadius: '6px',
                border: cell.isToday 
                  ? '2px solid var(--accent-orange)' 
                  : (cell.isCompleted ? '2px solid #059669' : `1px solid var(--border-color)`),
                boxShadow: cell.isToday 
                  ? '0 0 10px rgba(249, 115, 22, 0.5)' 
                  : (cell.isCompleted ? '0 0 8px rgba(16, 185, 129, 0.4)' : 'none'),
                cursor: isInteractable && cell.activity ? 'pointer' : 'default',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: '700',
                color: cell.isCompleted ? '#FFFFFF' : 'var(--text-slate)',
                position: 'relative'
              }}
            >
              {cell.dayNum}
            </motion.div>
          );
        })}
      </motion.div>

      {/* COLOR LEGEND */}
      <div style={{
        marginTop: '20px',
        display: 'flex',
        gap: '16px',
        justifyContent: 'center',
        fontSize: '11px',
        color: 'var(--text-slate)',
        borderTop: '1px solid var(--border-color)',
        paddingTop: '16px',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#10B981' }} />
          <span>Mission Completed</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: 'var(--bg-inner)', border: '1px solid var(--border-color)' }} />
          <span>Mission Incomplete</span>
        </div>
      </div>

      {/* POPUP DETAIL MODAL */}
      <AnimatePresence>
        {selectedDayDetail && (
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.65)',
              backdropFilter: 'blur(5px)',
              WebkitBackdropFilter: 'blur(5px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
              padding: '20px'
            }}
            onClick={() => setSelectedDayDetail(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: '20px',
                padding: '24px',
                width: '100%',
                maxWidth: '360px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
                color: 'var(--text-white)',
                position: 'relative'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedDayDetail(null)}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: 'var(--text-slate)',
                  fontSize: '22px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 0
                }}
              >
                <IoClose />
              </button>

              {/* Title Date */}
              <h4 style={{ 
                margin: '0 0 16px 0', 
                fontSize: '18px', 
                fontWeight: '800', 
                borderBottom: '1px solid var(--border-color)', 
                paddingBottom: '12px' 
              }}>
                {new Date(selectedDayDetail.dateString).toLocaleDateString(undefined, { 
                  weekday: 'short', 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </h4>

              {/* Task Completions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                {[
                  { label: 'Workout Completed', completed: selectedDayDetail.activity.workoutCompleted, color: '#10B981', icon: <IoFitness /> },
                  { label: 'Healthy Meals Tracked', completed: selectedDayDetail.activity.mealCompleted, color: '#F97316', icon: <IoRestaurant /> },
                  { label: 'Water Goal Completed', completed: selectedDayDetail.activity.waterCompleted, color: '#0EA5E9', icon: <IoWaterOutline /> },
                  { label: 'Stretching Completed', completed: selectedDayDetail.activity.stretchCompleted, color: '#8B5CF6', icon: <IoSparkles /> },
                  { label: 'Sleep Goal Achieved', completed: selectedDayDetail.activity.sleepCompleted, color: '#3B82F6', icon: <IoTimeOutline /> }
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-slate)', fontWeight: '600' }}>
                      <span style={{ color: item.color, display: 'flex' }}>{item.icon}</span> {item.label}
                    </span>
                    {item.completed ? (
                      <IoCheckmarkCircle style={{ color: '#10B981', fontSize: '18px' }} />
                    ) : (
                      <IoCloseCircle style={{ color: '#EF4444', fontSize: '18px', opacity: 0.3 }} />
                    )}
                  </div>
                ))}
              </div>

              {/* Mission Completed Status */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-color)',
                borderRadius: '10px',
                padding: '10px 14px',
                marginBottom: '16px',
                fontSize: '13px'
              }}>
                <span style={{ color: 'var(--text-slate)', fontWeight: '600' }}>Mission Completed</span>
                <span style={{
                  color: selectedDayDetail.activity.missionCompleted ? '#10B981' : '#F97316',
                  fontWeight: '800',
                  textTransform: 'uppercase'
                }}>
                  {selectedDayDetail.activity.missionCompleted ? 'YES' : 'NO'}
                </span>
              </div>

              {/* Metrics Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                backgroundColor: 'var(--bg-primary)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '12px',
                marginBottom: '16px'
              }}>
                <div style={{ textAlign: 'center', borderRight: '1px solid var(--border-color)' }}>
                  <span style={{ display: 'block', fontSize: '10px', color: 'var(--text-slate)', fontWeight: '700', textTransform: 'uppercase' }}>
                    XP EARNED
                  </span>
                  <span style={{ fontSize: '14px', fontWeight: '800', color: '#F97316', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginTop: '4px' }}>
                    <IoRibbon /> +{selectedDayDetail.activity.xpEarned || 0} XP
                  </span>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <span style={{ display: 'block', fontSize: '10px', color: 'var(--text-slate)', fontWeight: '700', textTransform: 'uppercase' }}>
                    STREAK ON DAY
                  </span>
                  <span style={{ fontSize: '14px', fontWeight: '800', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginTop: '4px' }}>
                    <IoFlame /> {selectedDayDetail.activity.streakOnDay || 0} Days
                  </span>
                </div>
              </div>

              {/* Completion Time */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                fontSize: '12px',
                color: 'var(--text-slate)',
                backgroundColor: 'var(--bg-primary)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '8px 12px'
              }}>
                <IoTimeOutline style={{ fontSize: '15px' }} />
                <span>Completion Time: </span>
                <strong style={{ color: 'var(--text-white)' }}>
                  {selectedDayDetail.activity.completionTime 
                    ? new Date(selectedDayDetail.activity.completionTime).toLocaleTimeString(undefined, {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                      }) 
                    : 'N/A'}
                </strong>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ActivityCalendar;
