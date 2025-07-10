'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Tab {
  name: string;
  path: string;
  color: string;
  gridColor: string;
}

// Define consistent tab colors to prevent hydration mismatches
const tabs: Tab[] = [
  { 
    name: 'Home', 
    path: '/', 
    color: '#ff7eb9',
    gridColor: '#ff7eb9'
  },
  { 
    name: 'Blog', 
    path: '/blog', 
    color: '#7afcff',
    gridColor: '#7afcff'
  },
  { 
    name: 'Projects', 
    path: '/projects', 
    color: '#52b788',
    gridColor: '#52b788'
  },
  { 
    name: 'Resources', 
    path: '/resources', 
    color: '#f9e79f',
    gridColor: '#f9e79f'
  },
];

// Helper function to determine if a tab is active
const isTabActive = (tabPath: string, pathname: string): boolean => {
  if (tabPath === '/') {
    return pathname === '/';
  }
  return pathname.startsWith(tabPath);
};

// Helper function to find the active tab
const getActiveTab = (pathname: string) => {
  return tabs.find(tab => isTabActive(tab.path, pathname));
};

export default function FolderNavigation() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const activeTab = getActiveTab(pathname);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Only show connector when mounted and we have a valid active tab
  const displayActiveTab = mounted && activeTab ? activeTab : null;

  return (
    <>
      <div className="w-full flex relative z-10 mb-0 overflow-x-auto" style={{ paddingLeft: '8px', paddingRight: '16px', paddingTop: '20px' }}>
        {tabs.map((tab, index) => {
          const isActive = isTabActive(tab.path, pathname);
          return (
            <Link
              key={tab.path}
              href={tab.path}
              className={`relative px-6 sm:px-8 py-3 text-black rounded-t-lg transition-all whitespace-nowrap flex-1 text-center
                ${isActive ? 'z-10' : 'hover:z-[5]'}`}
              style={{
                backgroundColor: tab.color,
                marginLeft: index === 0 ? 0 : -8,
                opacity: isActive ? 1 : 0.7,
                boxShadow: isActive 
                  ? '0 -6px 12px rgba(0,0,0,0.2), -6px -6px 10px rgba(0,0,0,0.15), 6px -6px 10px rgba(0,0,0,0.15)' 
                  : '0 0 12px rgba(0,0,0,0.2)',
                borderBottom: isActive ? 'none' : '1px solid rgba(0,0,0,0.1)',
              }}
            >
              <div className="absolute inset-0 rounded-t-lg overflow-hidden">
                <div
                  className={`absolute inset-0 ${isActive ? 'opacity-50' : 'opacity-30'}`}
                  style={{
                    backgroundImage: `linear-gradient(90deg, 
                      ${tab.gridColor} 1px, transparent 1px),
                      linear-gradient(${tab.gridColor} 1px, transparent 1px)`,
                    backgroundSize: '15px 15px'
                  }}
                />
              </div>
              
              {/* Curved ramps at bottom */}
              <div 
                className="absolute bottom-0 left-[-8px] w-4 h-4"
                style={{
                  background: `radial-gradient(circle at top right, transparent 12px, ${tab.color} 12px)`,
                  zIndex: -1
                }}
              />
              <div 
                className="absolute bottom-0 right-[-8px] w-4 h-4"
                style={{
                  background: `radial-gradient(circle at top left, transparent 12px, ${tab.color} 12px)`,
                  zIndex: -1
                }}
              />
              <span className="relative z-10 font-medium">
                {tab.name}
              </span>
            </Link>
          );
        })}
      </div>
      
            {/* Seamless connector */}
      {displayActiveTab && (
        <div 
          className="relative w-full h-12 z-[5]"
          style={{ 
            backgroundColor: displayActiveTab.color,
            borderTopLeftRadius: '8px',
            borderTopRightRadius: '8px',
            boxShadow: '0 -10px 10px -2px rgba(0,0,0,0.4)'
          }}
        >
          {/* Grid pattern for the connector */}
          <div
            className="absolute inset-0 opacity-50"
            style={{
              backgroundImage: `linear-gradient(90deg, 
                ${displayActiveTab.gridColor} 1px, transparent 1px),
                linear-gradient(${displayActiveTab.gridColor} 1px, transparent 1px)`,
              backgroundSize: '15px 15px',
              borderTopLeftRadius: '8px',
              borderTopRightRadius: '8px'
            }}
          />
          

        </div>
      )}
    </>
  );
} 