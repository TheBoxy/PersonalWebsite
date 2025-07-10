import { useState, useRef, useEffect } from 'react';

interface MagnetProps {
  letter: string;
  initialX: number;
  initialY: number;
  color: string;
}

// Function to generate a deterministic rotation based on letter and position
const getRotation = (letter: string, x: number, y: number): number => {
  // Use the character code and position to create a deterministic value
  const seed = letter.charCodeAt(0) + x + y;
  // Generate a value between -2 and 2 degrees and round to avoid precision issues
  return Math.round((((seed % 40) / 10) - 2) * 1000) / 1000;
};

// Function to adjust color brightness
const adjustColor = (color: string, amount: number) => {
  const hex = color.replace('#', '');
  const r = Math.min(255, Math.max(0, parseInt(hex.slice(0, 2), 16) + amount));
  const g = Math.min(255, Math.max(0, parseInt(hex.slice(2, 4), 16) + amount));
  const b = Math.min(255, Math.max(0, parseInt(hex.slice(4, 6), 16) + amount));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

const Magnet: React.FC<MagnetProps> = ({ letter, initialX, initialY, color }) => {
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [isDragging, setIsDragging] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);
  const magnetRef = useRef<HTMLDivElement>(null);
  const offset = useRef({ x: 0, y: 0 });
  
  // Track window width for responsive sizing
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Responsive sizing
  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;
  
  // Calculate rotation once based on initial props
  const rotation = getRotation(letter, initialX, initialY);

  // Calculate lighter and darker shades for 3D effect
  const lighterColor = adjustColor(color, 60);
  const darkerColor = adjustColor(color, -30);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - offset.current.x,
          y: e.clientY - offset.current.y,
        });
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging) {
        e.preventDefault();
        const touch = e.touches[0];
        setPosition({
          x: touch.clientX - offset.current.x,
          y: touch.clientY - offset.current.y,
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    offset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
    setIsDragging(true);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    offset.current = {
      x: touch.clientX - position.x,
      y: touch.clientY - position.y,
    };
    setIsDragging(true);
  };

  return (
    <div
      ref={magnetRef}
      className="absolute cursor-move select-none"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: `rotate(${rotation}deg)`,
        touchAction: 'none', // Prevent scrolling on touch
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      <div
        className="relative"
        style={{
          fontSize: isMobile ? '3rem' : isTablet ? '4.5rem' : '6rem',
          color: 'transparent',
          background: `linear-gradient(135deg, 
            ${lighterColor} 0%, 
            ${color} 45%, 
            ${color} 55%, 
            ${darkerColor} 100%
          )`,
          WebkitBackgroundClip: 'text',
          WebkitTextStroke: isMobile ? '0.5px rgba(0,0,0,0.1)' : '1px rgba(0,0,0,0.1)',
          textShadow: isMobile ? `
            1px 1px 0 rgba(255,255,255,0.2),
            -1px -1px 0 rgba(0,0,0,0.1),
            2px 2px 4px rgba(0,0,0,0.2)
          ` : `
            1px 1px 0 rgba(255,255,255,0.2),
            -1px -1px 0 rgba(0,0,0,0.1),
            4px 4px 8px rgba(0,0,0,0.2)
          `,
          fontFamily: 'var(--font-fredoka), "Arial Black", "Helvetica Neue", sans-serif',
          fontWeight: '700',
          userSelect: 'none',
          lineHeight: '1',
          filter: isMobile ? 'drop-shadow(0 3px 4px rgba(0,0,0,0.35)) brightness(1.1)' : 'drop-shadow(0 6px 8px rgba(0,0,0,0.35)) brightness(1.1)',
        }}
      >
        {letter.toUpperCase()}
      </div>
    </div>
  );
};

export default Magnet; 