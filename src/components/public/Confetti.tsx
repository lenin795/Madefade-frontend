import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const COLORS = ['#00C896', '#FF5C5C', '#F59E0B', '#0E1410'];

export function Confetti() {
  const [pieces, setPieces] = useState<{ id: number; x: number; color: string; rotate: number; delay: number }[]>([]);

  useEffect(() => {
    const arr = Array.from({ length: 28 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: COLORS[i % COLORS.length],
      rotate: Math.random() * 360,
      delay: Math.random() * 0.3,
    }));
    setPieces(arr);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[90] overflow-hidden" aria-hidden="true">
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          className="absolute top-0 w-2 h-3 rounded-sm"
          style={{ left: `${p.x}%`, backgroundColor: p.color }}
          initial={{ y: -20, opacity: 1, rotate: 0 }}
          animate={{ y: '110vh', opacity: 0, rotate: p.rotate }}
          transition={{ duration: 1.8 + Math.random(), delay: p.delay, ease: 'easeIn' }}
        />
      ))}
    </div>
  );
}
