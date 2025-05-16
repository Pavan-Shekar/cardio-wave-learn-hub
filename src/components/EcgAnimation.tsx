
import React from 'react';
import { Heart } from 'lucide-react';

export const EcgAnimation: React.FC = () => {
  return (
    <div className="w-full h-16 bg-gradient-to-r from-sky-50 to-white rounded-md overflow-hidden relative">
      {/* Background Pulse Effect */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-32 h-32 rounded-full bg-sky-100/50 animate-pulse"></div>
      </div>
      
      {/* Realistic ECG Line Animation */}
      <svg
        className="w-full h-full"
        viewBox="0 0 1000 100"
        preserveAspectRatio="none"
        style={{ width: '200%', position: 'absolute', left: '0' }}
      >
        <path
          className="animate-ecg-wave"
          d="M0,50 L100,50 L110,50 L120,20 L130,80 L140,20 L150,80 L160,50 L170,50 L180,50 L190,50 L200,50 L210,50 L220,50 L230,50 L240,50 L250,50 L260,50 L270,50 L280,50 L290,50 L300,50 L310,50 L320,50 L330,50 L340,50 L350,50 L360,50 L370,50 L380,50 L390,50 L400,50 L410,50 L420,20 L430,80 L440,20 L450,80 L460,50 L470,50 L480,50 L490,50 L500,50 L510,50 L520,50 L530,50 L540,50 L550,50 L560,50 L570,50 L580,50 L590,50 L600,50 L610,50 L620,50 L630,50 L640,50 L650,50 L660,50 L670,50 L680,50 L690,50 L700,50 L710,50 L720,20 L730,80 L740,20 L750,80 L760,50 L770,50 L780,50 L790,50 L800,50 L810,50 L820,50 L830,50 L840,50 L850,50 L860,50 L870,50 L880,50 L890,50 L900,50 L910,50 L920,50 L930,50 L940,50 L950,50 L960,50 L970,50 L980,50 L990,50 L1000,50"
          fill="none"
          stroke="#0ea5e9"
          strokeWidth="2"
        />
      </svg>
      
      {/* Heartbeat Icon Effect */}
      <div className="absolute bottom-2 right-2 opacity-50">
        <Heart className="text-red-500 w-5 h-5 animate-pulse" />
      </div>
      
      {/* Grid Lines */}
      <div className="absolute inset-0">
        {Array.from({ length: 10 }).map((_, i) => (
          <div 
            key={`v-${i}`}
            className="absolute h-full w-px bg-sky-100" 
            style={{ left: `${i * 10}%` }}
          />
        ))}
        {Array.from({ length: 5 }).map((_, i) => (
          <div 
            key={`h-${i}`}
            className="absolute w-full h-px bg-sky-100" 
            style={{ top: `${i * 25}%` }}
          />
        ))}
      </div>
      
      <div className="absolute inset-0 border-b border-sky-200/20"></div>
    </div>
  );
};
