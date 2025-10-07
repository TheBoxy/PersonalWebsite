'use client';

import React from 'react';

interface HalloweenDecorationsProps {
  theme?: 'default' | 'minimal' | 'intense';
}

/**
 * Reusable Halloween decorations component
 * Add this to any page to get spooky floating decorations!
 * 
 * @param theme - 'default' for normal decorations, 'minimal' for fewer decorations, 'intense' for more decorations
 * 
 * @example
 * ```tsx
 * import HalloweenDecorations from './components/HalloweenDecorations';
 * 
 * export default function MyPage() {
 *   return (
 *     <div>
 *       <HalloweenDecorations />
 *       // Your page content
 *     </div>
 *   );
 * }
 * ```
 */
export default function HalloweenDecorations({ theme = 'default' }: HalloweenDecorationsProps) {
  const decorationSets = {
    minimal: [
      { emoji: '🎃', position: 'top-5 left-5', size: 'text-3xl', animation: 'animate-bounce', duration: '2s' },
      { emoji: '🦇', position: 'top-5 right-5', size: 'text-3xl', animation: 'animate-float', duration: '3s' },
    ],
    default: [
      { emoji: '🎃', position: 'top-5 left-5', size: 'text-4xl', animation: 'animate-bounce', duration: '2s' },
      { emoji: '🦇', position: 'top-5 right-5', size: 'text-4xl', animation: 'animate-float', duration: '3s' },
      { emoji: '👻', position: 'bottom-10 left-10', size: 'text-3xl', animation: 'animate-float', duration: '4s' },
      { emoji: '🕷️', position: 'bottom-10 right-10', size: 'text-3xl', animation: '', duration: '' },
    ],
    intense: [
      { emoji: '🎃', position: 'top-5 left-5', size: 'text-5xl', animation: 'animate-bounce', duration: '2s' },
      { emoji: '🦇', position: 'top-5 right-5', size: 'text-4xl', animation: 'animate-float', duration: '3s' },
      { emoji: '👻', position: 'bottom-10 left-10', size: 'text-4xl', animation: 'animate-float', duration: '4s' },
      { emoji: '🕷️', position: 'bottom-10 right-10', size: 'text-3xl', animation: '', duration: '' },
      { emoji: '🦇', position: 'top-1/4 left-1/4', size: 'text-3xl', animation: 'animate-float', duration: '5s' },
      { emoji: '🕸️', position: 'top-1/3 right-1/4', size: 'text-4xl', animation: '', duration: '' },
      { emoji: '👻', position: 'bottom-1/4 right-1/3', size: 'text-3xl', animation: 'animate-float', duration: '3.5s' },
      { emoji: '🎃', position: 'bottom-1/3 left-1/3', size: 'text-3xl', animation: 'animate-bounce', duration: '2.5s' },
    ],
  };

  const decorations = decorationSets[theme];

  return (
    <>
      {decorations.map((decoration, index) => (
        <div
          key={`halloween-${index}`}
          className={`fixed ${decoration.position} ${decoration.size} ${decoration.animation} z-40 pointer-events-none`}
          style={{ 
            animationDuration: decoration.duration,
            opacity: 0.9,
          }}
        >
          {decoration.emoji}
        </div>
      ))}
    </>
  );
}

/**
 * Floating bats component for backgrounds
 * Adds animated bats that fly across the screen
 */
export function FloatingBats({ count = 8 }: { count?: number }) {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {[...Array(count)].map((_, i) => (
        <div
          key={`bat-${i}`}
          className="absolute text-4xl animate-float"
          style={{
            left: `${(i * 12) + 5}%`,
            top: `${(i % 3) * 25 + 10}%`,
            animationDelay: `${i * 0.8}s`,
            animationDuration: `${4 + (i % 3)}s`,
            opacity: 0.7,
          }}
        >
          🦇
        </div>
      ))}
    </div>
  );
}

/**
 * Spider web corner decorations
 */
export function SpiderWebCorners() {
  return (
    <>
      <div className="fixed top-0 left-0 text-6xl opacity-70 pointer-events-none z-40">
        🕸️
      </div>
      <div className="fixed top-0 right-0 text-6xl opacity-70 pointer-events-none z-40 transform scale-x-[-1]">
        🕸️
      </div>
    </>
  );
}

/**
 * Pumpkin corner decorations with bounce animation
 */
export function BouncingPumpkins() {
  return (
    <>
      <div className="fixed top-4 left-4 text-5xl animate-bounce z-40 pointer-events-none" style={{ animationDuration: '3s' }}>
        🎃
      </div>
      <div className="fixed top-4 right-4 text-5xl animate-bounce z-40 pointer-events-none" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }}>
        🎃
      </div>
    </>
  );
}

/**
 * Floating ghosts decorations
 */
export function FloatingGhosts() {
  return (
    <>
      <div className="fixed bottom-20 left-10 text-4xl animate-float pointer-events-none z-40" style={{ animationDuration: '3s' }}>
        👻
      </div>
      <div className="fixed bottom-32 right-20 text-4xl animate-float pointer-events-none z-40" style={{ animationDuration: '4s', animationDelay: '1s' }}>
        👻
      </div>
    </>
  );
}

