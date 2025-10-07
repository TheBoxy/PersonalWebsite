'use client';

import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';

const CloudSvg1 = () => (
  <svg width="120" height="60" viewBox="0 0 120 60" fill="none">
    <ellipse cx="25" cy="35" rx="20" ry="15" fill="rgba(255, 255, 255, 0.95)" />
    <ellipse cx="45" cy="30" rx="25" ry="20" fill="rgba(255, 255, 255, 0.98)" />
    <ellipse cx="70" cy="32" rx="22" ry="18" fill="rgba(255, 255, 255, 0.96)" />
    <ellipse cx="90" cy="36" rx="18" ry="14" fill="rgba(255, 255, 255, 0.94)" />
    <ellipse cx="35" cy="40" rx="15" ry="12" fill="rgba(255, 255, 255, 0.92)" />
    <ellipse cx="60" cy="42" rx="20" ry="15" fill="rgba(255, 255, 255, 0.93)" />
  </svg>
);

const CloudSvg2 = () => (
  <svg width="100" height="50" viewBox="0 0 100 50" fill="none">
    <ellipse cx="20" cy="30" rx="18" ry="12" fill="rgba(255, 255, 255, 0.96)" />
    <ellipse cx="40" cy="25" rx="22" ry="16" fill="rgba(255, 255, 255, 0.98)" />
    <ellipse cx="65" cy="28" rx="20" ry="14" fill="rgba(255, 255, 255, 0.97)" />
    <ellipse cx="80" cy="32" rx="15" ry="10" fill="rgba(255, 255, 255, 0.95)" />
    <ellipse cx="50" cy="35" rx="18" ry="12" fill="rgba(255, 255, 255, 0.94)" />
  </svg>
);

const CloudSvg3 = () => (
  <svg width="140" height="70" viewBox="0 0 140 70" fill="none">
    <ellipse cx="30" cy="40" rx="25" ry="18" fill="rgba(255, 255, 255, 0.97)" />
    <ellipse cx="60" cy="35" rx="30" ry="22" fill="rgba(255, 255, 255, 0.99)" />
    <ellipse cx="95" cy="38" rx="28" ry="20" fill="rgba(255, 255, 255, 0.98)" />
    <ellipse cx="115" cy="42" rx="20" ry="15" fill="rgba(255, 255, 255, 0.96)" />
    <ellipse cx="45" cy="48" rx="22" ry="16" fill="rgba(255, 255, 255, 0.94)" />
    <ellipse cx="80" cy="50" rx="25" ry="18" fill="rgba(255, 255, 255, 0.95)" />
    <ellipse cx="25" cy="52" rx="15" ry="10" fill="rgba(255, 255, 255, 0.92)" />
  </svg>
);

const CloudSvg4 = () => (
  <svg width="80" height="40" viewBox="0 0 80 40" fill="none">
    <ellipse cx="15" cy="25" rx="12" ry="8" fill="rgba(255, 255, 255, 0.97)" />
    <ellipse cx="30" cy="20" rx="18" ry="12" fill="rgba(255, 255, 255, 0.98)" />
    <ellipse cx="50" cy="22" rx="16" ry="10" fill="rgba(255, 255, 255, 0.96)" />
    <ellipse cx="65" cy="26" rx="12" ry="8" fill="rgba(255, 255, 255, 0.95)" />
    <ellipse cx="40" cy="30" rx="14" ry="9" fill="rgba(255, 255, 255, 0.94)" />
  </svg>
);

const CloudSvg5 = () => (
  <svg width="110" height="55" viewBox="0 0 110 55" fill="none">
    <ellipse cx="22" cy="32" rx="20" ry="14" fill="rgba(255, 255, 255, 0.97)" />
    <ellipse cx="45" cy="28" rx="24" ry="18" fill="rgba(255, 255, 255, 0.99)" />
    <ellipse cx="70" cy="30" rx="21" ry="16" fill="rgba(255, 255, 255, 0.98)" />
    <ellipse cx="88" cy="34" rx="17" ry="12" fill="rgba(255, 255, 255, 0.96)" />
    <ellipse cx="35" cy="38" rx="18" ry="13" fill="rgba(255, 255, 255, 0.94)" />
    <ellipse cx="60" cy="40" rx="22" ry="15" fill="rgba(255, 255, 255, 0.95)" />
  </svg>
);

// Define tab colors as constants to ensure server/client consistency
type TabColorData = {
  borderColor: string;
  gridColor: string;
};

// 🎃 Halloween spooky border colors
const TAB_COLORS: Record<string, TabColorData> = {
  '/': { borderColor: '#FF6600', gridColor: '#ffd1e6' },
  '/blog': { borderColor: '#9932CC', gridColor: '#d9feff' },
  '/projects': { borderColor: '#FF8C00', gridColor: '#d4edda' },
  '/resources': { borderColor: '#6A0DAD', gridColor: '#fef9e7' },
  '/music': { borderColor: '#FF1493', gridColor: '#ffe6f5' },
};

