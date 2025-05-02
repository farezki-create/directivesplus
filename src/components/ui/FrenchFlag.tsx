
import { useEffect, useState } from "react";

export function FrenchFlag() {
  const [waving, setWaving] = useState(false);
  
  useEffect(() => {
    // Animation initiale
    setTimeout(() => {
      setWaving(true);
    }, 500);
    
    // Animation périodique
    const interval = setInterval(() => {
      setWaving(true);
      setTimeout(() => {
        setWaving(false);
      }, 1000);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      className={`w-6 h-4 relative overflow-hidden shadow-sm transform transition-transform duration-700 ${waving ? 'animate-wave' : ''}`}
      style={{ 
        transformOrigin: 'center left',
        animation: waving ? 'wave 1s ease-in-out' : 'none'
      }}
    >
      <style jsx global>{`
        @keyframes wave {
          0% { transform: rotate(0deg); }
          25% { transform: rotate(5deg); }
          50% { transform: rotate(0deg); }
          75% { transform: rotate(-5deg); }
          100% { transform: rotate(0deg); }
        }
      `}</style>
      <div className="absolute inset-y-0 left-0 w-1/3 bg-blue-700"></div>
      <div className="absolute inset-y-0 left-1/3 w-1/3 bg-white"></div>
      <div className="absolute inset-y-0 right-0 w-1/3 bg-red-600"></div>
    </div>
  );
}
