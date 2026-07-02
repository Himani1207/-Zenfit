import React from 'react';
import { motion } from 'framer-motion';

const Skeleton = ({ width = '100%', height = '20px', borderRadius = '8px', className = '' }) => {
  return (
    <div
      className={className}
      style={{
        width,
        height,
        borderRadius,
        backgroundColor: '#334155', // Slate-700
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <motion.div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)',
        }}
        animate={{
          x: ['-100%', '100%']
        }}
        transition={{
          repeat: Infinity,
          duration: 1.2,
          ease: 'linear'
        }}
      />
    </div>
  );
};

export default Skeleton;