const getTabColor = (pathname: string) => {
  // Find the matching tab - for home, use exact match; for others, use startsWith
  let tabData: TabColorData = TAB_COLORS['/'];  // Default to home
  
  if (pathname === '/') {
    tabData = TAB_COLORS['/'];
  } else if (pathname.startsWith('/blog')) {
    tabData = TAB_COLORS['/blog'];
  } else if (pathname.startsWith('/projects')) {
    tabData = TAB_COLORS['/projects'];
  } else if (pathname.startsWith('/resources')) {
    tabData = TAB_COLORS['/resources'];
  } else if (pathname.startsWith('/music')) {
    tabData = TAB_COLORS['/music'];
  }
  
  return { 
    backgroundColor: 'linear-gradient(135deg, #87CEEB 0%, #B0E0E6 50%, #D0E7FF 100%)', // Sky blue gradient
    borderColor: tabData.borderColor, // Border matches the tab
    gridColor: 'rgba(255, 255, 255, 0.3)' // Subtle white grid
  };
};

interface CloudPosition {
  top: string;
  scale: number;
  opacity: number;
  animationDelay: string;
  animationType: 'animate-float-1' | 'animate-float-2' | 'animate-float-3';
  CloudComponent: React.ComponentType;
}

export default function LayoutWrapper({
  children
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { backgroundColor, borderColor, gridColor } = getTabColor(pathname);
  
  const [cloudPositions, setCloudPositions] = useState<CloudPosition[]>([]);
  const [mounted, setMounted] = useState(false);
  const mainContentRef = useRef<HTMLElement>(null);

  // Scroll to top when pathname changes (tab switching)
  useEffect(() => {
    if (mainContentRef.current) {
      mainContentRef.current.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    }
  }, [pathname]);

  useEffect(() => {
    // Only generate clouds on client side after mount
    const generateRandomClouds = () => {
      const cloudComponents = [CloudSvg1, CloudSvg2, CloudSvg3, CloudSvg4, CloudSvg5];
      const animationTypes: ('animate-float-1' | 'animate-float-2' | 'animate-float-3')[] = ['animate-float-1', 'animate-float-2', 'animate-float-3'];
      
      const randomClouds: CloudPosition[] = [];
      
      // Generate 18-25 random clouds
      const cloudCount = Math.floor(Math.random() * 8) + 18;
      
      for (let i = 0; i < cloudCount; i++) {
        randomClouds.push({
          top: `${Math.random() * 85 + 5}%`, // Random top position between 5% and 90%
          scale: Math.random() * 0.8 + 0.3, // Random scale between 0.3 and 1.1
          opacity: Math.random() * 0.25 + 0.15, // Random opacity between 0.15 and 0.4
          animationDelay: `${Math.random() * 40}s`, // Random delay between 0 and 40 seconds
          animationType: animationTypes[Math.floor(Math.random() * animationTypes.length)],
          CloudComponent: cloudComponents[Math.floor(Math.random() * cloudComponents.length)]
        });
      }
      
      return randomClouds;
    };

    // Small delay to ensure client has fully hydrated
    const timer = setTimeout(() => {
      setCloudPositions(generateRandomClouds());
      setMounted(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Background color and grid */}
      <div 
        className="fixed inset-0 w-full h-full"
        style={{ 
          backgroundImage: backgroundColor,
          zIndex: -1
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(90deg, 
              ${gridColor} 1px, transparent 1px),
              linear-gradient(${gridColor} 1px, transparent 1px)`,
            backgroundSize: '15px 15px',
            opacity: 0.3
          }}
        />
        
        {/* Floating Clouds */}
        <div className="absolute inset-0 overflow-hidden">
          {mounted && cloudPositions.map((cloud, index) => (
            <div
              key={index}
              className={`absolute ${cloud.animationType}`}
              style={{
                left: '-150px',
                top: cloud.top,
                '--cloud-scale': cloud.scale,
                '--cloud-opacity': cloud.opacity,
                animationDelay: cloud.animationDelay,
              } as React.CSSProperties}
            >
              <cloud.CloudComponent />
            </div>
          ))}
        </div>
      </div>

      {/* Content area with colored border */}
      <div 
        className="relative" 
        style={{ 
          backgroundColor: 'rgba(250, 249, 246, 0.95)',
          borderRight: `12px solid ${borderColor}`,
          borderBottom: `24px solid ${borderColor}`,
          borderLeft: `12px solid ${borderColor}`,
          borderRadius: '0 0 16px 16px',
          boxShadow: `0 12px 35px rgba(0, 0, 0, 0.25), -6px 0px 20px rgba(0, 0, 0, 0.2), 6px 0px 20px rgba(0, 0, 0, 0.2)`,
          height: 'calc(100vh - 140px)' // Viewport height minus navigation space
        }}
      >
        <main 
          ref={mainContentRef} 
          className="relative z-10 p-8 h-full overflow-auto rounded-lg"
        >
          {children}
        </main>
      </div>
    </>
  );
} 