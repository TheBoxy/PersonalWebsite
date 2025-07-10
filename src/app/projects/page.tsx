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
      description: 'This website analyzes your current most listened to songs on Spotify and generates an era based on your music taste. NOTE: In order to gain access you have to send me the email you use for spotify. I only have limited access to the Spotify api right now and have to manually add you through the developer dashboard. Yes, I know this is a bit sketchy but this is the only way you can currently access the site. Hopefully, if at least 20 people actively use the site then I can submit an application that lets others have access without having to send me their emails. Until then this is the only way. Email me in the resources tab!!',
      status: 'BETA',
      type: 'WEB_APPLICATION',
      url: 'https://spotify-era-generator.vercel.app/'
    },
          

      {
        id: 'website',
        name: 'STICKY NOTE WEBSITE',
        handle: 'Website',
        description: 'This is a side personal website. It is a work in progress and I am burnt out on it currently.',
        status: 'IDLE',
        type: 'WEB_APPLICATION',
        url: ''
      }
  ];

  const handleProjectClick = (projectId: string) => {
    setSelectedProject(selectedProject === projectId ? null : projectId);
  };

  return (
    <div className="bg-black text-green-400 font-mono -m-8 min-h-[calc(100vh-140px)] rounded-lg overflow-hidden border-2 border-green-400 shadow-2xl shadow-green-400/50">
      {/* CRT Screen Effect */}
      <div className="relative h-full">
        {/* Scanlines overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="h-full w-full bg-gradient-to-b from-transparent via-green-400/5 to-transparent animate-pulse"></div>
        </div>
        
        {/* Main terminal container */}
        <div className="bg-black relative overflow-hidden h-full">
          <div className="p-6 h-full">
          {/* Terminal header */}
          <div className="flex items-center justify-between mb-6 border-b border-green-400 pb-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 font-bold">PROJECTS.EXE</span>
            </div>
            <div className="text-xs text-green-400/70">
              [{currentTime}]
            </div>
          </div>

          {/* Terminal prompt */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <div className="text-green-400">
                <span className="text-green-300">root@kevinmartinez:~$</span> ls -l projects/
              </div>
              <button 
                onClick={() => window.open('https://github.com/theboxy', '_blank')}
                className="bg-green-400/10 border border-green-400/50 text-green-400 px-3 py-1 rounded hover:bg-green-400/20 hover:border-green-400 transition-all duration-200 text-xs font-bold"
              >
                {'>'} GITHUB
              </button>
            </div>
            <div className="text-green-400/80 text-sm mb-4">
              total {projects.length} known projects
            </div>
          </div>

          {/* Projects grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className={`border border-green-400/50 bg-black/80 p-4 rounded cursor-pointer transition-all duration-300 hover:border-green-400 hover:shadow-lg hover:shadow-green-400/30 ${
                  selectedProject === project.id ? 'border-green-400 shadow-lg shadow-green-400/30' : ''
                } flex flex-col h-fit`}
                onClick={() => handleProjectClick(project.id)}
              >
                {/* Project header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <h3 className="text-green-400 font-bold text-lg">
                      {project.name}
                    </h3>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    project.status === 'ACTIVE' ? 'bg-green-400/20 text-green-400' : 
                    project.status === 'BETA' ? 'bg-yellow-400/20 text-yellow-400' :
                    'bg-yellow-500/20 text-yellow-500'
                  }`}>
                    {project.status}
                  </span>
                </div>

                {/* Project info */}
                <div className="space-y-2 mb-4">
                  <div className="text-green-400/70 text-sm">
                    <span className="text-green-300">Handle:</span> [{project.handle}]
                  </div>
                  <div className="text-green-400/70 text-sm">
                    <span className="text-green-300">Type:</span> {project.type.replace('_', ' ')}
                  </div>
                </div>

                {/* Expandable description */}
                {selectedProject === project.id && (
                  <div className="border-t border-green-400/30 pt-3 mt-3 animate-in slide-in-from-top-2 duration-300">
                    <div className="text-green-400/80 text-sm leading-relaxed">
                      {project.description}
                    </div>
                  </div>
                )}

                {/* Action buttons */}
                <div className="mt-4 flex gap-3">
                  <button 
                    onClick={() => handleProjectClick(project.id)}
                    className="bg-green-400/10 border border-green-400/50 text-green-400 px-4 py-2 rounded hover:bg-green-400/20 hover:border-green-400 transition-all duration-200 text-sm font-bold"
                  >
                    {'>'} INFO
                  </button>
                  {project.url && (
                    <button 
                      onClick={() => window.open(project.url, '_blank')}
                      className="bg-green-400/10 border border-green-400/50 text-green-400 px-4 py-2 rounded hover:bg-green-400/20 hover:border-green-400 transition-all duration-200 text-sm font-bold"
                    >
                      {'>'} ACCESS PROJECT
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Terminal footer */}
          <div className="mt-8 pt-4 border-t border-green-400/30 text-green-400/60 text-xs">
            <div className="flex justify-between items-center">
              
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