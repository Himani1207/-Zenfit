import React, { useState, useEffect } from 'react';
import { api } from '../context/AuthContext';
import { IoCheckmarkCircle, IoTrendingUp, IoCalendar, IoRibbon, IoInformationCircle } from 'react-icons/io5';

const ActivityTimeline = () => {
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        const res = await api.get('/users/timeline');
        setTimeline(res.data.timeline);
      } catch (err) {
        console.error('Error fetching activity timeline:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTimeline();
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case 'workout':
        return <IoCheckmarkCircle style={{ color: '#10B981', fontSize: '18px' }} />;
      case 'meal':
        return <IoCheckmarkCircle style={{ color: '#F97316', fontSize: '18px' }} />;
      case 'water':
        return <IoCheckmarkCircle style={{ color: '#3B82F6', fontSize: '18px' }} />;
      case 'weight':
        return <IoTrendingUp style={{ color: '#F59E0B', fontSize: '18px' }} />;
      case 'booking':
        return <IoCalendar style={{ color: '#8B5CF6', fontSize: '18px' }} />;
      case 'badge':
        return <IoRibbon style={{ color: '#EF4444', fontSize: '18px' }} />;
      default:
        return <IoInformationCircle style={{ color: '#94A3B8', fontSize: '18px' }} />;
    }
  };

  if (loading) {
    return (
      <div style={{ color: '#94A3B8', fontSize: '14px', textAlign: 'center', padding: '20px' }}>
        Loading timeline history...
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative' }}>
      {timeline.map((activity, index) => (
        <div key={index} style={{
          display: 'flex',
          gap: '12px',
          alignItems: 'flex-start',
          position: 'relative'
        }}>
          {/* Connector line between steps */}
          {index !== timeline.length - 1 && (
            <div style={{
              position: 'absolute',
              top: '20px',
              left: '10px',
              bottom: '-20px',
              width: '2px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)'
            }} />
          )}

          {/* Icon Bubble */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '22px',
            height: '22px',
            borderRadius: '50%',
            backgroundColor: '#1E293B',
            zIndex: 1
          }}>
            {getIcon(activity.type)}
          </div>

          {/* Text Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span style={{ fontSize: '13px', fontWeight: '600', color: '#FFFFFF' }}>
              {activity.text}
            </span>
            <span style={{ fontSize: '11px', color: '#64748B' }}>
              {activity.time}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActivityTimeline;
