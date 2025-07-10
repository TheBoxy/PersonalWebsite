"use client";

import Image from "next/image";
import { useState, useEffect } from 'react';
import Magnet from './components/Magnet';


const COLORS = [
  '#FF0080', // Bright magenta
  '#00FFFF', // Cyan
  '#FF4500', // Orange red
  '#FFFF00', // Bright yellow
  '#9932CC', // Dark orchid (purple)
  '#00FF00', // Lime green
  '#FF8C00', // Dark orange
  '#1E90FF', // Dodger blue
  '#FF6347', // Tomato
  '#7FFF00', // Chartreuse
  '#FF00FF', // Magenta
  '#00BFFF', // Deep sky blue
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
          
          return {
            id: `initial-${index}`,
            letter,
            color: getColor(letter, index),
            x: Math.round(wordStartX + (letterIndexInWord * letterSpacing)),
            y: Math.round(yPosition + Math.sin(index * 0.5) * 10), // Reduced wave effect for mobile
          };
        });
      } else {
        // Desktop: Two-row layout
        const firstRow = INITIAL_TEXT.slice(0, 10); // "welcome to"
        const secondRow = INITIAL_TEXT.slice(10);   // " kevin's site"
        
        // Calculate row widths (for potential future use)
        // const firstRowWidth = firstRow.length * letterSpacing;
        // const secondRowWidth = secondRow.length * letterSpacing;
        
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
          
          return {
            id: `initial-${index}`,
            letter,
            color: getColor(letter, index),
            x: Math.round(startX + (rowIndex * letterSpacing)),
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
        
        {/* Pink separator line */}
        {windowWidth > 0 && (
          <div 
            className="absolute left-0 right-0 h-2 bg-pink-500 rounded-full"
            style={{
              top: windowWidth < 768 ? '320px' : '300px', // Responsive positioning - reduced white space on both mobile and desktop
              marginLeft: windowWidth < 768 ? '5px' : '20px', // Even longer line on mobile
              marginRight: windowWidth < 768 ? '5px' : '20px', // Even longer line on mobile
              boxShadow: `
                0 0 10px rgba(236, 72, 153, 0.7),
                0 0 20px rgba(236, 72, 153, 0.5),
                0 0 30px rgba(236, 72, 153, 0.3),
                0 4px 8px rgba(0, 0, 0, 0.1)
              `, // Brighter pink glow effect
            }}
          />
        )}
      </div>
      
      {/* Social Media Profile Layout */}
      <div className="max-w-7xl mx-auto">
        {/* Profile and About Side by Side */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Profile Header */}
          <div className="lg:w-1/3 bg-gradient-to-r from-pink-50 to-blue-50 rounded-2xl p-6 md:p-8 shadow-lg border-2 border-pink-200">
            <div className="flex flex-col items-center text-center">
              {/* Profile Picture */}
              <div className="mb-6">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-white p-1 shadow-lg border-4 border-pink-300 overflow-hidden">
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
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                  Kevin Martinez
                </h1>
                
                {/* About Me */}
                <div className="text-left">
                  <h2 className="text-xl font-bold text-gray-800 mb-4 underline">About Me</h2>
                  <p className="text-gray-700 leading-relaxed">
                    Hi, I'm Kevin! I'm from South Central Los Angeles, have a computer science degree from UCI and want to share a couple of my projects. Look around and maybe something resonates with you. I hope to keep on creating so keep on coming back to stay up to date. Creating from the chaos. Growing through the noise.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* About Section */}
          <div className="lg:w-2/3 bg-white rounded-2xl p-6 md:p-8 shadow-lg border-2 border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2 underline">
              
              About This Digital Folder
            </h2>
            
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                <strong>Welcome to my site!</strong> I aim to host all my writings and projects I am working on in this site. I would like to have a place where all the stuff I am working on can be easily accessed in one spot. 
              </p>
              
              <p>
              I sometimes start projects and move on to the next thing so everything I am working on may not make it to the site. I will try my best to update the site with new and exciting stuff but I will be mainly focusing on the actual projects so check there if the site hasn’t changed in a while. 
              </p>
              
              <p>
              I also hope to increase my productivity through the site and hopefully develop a stronger creative voice. But then again you can’t force creativity so who knows how this will work out. Check back on my blog section where I will be writing frequently. Look around and explore the site.
              </p>
    </div>
    
            {/* Call to Action */}
            <div className="mt-6 p-4 bg-gradient-to-r from-pink-50 to-blue-50 rounded-xl border border-pink-200">
              <p className="text-center text-gray-700 font-medium">
                <strong>Explore the folders above</strong> to discover my latest projects, thoughts, and resources!
              </p>
            </div>
            
            {/* Hidden Easter Egg */}
            <div className="mt-4 text-center">
              <p className="text-white text-2xl font-bold">
                Be who you want to be!
              </p>
            </div>
          </div>
        </div>
        
        
      </div>

      {/* Add random magnet button */}
      <button
        onClick={addRandomMagnet}
        className="fixed bottom-4 right-6 md:bottom-8 md:right-10 bg-pink-500 hover:bg-pink-600 text-white px-3 py-2 md:px-6 md:py-3 text-sm md:text-base rounded-full shadow-lg transition-colors z-10 border-2 border-white"
      >
        Mystery
      </button>
    </div>
  );
}
