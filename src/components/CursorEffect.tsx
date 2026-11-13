import React, { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
}

export const CursorEffect: React.FC = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let particleId = 0;
    const colors = ['#E6C66F', '#C9A44C', '#08734B', '#10B981', '#F9DF88'];

    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      setIsVisible(true);

      // Spawn magical sparkles occasionally
      if (Math.random() > 0.45) {
        const newParticle: Particle = {
          id: particleId++,
          x: e.clientX + (Math.random() * 14 - 7),
          y: e.clientY + (Math.random() * 14 - 7),
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 4 + 2
        };

        setParticles(prev => [...prev.slice(-18), newParticle]);
      }
    };

    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    const interval = setInterval(() => {
      setParticles(prev => prev.slice(1));
    }, 90);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      clearInterval(interval);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden hidden md:block">
      {/* Wand Tip Glow */}
      <div
        className="absolute w-4 h-4 -translate-x-1/2 -translate-y-1/2 rounded-full transition-transform duration-75 ease-out"
        style={{
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          background: 'radial-gradient(circle, #F9DF88 20%, #08734B 80%, transparent 100%)',
          boxShadow: '0 0 14px #E6C66F, 0 0 25px #08734B',
          opacity: 0.85
        }}
      />

      {/* Trailing Magic Sparkles */}
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute rounded-full pointer-events-none animate-ping"
          style={{
            left: `${p.x}px`,
            top: `${p.y}px`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            boxShadow: `0 0 8px ${p.color}`,
            opacity: 0.75,
            animationDuration: '0.8s'
          }}
        />
      ))}
    </div>
  );
};
