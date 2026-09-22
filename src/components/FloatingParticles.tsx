import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';

interface Particle {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
  type: 'heart' | 'sparkle' | 'dot';
  opacity: number;
}

export const FloatingParticles: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (shouldReduceMotion) return;

    // Generate gentle subtle floating particles
    const generated: Particle[] = Array.from({ length: 14 }).map((_, i) => ({
      id: i,
      x: Math.random() * 96 + 2, // 2% to 98%
      size: Math.random() * 10 + 8, // 8px to 18px
      duration: Math.random() * 8 + 12, // 12s to 20s
      delay: Math.random() * 8,
      type: i % 4 === 0 ? 'heart' : i % 4 === 1 ? 'sparkle' : 'dot',
      opacity: Math.random() * 0.35 + 0.15
    }));
    setParticles(generated);
  }, [shouldReduceMotion]);

  if (shouldReduceMotion || particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-20 overflow-hidden" aria-hidden="true">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: '105vh', opacity: 0, x: `${p.x}vw` }}
          animate={{
            y: '-5vh',
            opacity: [0, p.opacity, p.opacity, 0],
            x: [`${p.x}vw`, `${p.x + (p.id % 2 === 0 ? 3 : -3)}vw`, `${p.x}vw`]
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'linear'
          }}
          style={{ position: 'absolute' }}
        >
          {p.type === 'heart' && (
            <svg
              width={p.size}
              height={p.size}
              viewBox="0 0 24 24"
              fill="#D9777F"
              className="drop-shadow-sm opacity-60"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          )}
          {p.type === 'sparkle' && (
            <svg
              width={p.size * 0.9}
              height={p.size * 0.9}
              viewBox="0 0 24 24"
              fill="#EADBB6"
              className="drop-shadow-sm opacity-70"
            >
              <path d="M12 0l2.5 9.5L24 12l-9.5 2.5L12 24l-2.5-9.5L0 12l9.5-2.5z" />
            </svg>
          )}
          {p.type === 'dot' && (
            <div
              className="rounded-full bg-[#F3D7D7] shadow-sm"
              style={{
                width: p.size * 0.5,
                height: p.size * 0.5
              }}
            />
          )}
        </motion.div>
      ))}
    </div>
  );
};
