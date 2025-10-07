"use client";

import Image from "next/image";
import { useState, useEffect } from 'react';
import Magnet from './components/Magnet';

// 🎃 Halloween Colors - Orange and Purple themed
const COLORS = [
  '#FF6600', // Halloween orange
  '#9932CC', // Dark orchid (purple)
  '#FF4500', // Orange red
  '#8B00FF', // Electric purple
  '#FF8C00', // Dark orange
  '#6A0DAD', // Deep purple
  '#FFA500', // Pure orange
  '#4B0082', // Indigo
  '#FF7F00', // Bright orange
  '#9400D3', // Dark violet
  '#FF6347', // Tomato
  '#8A2BE2', // Blue violet
];

const INITIAL_TEXT = 'welcome to kevin\'s site';

// Function to deterministically select a color based on letter and position
const getColor = (letter: string, index: number): string => {
  const colorIndex = (letter.charCodeAt(0) + index) % COLORS.length;
  return COLORS[colorIndex];
};



export default function HomePage() {
  const [magnets, setMagnets] = useState<Array<{
    id: string;
    letter: string;
    color: string;
    x: number;
    y: number;
  }>>([]);
  const [windowWidth, setWindowWidth] = useState(0);

  // Initialize magnets on client side only to avoid hydration mismatch
  useEffect(() => {
    const calculateCenteredPositions = () => {
      // Calculate window center
      const windowWidth = window.innerWidth;
      
      // Responsive sizing based on screen width
      const isMobile = windowWidth < 768;
      const isTablet = windowWidth >= 768 && windowWidth < 1024;
      
      const letterSpacing = isMobile ? 40 : isTablet ? 60 : 80;
      const lineHeight = isMobile ? 80 : isTablet ? 125 : 150;
      
      if (isMobile) {
        // Mobile: Each word on its own row
        const words = ['welcome', 'to', 'kevin\'s', 'site'];
        const wordStartIndices = [0, 8, 11, 18]; // Starting indices for each word
        const topOffset = 20; // Mobile top offset
        
        return INITIAL_TEXT.split('').map((letter, index) => {
          // Find which word this letter belongs to
          let wordIndex = 0;
          for (let i = wordStartIndices.length - 1; i >= 0; i--) {
            if (index >= wordStartIndices[i]) {
              wordIndex = i;
              break;
            }
          }
          
          const word = words[wordIndex];
          const letterIndexInWord = index - wordStartIndices[wordIndex];
          const wordWidth = word.length * letterSpacing;
          let wordStartX = Math.max(10, (windowWidth - wordWidth) / 2 - 50); // Shift 50px to the left
          
          // Special positioning for the "W" (first letter) on mobile
          if (index === 0) {
            wordStartX = wordStartX - 20; // Move "W" 20px further to the left
          }
          
          // Calculate y position with special spacing after "to"
          let yPosition = topOffset;
          if (wordIndex === 0) yPosition += 0; // "welcome"
          else if (wordIndex === 1) yPosition += lineHeight; // "to"
          else if (wordIndex === 2) yPosition += lineHeight + (lineHeight * 0.7); // "kevin's" - reduced space after "to"
          else if (wordIndex === 3) yPosition += lineHeight + (lineHeight * 0.7) + lineHeight; // "site"
          
          // Calculate base x position
          let xPosition = wordStartX + (letterIndexInWord * letterSpacing);
          
          // Special adjustments for letter pairs that are too far apart
          if (index === 15) { // "n" in "kevin's" - bring closer to "i"
            xPosition -= 25; // Move 25px closer to "i"
          }
          if (index === 16) { // "'" in "kevin's" - cascade the spacing
            xPosition -= 25; // Keep consistent spacing
          }
          if (index === 17) { // "s" in "kevin's" - cascade the spacing
            xPosition -= 25; // Keep consistent spacing
          }
          
          // Shift entire "site" word to the left
          if (index >= 19 && index <= 22) { // All letters in "site"
            xPosition -= 20; // Shift entire word left
          }
          
          if (index === 21) { // "t" in "site" - bring closer to "i"
            xPosition -= 30; // Move 30px closer to "i"
          }
          if (index === 22) { // "e" in "site" - cascade the spacing
            xPosition -= 30; // Keep consistent spacing
          }
          
          return {
            id: `initial-${index}`,
            letter,
            color: getColor(letter, index),
            x: Math.round(xPosition),
            y: Math.round(yPosition + Math.sin(index * 0.5) * 10), // Reduced wave effect for mobile
          };
        });
      } else {
        // Desktop: Two-row layout
        
        // Desktop positioning
        const firstRowStartX = 160;
        const secondRowStartX = 0;
        
        // Position at top of page (accounting for folder header)
        const topOffset = -10;
        
        return INITIAL_TEXT.split('').map((letter, index) => {
          const isSecondRow = index > 9;
          const rowIndex = isSecondRow ? index - 10 : index;
          let startX = isSecondRow ? secondRowStartX : firstRowStartX;
          
          // Special positioning for the "W" (first letter)
          if (index === 0) {
            startX = 130; // Move "W" further to the left
          }
          
          // Special positioning for the "s" after the apostrophe in "kevin's"
          if (index === 17) { // The "s" after the apostrophe
            startX = secondRowStartX - 30; // Move "s" 30px to the left
          }
          
          // Special positioning for the word "site" (indices 19-22)
          if (index >= 19 && index <= 22) { // The word "site"
            startX = secondRowStartX - 30; // Move "site" 30px to the left
          }
          
          // Calculate base x position
          let xPosition = startX + (rowIndex * letterSpacing);
          
          // Special adjustments for letter pairs that are too far apart
          if (index === 15) { // "n" in "kevin's" - bring closer to "i"
            xPosition -= 35; // Move 35px closer to "i" (desktop needs more adjustment)
          }
          if (index === 16) { // "'" in "kevin's" - cascade the spacing
            xPosition -= 35; // Keep consistent spacing
          }
          if (index === 17) { // "s" in "kevin's" - cascade the spacing
            xPosition -= 35; // Keep consistent spacing
          }
          
          // Shift entire "site" word to the left
          if (index >= 19 && index <= 22) { // All letters in "site"
            xPosition -= 30; // Shift entire word left (desktop needs more adjustment)
          }
          
          if (index === 21) { // "t" in "site" - bring closer to "i"
            xPosition -= 40; // Move 40px closer to "i" (desktop needs more adjustment)
          }
          if (index === 22) { // "e" in "site" - cascade the spacing
            xPosition -= 40; // Keep consistent spacing
          }
          
          return {
            id: `initial-${index}`,
            letter,
            color: getColor(letter, index),
            x: Math.round(xPosition),
            y: Math.round(topOffset + (isSecondRow ? lineHeight : 0) + Math.sin(index * 0.5) * 20), // Reduced wave effect
          };
        });
      }
    };

    // Initial positioning
    const initialMagnets = calculateCenteredPositions();
    setMagnets(initialMagnets);
    setWindowWidth(window.innerWidth);

    // Re-center on window resize
    const handleResize = () => {
      const centeredMagnets = calculateCenteredPositions();
      setMagnets(prev => 
        prev.map(magnet => {
          const centeredMagnet = centeredMagnets.find(m => m.id === magnet.id);
          return centeredMagnet || magnet;
        })
      );
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const addRandomMagnet = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const randomLetter = letters[Math.floor(Math.random() * letters.length)];
    const newId = `random-${Date.now()}`;
    
    // Responsive positioning for random letters
    const isMobile = window.innerWidth < 768;
    const letterSize = isMobile ? 48 : 96; // Approximate letter size
    const margin = isMobile ? 20 : 100;
    
    const newMagnet = {
      id: newId,
      letter: randomLetter,
      color: getColor(randomLetter, magnets.length),
      x: Math.random() * (window.innerWidth - letterSize - margin) + margin/2,
      y: Math.random() * (window.innerHeight - letterSize - margin) + margin,
    };
    setMagnets([...magnets, newMagnet]);
  };



  return (
    <div className="space-y-3 relative">
      {/* 🎃 Halloween Decorations */}
      {/* Flying Bats - more movement, all start together */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
        {[...Array(8)].map((_, i) => (
          <div
            key={`bat-${i}`}
            className="absolute text-4xl animate-bat-fly"
            style={{
              left: `${(i * 12) + 5}%`,
              top: `${(i % 3) * 25 + 10}%`,
              animationDuration: `${8 + (i % 3) * 2}s`,
            }}
          >
            🦇
          </div>
        ))}
      </div>

      {/* Floating Pumpkins in corners */}
      <div className="fixed top-4 left-4 text-5xl animate-bounce z-40 pointer-events-none" style={{ animationDuration: '3s' }}>
        🎃
      </div>
      <div className="fixed top-4 right-4 text-5xl animate-bounce z-40 pointer-events-none" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }}>
        🎃
      </div>

      {/* Spider Web corners */}
      <div className="fixed top-0 left-0 text-6xl opacity-70 pointer-events-none z-40">
        🕸️
      </div>
      <div className="fixed top-0 right-0 text-6xl opacity-70 pointer-events-none z-40 transform scale-x-[-1]">
        🕸️
      </div>

      {/* Ghost floating */}
      <div className="fixed bottom-20 left-10 text-4xl animate-float pointer-events-none z-40" style={{ animationDuration: '3s' }}>
        👻
      </div>
      <div className="fixed bottom-32 right-20 text-4xl animate-float pointer-events-none z-40" style={{ animationDuration: '4s', animationDelay: '1s' }}>
        👻
      </div>

            {/* Magnet container with relative positioning */}
      <div className="relative" style={{ minHeight: windowWidth < 768 ? '340px' : '320px' }}>
        {magnets.map((magnet) => (
          <Magnet
            key={magnet.id}
            letter={magnet.letter}
            initialX={magnet.x}
            initialY={magnet.y}
            color={magnet.color}
          />
        ))}
        
        {/* Halloween Orange separator line */}
        {windowWidth > 0 && (
          <div 
            className="absolute left-0 right-0 h-2 bg-orange-500 rounded-full"
            style={{
              top: windowWidth < 768 ? '320px' : '300px', // Responsive positioning - reduced white space on both mobile and desktop
              marginLeft: windowWidth < 768 ? '5px' : '20px', // Even longer line on mobile
              marginRight: windowWidth < 768 ? '5px' : '20px', // Even longer line on mobile
              boxShadow: `
                0 0 10px rgba(255, 102, 0, 0.7),
                0 0 20px rgba(255, 102, 0, 0.5),
                0 0 30px rgba(255, 102, 0, 0.3),
                0 4px 8px rgba(0, 0, 0, 0.1)
              `, // Halloween orange glow effect
            }}
          />
        )}
      </div>
      
      {/* Social Media Profile Layout */}
      <div className="max-w-7xl mx-auto">
        {/* Profile and About Side by Side */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Profile Header - Halloween themed */}
          <div className="lg:w-1/3 bg-gradient-to-r from-orange-50 to-purple-50 rounded-2xl p-6 md:p-8 shadow-lg border-2 border-orange-300 relative overflow-hidden">
            {/* Decorative pumpkins */}
            <div className="absolute top-2 right-2 text-2xl">🎃</div>
            <div className="absolute bottom-2 left-2 text-xl">🕷️</div>
            <div className="flex flex-col items-center text-center">
              {/* Profile Picture */}
              <div className="mb-6">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-white p-1 shadow-lg border-4 border-orange-300 overflow-hidden">
                  <Image 
                    src="/images/photo.jpg" 
                    alt="Kevin Martinez" 
                    width={160} 
                    height={160} 
                    className="w-full h-full object-cover"
                    style={{ 
                      objectPosition: '-20% 35%',
                      transform: 'scale(1.25)'
                    }}
                  />
                </div>
              </div>
              
              {/* Profile Info */}
              <div className="w-full">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                  Kevin Martinez
                </h1>
                
                {/* Tags - Halloween themed */}
                <div className="mb-6 flex flex-wrap gap-2 justify-center">
                  <span className="inline-block bg-gradient-to-r from-orange-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg border border-orange-300/50 tracking-wide">
                    Human 👻
                  </span>
                  <span className="inline-block bg-gradient-to-r from-purple-500 to-orange-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg border border-purple-300/50 tracking-wide">
                    Mexican 🎃
                  </span>
                </div>
                
                {/* About Me */}
                <div className="text-left">
                  <h2 className="text-xl font-bold text-gray-800 mb-4 underline">About Me</h2>
                  <p className="text-gray-700 leading-relaxed">
                    Hi, I&apos;m Kevin! I&apos;m from South Central Los Angeles and have a Computer Science degree from UCI. I want to share a few of my projects so feel free to explore and see if something resonates with you. I hope to keep on creating so come back to stay up to date. Creating from the chaos. Growing through the noise.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* About Section - Halloween themed */}
          <div className="lg:w-2/3 bg-white rounded-2xl p-6 md:p-8 shadow-lg border-2 border-orange-200 relative overflow-hidden">
            {/* Decorative Halloween elements */}
            <div className="absolute top-2 left-2 text-2xl">🕸️</div>
            <div className="absolute top-2 right-2 text-2xl">🦇</div>
            <div className="absolute bottom-2 right-2 text-xl">🍬</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2 underline">
              
              About This Digital Folder
            </h2>
            
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                <strong>Welcome to my site!</strong> I aim to host all my writings and projects I am working on in this site. I wanted a place where all the stuff I am working on can be easily accessed in one spot. 
              </p>
              
              <p>
              I sometimes start projects and move on to the next thing so everything I am working on may not make it to the site. I will try my best to update the site with new and exciting stuff but I will be mainly focusing on the actual projects so check there if the site hasn’t changed in a while. 
              </p>
              
              <p>
              I also hope to increase my productivity through the site and hopefully develop a stronger creative voice. But then again you can’t force creativity so who knows how this will work out. Check back on my blog section where I will be writing frequently. Look around and explore the site.
              </p>
    </div>
    
            {/* Call to Action - Halloween themed */}
            <div className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-purple-50 rounded-xl border border-orange-300">
              <p className="text-center text-gray-700 font-medium">
                🎃 <strong>Explore the folders above</strong> to discover my latest projects, thoughts, and resources! 👻
              </p>
            </div>
            
            {/* Hidden Easter Egg */}
            <div className="mt-4 text-center">
              <p className="text-white text-2xl font-bold">
                Be who you want to be!
              </p>
              <p></p>
              <p className="text-white text-2xl font-bold">
              Remember, you are goated!
              </p>
              <p className="text-white text-2xl font-bold">
              Drink your water!
              </p>
                             <p className="text-white text-2xl font-bold">
               If it&apos;s meant for you, it will find you!
               </p>
            
            </div>
          </div>
        </div>
        
        
      </div>

      {/* Mystery button - Halloween themed - links to YouTube Shorts */}
      <button
        onClick={() => window.open('https://www.youtube.com/shorts/W5mvNfFXUi8', '_blank')}
        className="fixed bottom-4 right-6 md:bottom-8 md:right-10 bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 md:px-6 md:py-3 text-sm md:text-base rounded-full shadow-lg transition-colors z-10 border-2 border-purple-400"
      >
        🎃 Mystery 👻
      </button>
    </div>
  );
}
