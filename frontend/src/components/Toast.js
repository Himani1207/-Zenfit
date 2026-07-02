import React from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { IoCheckmarkCircle, IoInformationCircle, IoClose, IoAlertCircle } from 'react-icons/io5';

const ToastContainer = () => {
  const { toasts, removeToast } = useAuth();

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      maxWidth: '380px',
      width: '100%'
    }}>
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 18px',
              borderRadius: '12px',
              backgroundColor: '#1E293B',
              borderLeft: toast.type === 'success' ? '4px solid #10B981' : 
                          toast.type === 'error' ? '4px solid #EF4444' : '4px solid #F97316',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.5)',
              color: '#FFFFFF',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontSize: '14px',
              fontWeight: '500',
              backdropFilter: 'blur(10px)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div>
                {toast.type === 'success' && <IoCheckmarkCircle style={{ color: '#10B981', fontSize: '20px' }} />}
                {toast.type === 'error' && <IoAlertCircle style={{ color: '#EF4444', fontSize: '20px' }} />}
                {toast.type === 'info' && <IoInformationCircle style={{ color: '#F97316', fontSize: '20px' }} />}
              </div>
              <div>{toast.message}</div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              style={{
                background: 'none',
                border: 'none',
                color: '#94A3B8',
                cursor: 'pointer',
                fontSize: '18px',
                display: 'flex',
                alignItems: 'center',
                padding: '2px',
                marginLeft: '12px',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.color = '#FFF'}
              onMouseLeave={(e) => e.target.style.color = '#94A3B8'}
            >
              <IoClose />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;
