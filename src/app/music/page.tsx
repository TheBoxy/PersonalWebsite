'use client';

import Image from 'next/image';

export default function MusicPage() {
  return (
    <div className="h-full flex items-center justify-center p-4 relative">
      {/* WIP Caution Tape - Top */}
      <div className="absolute top-[15%] left-0 right-0 z-20 transform -rotate-3 pointer-events-none">
        <div className="bg-yellow-400 border-t-4 border-b-4 border-black py-3 shadow-lg"
          style={{
            backgroundImage: 'repeating-linear-gradient(45deg, #fbbf24, #fbbf24 40px, #000000 40px, #000000 80px)',
          }}
        >
          <div className="text-black font-bold text-2xl text-center tracking-widest"
            style={{
              textShadow: '2px 2px 0 white, -2px -2px 0 white, 2px -2px 0 white, -2px 2px 0 white, 0 2px 0 white, 0 -2px 0 white, 2px 0 0 white, -2px 0 0 white'
            }}
          >
            ⚠️ WORK IN PROGRESS ⚠️ WORK IN PROGRESS ⚠️ WORK IN PROGRESS ⚠️
          </div>
        </div>
      </div>

      {/* WIP Caution Tape - Bottom */}
      <div className="absolute bottom-[15%] left-0 right-0 z-20 transform rotate-2 pointer-events-none">
        <div className="bg-yellow-400 border-t-4 border-b-4 border-black py-3 shadow-lg"
          style={{
            backgroundImage: 'repeating-linear-gradient(45deg, #fbbf24, #fbbf24 40px, #000000 40px, #000000 80px)',
          }}
        >
          <div className="text-black font-bold text-2xl text-center tracking-widest"
            style={{
              textShadow: '2px 2px 0 white, -2px -2px 0 white, 2px -2px 0 white, -2px 2px 0 white, 0 2px 0 white, 0 -2px 0 white, 2px 0 0 white, -2px 0 0 white'
            }}
          >
            ⚠️ WORK IN PROGRESS ⚠️ WORK IN PROGRESS ⚠️ WORK IN PROGRESS ⚠️
          </div>
        </div>
      </div>

      <div className="max-w-2xl w-full max-h-full flex items-center justify-center">
        <Image 
          src="/wip.jpg" 
          alt="Work in Progress" 
          width={560}
          height={420}
          className="max-w-full max-h-[calc(100vh-200px)] w-auto h-auto object-contain rounded-lg shadow-lg"
          priority
        />
      </div>
    </div>
  );
}

