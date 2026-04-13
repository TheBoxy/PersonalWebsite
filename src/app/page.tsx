"use client";

import Image from "next/image";

export default function HomePage() {
  return (
    <div className="relative">
      {/* Flying Plane with Love Banner — flies over the content */}
      <div className="absolute inset-x-0 top-2 overflow-hidden pointer-events-none" style={{ height: '50px', zIndex: 50 }}>
        <a
          href="https://www.youtube.com/watch?v=FyKrICbnG7o"
          target="_blank"
          rel="noopener noreferrer"
          className="fly-plane absolute flex items-center will-change-transform cursor-pointer pointer-events-auto"
          style={{ top: '10px', left: '0px' }}
        >
          {/* Banner (trailing behind the plane) */}
          <div
            className="banner-flutter relative text-white px-5 py-1.5 font-bold text-sm whitespace-nowrap rounded-sm"
            style={{
              background: 'linear-gradient(135deg, #f43f5e 0%, #ec4899 50%, #f43f5e 100%)',
              textShadow: '0 1px 2px rgba(0,0,0,0.3)',
              boxShadow: '0 2px 10px rgba(244,63,94,0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
              borderTop: '1px solid rgba(255,255,255,0.3)',
              borderBottom: '1px solid rgba(190,18,60,0.4)',
            }}
          >
            A.E.G 1000% &hearts;
            {/* Banner tail notch */}
            <svg
              className="absolute top-0 -left-[11px]"
              width="12"
              height="100%"
              viewBox="0 0 12 32"
              preserveAspectRatio="none"
              style={{ height: '100%' }}
            >
              <polygon points="12,0 12,32 0,16" fill="#f43f5e" />
            </svg>
          </div>

          {/* Rope connecting banner to plane */}
          <svg width="35" height="12" viewBox="0 0 35 12" className="flex-shrink-0">
            <path
              d="M0 6 C8 3, 16 9, 24 5 C28 3, 32 6, 35 6"
              stroke="#94a3b8"
              strokeWidth="1.5"
              fill="none"
              strokeDasharray="4 2"
            />
          </svg>

          {/* Airplane */}
          <svg
            width="44"
            height="30"
            viewBox="0 0 44 30"
            className="flex-shrink-0"
            style={{ filter: 'drop-shadow(1px 2px 3px rgba(0,0,0,0.15))' }}
          >
            <g transform="translate(0, 3)">
              <ellipse cx="24" cy="12" rx="17" ry="3.5" fill="#3B82F6" />
              <path d="M18 12 L25 2 L28 2.5 L23 12 L28 21.5 L25 22 Z" fill="#2563EB" />
              <path d="M8 12 L11 6.5 L13 7 L11 12 L13 17 L11 17.5 Z" fill="#2563EB" />
              <ellipse cx="37" cy="11.5" rx="2.8" ry="2" fill="#BFDBFE" />
              <rect x="40" y="7.5" width="2" height="9" rx="1" fill="#1E40AF" />
            </g>
          </svg>
        </a>
      </div>

      {/* Social Media Profile Layout */}
      <div className="max-w-7xl mx-auto">
        {/* Profile and About Side by Side */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Profile Header */}
          <div className="lg:w-1/3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 md:p-8 shadow-lg border-2 border-blue-300 relative overflow-hidden">
            <div className="flex flex-col items-center text-center">
              {/* Profile Picture */}
              <div className="mb-6">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-white p-1 shadow-lg border-4 border-blue-300 overflow-hidden">
                  <Image 
                    src="/images/photo.png" 
                    alt="Kevin Martinez" 
                    width={160} 
                    height={160} 
                    className="w-full h-full object-cover"
                    style={{ transform: 'scale(1.3) translateY(-8%)', objectPosition: '40% 100%' }}
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
                  <span className="inline-block bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg border border-blue-300/50 tracking-wide">
                    Human 👤
                  </span>
                  <span 
                    className="inline-block bg-gradient-to-r from-indigo-500 to-blue-400 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg border border-indigo-300/50 tracking-wide cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => window.open('https://www.youtube.com/watch?v=9v8xOmOXXIU', '_blank')}
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
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-300">
              <p className="text-center text-gray-700 font-medium">
                📂 <strong>Explore the folders above</strong> to discover my latest projects, thoughts, and resources! 🚀
              </p>
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-gray-700 text-2xl font-bold">
                Be who you want to be!
              </p>
              <p></p>
              <p className="text-gray-700 text-2xl font-bold">
              Remember, you are goated!
              </p>
              <p className="text-gray-700 text-2xl font-bold">
              Drink your water!
              </p>
              <p className="text-gray-700 text-2xl font-bold">
               If it&apos;s meant for you, it will find you!
              </p>
            </div>
          </div>
        </div>
        
        
      </div>
    </div>
  );
}
