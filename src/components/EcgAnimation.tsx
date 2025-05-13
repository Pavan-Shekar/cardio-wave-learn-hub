
import React from 'react';

export const EcgAnimation: React.FC = () => {
  return (
    <div className="w-full h-16 bg-gray-100 rounded-md overflow-hidden relative">
      <svg
        className="w-full h-full animate-ecg-wave"
        viewBox="0 0 1200 100"
        preserveAspectRatio="none"
        style={{ width: '200%', position: 'absolute', left: '0' }}
      >
        <path
          d="M0,50 L30,50 L45,20 L60,80 L75,20 L90,80 L105,50 L120,50 L200,50 L220,50 L230,20 L240,80 L250,50 L300,50 L400,50 L410,50 L420,20 L430,80 L440,50 L600,50 L800,50 L820,50 L830,20 L840,80 L850,50 L900,50 L1000,50 L1010,50 L1020,20 L1030,80 L1040,50 L1200,50"
          fill="none"
          stroke="#0ea5e9"
          strokeWidth="2"
        />
      </svg>
      <svg
        className="w-full h-full animate-ecg-wave"
        viewBox="0 0 1200 100"
        preserveAspectRatio="none"
        style={{ width: '200%', position: 'absolute', left: '100%' }}
      >
        <path
          d="M0,50 L30,50 L45,20 L60,80 L75,20 L90,80 L105,50 L120,50 L200,50 L220,50 L230,20 L240,80 L250,50 L300,50 L400,50 L410,50 L420,20 L430,80 L440,50 L600,50 L800,50 L820,50 L830,20 L840,80 L850,50 L900,50 L1000,50 L1010,50 L1020,20 L1030,80 L1040,50 L1200,50"
          fill="none"
          stroke="#0ea5e9"
          strokeWidth="2"
        />
      </svg>
      <div className="absolute inset-0 border-b border-ecg-primary/20"></div>
    </div>
  );
};
