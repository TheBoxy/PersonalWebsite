"use client";

import Image from "next/image";
import { useState, useEffect } from 'react';
import Magnet from './components/Magnet';

// Original color palette
const COLORS = [
  '#FF6B6B', // Coral red
  '#4ECDC4', // Turquoise
  '#45B7D1', // Sky blue
  '#FFA07A', // Light salmon
  '#98D8C8', // Mint green
  '#F7DC6F', // Bright yellow
  '#BB8FCE', // Lavender
  '#85C1E2', // Light blue
  '#F8B88B', // Peach
  '#52B788', // Green
  '#FFB6C1', // Light pink
  '#87CEEB', // Sky blue
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



  return (
    <div className="relative">
      {/* Magnet container with relative positioning */}
      <div className="relative mb-12" style={{ minHeight: windowWidth < 768 ? '280px' : '240px' }}>
        {magnets.map((magnet) => (
          <Magnet
            key={magnet.id}
            letter={magnet.letter}
            initialX={magnet.x}
            initialY={magnet.y}
            color={magnet.color}
          />
        ))}
        
        {/* Decorative separator bar */}
        {windowWidth > 0 && (
          <div 
            className="absolute left-0 right-0 h-2 rounded-full"
            style={{
              bottom: '-35px',
              marginLeft: windowWidth < 768 ? '10px' : '40px',
              marginRight: windowWidth < 768 ? '10px' : '40px',
              background: '#45B7D1',
              boxShadow: '0 0 20px rgba(69, 183, 209, 0.8), 0 0 40px rgba(69, 183, 209, 0.5), 0 0 60px rgba(69, 183, 209, 0.3)',
            }}
          />
        )}
      </div>
      
      {/* Social Media Profile Layout */}
      <div className="max-w-7xl mx-auto">
        {/* Profile and About Side by Side */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Profile Header */}
          <div className="lg:w-1/3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 md:p-8 shadow-lg border-2 border-blue-300 relative overflow-hidden">
            <div className="flex flex-col items-center text-center">
              {/* Profile Picture */}
              <div className="mb-6">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-white p-1 shadow-lg border-4 border-blue-300 overflow-hidden">
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
                
                {/* Tags */}
                <div className="mb-6 flex flex-wrap gap-2 justify-center">
                  <span className="inline-block bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg border border-blue-300/50 tracking-wide">
                    Human 👤
                  </span>
                  <span 
                    className="inline-block bg-gradient-to-r from-cyan-500 to-teal-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg border border-cyan-300/50 tracking-wide cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => window.open('https://www.youtube.com/watch?v=b89CnP0Iq30', '_blank')}
                    title="Click to learn more! 🇲🇽"
                  >
                    Mexican 🇲🇽
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
          
          {/* About Section */}
          <div className="lg:w-2/3 bg-white rounded-2xl p-6 md:p-8 shadow-lg border-2 border-blue-200 relative overflow-hidden">
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
    
            {/* Call to Action */}
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-300">
              <p className="text-center text-gray-700 font-medium">
                📂 <strong>Explore the folders above</strong> to discover my latest projects, thoughts, and resources! 🚀
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
    </div>
  );
}
