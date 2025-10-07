'use client';

import { useState, useEffect } from 'react';

interface Project {
  id: string;
  name: string;
  handle: string;
  description: string;
  status: 'ACTIVE' | 'BETA' | 'IDLE';
  type: string;
  url: string;
}

export default function ProjectsPage() {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<string>('');
  
  useEffect(() => {
    setCurrentTime(new Date().toLocaleString());
  }, []);

  const projects: Project[] = [
    {
      id: 'tiktok',
      name: 'TIKTOK',
      handle: 'TakeIntoConsideration1',
      description: 'I aim to uplift and bring hope through this account. I also post random "funny" ideas I have. I try to be consistent. Follow me plz! :>',
      status: 'ACTIVE',
      type: 'SOCIAL_MEDIA',
      url: 'https://www.tiktok.com/@takeintoconsideration1'
    },
    {
      id: 'youtube',
      name: 'YOUTUBE',
      handle: 'Kevinmartinez-01',
      description: 'This is meant to be more personal and vlog type content. I definitely want to post more. Soon!!',
      status: 'ACTIVE',
      type: 'SOCIAL_MEDIA',
      url: 'https://www.youtube.com/@KevinMartinez-01'
    },
    {
      id: 'spotify-era',
      name: 'SPOTIFY ERA GENERATOR',
      handle: 'Vercel Website',
      description: 'This website analyzes your current most listened to songs on Spotify and generates an era based on your music taste. NOTE: In order to fully gain access you have to send me the email you use for spotify. I only have limited access to the Spotify api right now and have to manually add you through the developer dashboard. Yes, I know this is a bit sketchy but this is the only way you can currently access the site. Hopefully, if at least 20 people actively use the site then I can submit an application that lets others have access without having to send me their emails. Until then this is the only way. Email me in the resources tab!!',
      status: 'BETA',
      type: 'WEB_APPLICATION',
      url: 'https://spotify-era-generator.vercel.app/'
    },
          

      {
        id: 'website',
        name: 'STICKY NOTE WEBSITE',
        handle: 'Website',
        description: 'This is a side website that uses sticky notes as the format to display content. It is a major work in progress and I am burnt out on it currently. If you want more info you can check my youtube channel.',
        status: 'IDLE',
        type: 'WEB_APPLICATION',
        url: ''
      }
  ];

  const handleProjectClick = (projectId: string) => {
    setSelectedProject(selectedProject === projectId ? null : projectId);
  };

  return (
    <div className="bg-black text-orange-400 font-mono -m-8 min-h-[calc(100vh-140px)] rounded-lg overflow-hidden border-2 border-orange-400 shadow-2xl shadow-orange-400/50 relative">
      {/* 🎃 Halloween Decorations */}
      <div className="absolute top-4 left-4 text-3xl z-50 pointer-events-none animate-bounce" style={{ animationDuration: '2s' }}>
        🎃
      </div>
      <div className="absolute top-4 right-4 text-3xl z-50 pointer-events-none animate-bat-fly" style={{ animationDuration: '10s' }}>
        🦇
      </div>
      <div className="absolute bottom-4 left-4 text-2xl z-50 pointer-events-none animate-float" style={{ animationDuration: '4s' }}>
        👻
      </div>
      <div className="absolute bottom-4 right-4 text-2xl z-50 pointer-events-none">
        🕷️
      </div>
      
      {/* CRT Screen Effect */}
      <div className="relative h-full">
        {/* Scanlines overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="h-full w-full bg-gradient-to-b from-transparent via-orange-400/5 to-transparent animate-pulse"></div>
        </div>
        
        {/* Main terminal container */}
        <div className="bg-black relative overflow-hidden h-full">
          <div className="p-6 h-full">
          {/* Terminal header - Halloween themed */}
          <div className="flex items-center justify-between mb-6 border-b border-orange-400 pb-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-400 rounded-full animate-pulse"></div>
              <span className="text-orange-400 font-bold">🎃 SPOOKY_PROJECTS.EXE 👻</span>
            </div>
            <div className="text-xs text-orange-400/70">
              [{currentTime}]
            </div>
          </div>

          {/* Terminal prompt - Halloween themed */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <div className="text-orange-400">
                <span className="text-purple-300">root@kevinmartinez:~$</span> ls -l spooky_projects/
              </div>
              <button 
                onClick={() => window.open('https://github.com/theboxy', '_blank')}
                className="bg-orange-400/10 border border-orange-400/50 text-orange-400 px-3 py-1 rounded hover:bg-orange-400/20 hover:border-orange-400 transition-all duration-200 text-xs font-bold"
              >
                {'>'} GITHUB 🦇
              </button>
            </div>
            <div className="text-orange-400/80 text-sm mb-4">
              total {projects.length} known projects
            </div>
          </div>

          {/* Projects grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className={`border border-orange-400/50 bg-black/80 p-4 rounded cursor-pointer transition-all duration-300 hover:border-orange-400 hover:shadow-lg hover:shadow-orange-400/30 ${
                  selectedProject === project.id ? 'border-orange-400 shadow-lg shadow-orange-400/30' : ''
                } flex flex-col h-fit`}
                onClick={() => handleProjectClick(project.id)}
              >
                {/* Project header - Halloween themed */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                    <h3 className="text-orange-400 font-bold text-lg">
                      {project.name}
                    </h3>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    project.status === 'ACTIVE' ? 'bg-orange-400/20 text-orange-400' : 
                    project.status === 'BETA' ? 'bg-purple-400/20 text-purple-400' :
                    'bg-purple-500/20 text-purple-500'
                  }`}>
                    {project.status}
                  </span>
                </div>

                {/* Project info - Halloween themed */}
                <div className="space-y-2 mb-4">
                  <div className="text-orange-400/70 text-sm">
                    <span className="text-purple-300">Handle:</span> [{project.handle}]
                  </div>
                  <div className="text-orange-400/70 text-sm">
                    <span className="text-purple-300">Type:</span> {project.type.replace('_', ' ')}
                  </div>
                </div>

                {/* Expandable description */}
                {selectedProject === project.id && (
                  <div className="border-t border-orange-400/30 pt-3 mt-3 animate-in slide-in-from-top-2 duration-300">
                    <div className="text-orange-400/80 text-sm leading-relaxed">
                      {project.description}
                    </div>
                  </div>
                )}

                {/* Action buttons - Halloween themed */}
                <div className="mt-4 flex gap-3">
                  <button 
                    onClick={() => handleProjectClick(project.id)}
                    className="bg-orange-400/10 border border-orange-400/50 text-orange-400 px-4 py-2 rounded hover:bg-orange-400/20 hover:border-orange-400 transition-all duration-200 text-sm font-bold"
                  >
                    {'>'} INFO
                  </button>
                  {project.url && (
                    <button 
                      onClick={() => window.open(project.url, '_blank')}
                      className="bg-orange-400/10 border border-orange-400/50 text-orange-400 px-4 py-2 rounded hover:bg-orange-400/20 hover:border-orange-400 transition-all duration-200 text-sm font-bold"
                    >
                      {'>'} ACCESS PROJECT
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Terminal footer - Halloween themed */}
          <div className="mt-8 pt-4 border-t border-orange-400/30 text-orange-400/60 text-xs">
            <div className="flex justify-between items-center">
              <span>👻 Happy Halloween! 🎃</span>
              <span className="animate-pulse">_</span>
            </div>
          </div>
          </div>
        </div>
      </div>
      
      {/* Custom styles for the retro effect */}
      <style jsx>{`
        @keyframes crt-flicker {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.95; }
        }
        .crt-flicker {
          animation: crt-flicker 0.15s infinite linear;
        }
      `}</style>
    </div>
  );
} 