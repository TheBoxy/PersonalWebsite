'use client';

import { useEffect, useState, useRef } from 'react';

interface YouTubeVideo {
  id: { videoId: string };
  snippet: {
    title: string;
    thumbnails: { medium: { url: string } };
    publishedAt: string;
  };
}

// YouTube Player types
interface YouTubePlayer {
  playVideo: () => void;
  pauseVideo: () => void;
  stopVideo: () => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  getPlayerState: () => number;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  setVolume: (volume: number) => void;
  getVolume: () => number;
  isMuted: () => boolean;
  mute: () => void;
  unMute: () => void;
  destroy?: () => void;
}

interface YouTubePlayerEvent {
  target: YouTubePlayer & {
    getDuration: () => number;
    setVolume: (volume: number) => void;
    playVideo: () => void;
  };
  data?: number;
}

interface YT {
  Player: new (elementId: string, config: {
    videoId: string;
    width: string;
    height: string;
    playerVars: Record<string, number>;
    events: {
      onReady: (event: YouTubePlayerEvent) => void;
      onStateChange: (event: YouTubePlayerEvent) => void;
    };
  }) => YouTubePlayer;
  PlayerState: {
    PLAYING: number;
    PAUSED: number;
    ENDED: number;
  };
}

declare global {
  interface Window {
    YT: YT;
    onYouTubeIframeAPIReady: () => void;
  }
}

export default function MusicPage() {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [currentVideo, setCurrentVideo] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [hasStartedPlaying, setHasStartedPlaying] = useState(false);
  const [volume, setVolume] = useState(75); // 0-100
  const [isMuted, setIsMuted] = useState(false);
  
  const playerRef = useRef<YouTubePlayer | null>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load YouTube IFrame API
  useEffect(() => {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
  }, []);

  // Fetch videos
  useEffect(() => {
    fetch('/api/youtube')
      .then(res => res.json())
      .then(data => {
        if (data.items) {
          setVideos(data.items);
          if (data.items.length > 0) {
            setCurrentVideo(data.items[0].id.videoId);
          }
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch videos:', err);
        setLoading(false);
      });
  }, []);

  // Initialize YouTube player when video changes and playing
  useEffect(() => {
    if (!currentVideo || !hasStartedPlaying) return;

    const initPlayer = () => {
      // Clear old player container
      if (playerContainerRef.current) {
        playerContainerRef.current.innerHTML = '';
      }

      // Create new div for player
      const playerDiv = document.createElement('div');
      playerDiv.id = 'youtube-player';
      playerDiv.style.width = '100%';
      playerDiv.style.height = '100%';
      playerContainerRef.current?.appendChild(playerDiv);

      if (window.YT && window.YT.Player) {
        playerRef.current = new window.YT.Player('youtube-player', {
          videoId: currentVideo,
          width: '100%',
          height: '100%',
          playerVars: {
            autoplay: 1,
            controls: 1,
            rel: 0,
            modestbranding: 1
          },
          events: {
            onReady: (event: YouTubePlayerEvent) => {
              const dur = event.target.getDuration();
              setDuration(dur);
              // Set initial volume
              event.target.setVolume(volume);
              event.target.playVideo();
              setIsPlaying(true);
              startProgressTracking();
            },
            onStateChange: (event: YouTubePlayerEvent) => {
              if (event.data === window.YT.PlayerState.PLAYING) {
                setIsPlaying(true);
                const dur = event.target.getDuration();
                setDuration(dur);
                startProgressTracking();
              } else if (event.data === window.YT.PlayerState.PAUSED) {
                setIsPlaying(false);
                stopProgressTracking();
              } else if (event.data === window.YT.PlayerState.ENDED) {
                setIsPlaying(false);
                stopProgressTracking();
                playNext();
              }
            }
          }
        });
      }
    };

    // Wait for API to be ready
    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = initPlayer;
    }

    return () => {
      stopProgressTracking();
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        try {
          playerRef.current.destroy();
        } catch {
          // Ignore cleanup errors
        }
      }
      playerRef.current = null;
    };
  }, [currentVideo, hasStartedPlaying]);

  const startProgressTracking = () => {
    stopProgressTracking();
    progressIntervalRef.current = setInterval(() => {
      if (playerRef.current) {
        try {
          const time = playerRef.current.getCurrentTime();
          const dur = playerRef.current.getDuration();
          setCurrentTime(time);
          setDuration(dur);
          setProgress(dur > 0 ? (time / dur) * 100 : 0);
          
          // Sync volume state from YouTube player
          const playerVolume = playerRef.current.getVolume();
          const playerMuted = playerRef.current.isMuted();
          
          // Update mute state if different
          if (playerMuted !== isMuted) {
            setIsMuted(playerMuted);
            // When unmuting, immediately sync volume
            if (!playerMuted && playerVolume > 0) {
              setVolume(Math.round(playerVolume));
            }
          }
          
          // Update volume if different (only when not transitioning mute states)
          if (Math.abs(playerVolume - volume) > 1) {
            setVolume(Math.round(playerVolume));
          }
        } catch {
          // Player might not be ready yet
        }
      }
    }, 100);
  };

  const stopProgressTracking = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const playVideo = (videoId: string) => {
    // Stop current playback and tracking
    stopProgressTracking();
    
    // Reset state
    setCurrentTime(0);
    setProgress(0);
    setDuration(0);
    
    // Set new video and start playing
    setCurrentVideo(videoId);
    setHasStartedPlaying(true);
    setIsPlaying(true);
  };


  const playNext = () => {
    const currentIndex = videos.findIndex(v => v.id.videoId === currentVideo);
    if (currentIndex < videos.length - 1 && currentIndex !== -1) {
      const nextVideo = videos[currentIndex + 1];
      stopProgressTracking();
      setCurrentTime(0);
      setProgress(0);
      setDuration(0);
      setCurrentVideo(nextVideo.id.videoId);
      setHasStartedPlaying(true);
      setIsPlaying(true);
    }
  };

  const playPrevious = () => {
    const currentIndex = videos.findIndex(v => v.id.videoId === currentVideo);
    if (currentIndex > 0) {
      const prevVideo = videos[currentIndex - 1];
      stopProgressTracking();
      setCurrentTime(0);
      setProgress(0);
      setDuration(0);
      setCurrentVideo(prevVideo.id.videoId);
      setHasStartedPlaying(true);
      setIsPlaying(true);
    }
  };

  const stopPlayback = () => {
    if (playerRef.current) {
      playerRef.current.stopVideo();
    }
    setIsPlaying(false);
    setHasStartedPlaying(false);
    setCurrentTime(0);
    setProgress(0);
  };

  const togglePlayPause = () => {
    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.pauseVideo();
        setIsPlaying(false);
      } else {
        playerRef.current.playVideo();
        setIsPlaying(true);
      }
    } else if (!hasStartedPlaying) {
      // First time playing
      setHasStartedPlaying(true);
      setIsPlaying(true);
    }
  };

  const seekTo = (percentage: number) => {
    if (playerRef.current && duration > 0) {
      try {
        const seekTime = (percentage / 100) * duration;
        playerRef.current.seekTo(seekTime, true);
        setCurrentTime(seekTime);
        setProgress(percentage);
      } catch (error) {
        console.error('Error seeking:', error);
      }
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!duration || !hasStartedPlaying) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    seekTo(percentage);
  };

  const handleVolumeChange = (newVolume: number) => {
    // Clamp volume between 0 and 100
    const clampedVolume = Math.max(0, Math.min(100, newVolume));
    setVolume(clampedVolume);
    
    if (playerRef.current) {
      playerRef.current.setVolume(clampedVolume);
      
      // Auto-unmute if volume is increased from 0
      if (clampedVolume > 0 && isMuted) {
        playerRef.current.unMute();
        setIsMuted(false);
      }
      // Auto-mute if volume is set to 0
      else if (clampedVolume === 0 && !isMuted) {
        playerRef.current.mute();
        setIsMuted(true);
      }
    }
  };

  const handleVolumeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    handleVolumeChange(percentage);
  };

  const toggleMute = () => {
    if (!playerRef.current) return;
    
    if (isMuted) {
      playerRef.current.unMute();
      setIsMuted(false);
      
      // Sync volume from YouTube player after unmuting
      try {
        const currentPlayerVolume = playerRef.current.getVolume();
        if (currentPlayerVolume > 0) {
          setVolume(Math.round(currentPlayerVolume));
        } else {
          // If player volume is 0, set to 75%
          handleVolumeChange(75);
        }
      } catch {
        // Fallback if can't get volume
        if (volume === 0) {
          handleVolumeChange(75);
        }
      }
    } else {
      playerRef.current.mute();
      setIsMuted(true);
    }
  };

  return (
    <div className="h-full w-full flex flex-col overflow-hidden relative">
      {/* 🎃 Halloween Decorations */}
      <div className="absolute top-4 left-4 text-3xl z-50 pointer-events-none animate-bounce" style={{ animationDuration: '2s' }}>
        🎃
      </div>
      <div className="absolute top-4 right-4 text-3xl z-50 pointer-events-none animate-pulse" style={{ animationDuration: '3s' }}>
        🦇
      </div>
      <div className="absolute bottom-20 right-4 text-3xl z-50 pointer-events-none" style={{ animation: 'float 5s ease-in-out infinite' }}>
        🎃
      </div>
      
      <div className="h-full flex flex-col overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #0C5A9E 0%, #1B5A9C 50%, #0D3D6B 100%)'
        }}
      >
        {/* WMP9 Title Bar with gradient */}
        <div className="px-3 py-1.5 flex items-center justify-between"
          style={{
            background: 'linear-gradient(180deg, #4A9EDE 0%, #1C68A8 50%, #0F4C85 100%)',
            borderBottom: '1px solid #083D6B'
          }}
        >
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 flex items-center justify-center">
              <div className="w-4 h-4 rounded-sm"
            style={{
                  background: 'linear-gradient(135deg, #FF6B00 0%, #FF8C00 30%, #3366FF 70%, #0047AB 100%)'
                }}
              ></div>
            </div>
            <span className="text-white text-sm font-bold drop-shadow-md" style={{ fontFamily: 'Tahoma, sans-serif' }}>
              Music Media Player
            </span>
          </div>
          <div className="flex gap-1">
            <button className="w-6 h-5 bg-gradient-to-b from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-xs flex items-center justify-center text-white font-bold border border-blue-800 rounded-sm shadow-sm">
              _
            </button>
            <button className="w-6 h-5 bg-gradient-to-b from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-xs flex items-center justify-center text-white font-bold border border-blue-800 rounded-sm shadow-sm">
              □
            </button>
            <button className="w-6 h-5 bg-gradient-to-b from-red-400 to-red-600 hover:from-red-500 hover:to-red-700 text-xs flex items-center justify-center text-white font-bold border border-red-800 rounded-sm shadow-sm">
              ×
            </button>
          </div>
        </div>

        {/* Menu Bar with icons */}
        <div className="px-2 py-1 bg-gradient-to-b from-gray-50 to-gray-200 border-b border-gray-400 shadow-sm">
          <div className="flex gap-3 text-xs text-gray-800" style={{ fontFamily: 'Tahoma, sans-serif' }}>
            <span className="hover:bg-blue-100 px-2 py-0.5 cursor-pointer rounded">File</span>
            <span className="hover:bg-blue-100 px-2 py-0.5 cursor-pointer rounded">View</span>
            <span className="hover:bg-blue-100 px-2 py-0.5 cursor-pointer rounded">Play</span>
            <span className="hover:bg-blue-100 px-2 py-0.5 cursor-pointer rounded">Tools</span>
            <span 
              className="hover:bg-blue-100 px-2 py-0.5 cursor-pointer rounded"
              onClick={() => window.open('https://www.youtube.com/watch?v=l60MnDJklnM', '_blank')}
            >
              Help
            </span>
        </div>
      </div>

        {/* LED Scrolling Banner - smaller on mobile */}
        <div 
          className="py-0.5 md:py-2 overflow-hidden relative"
          style={{
            background: 'linear-gradient(180deg, #0a0a15 0%, #000000 50%, #0a0a15 100%)',
            borderTop: '2px solid #1a1a2e',
            borderBottom: '2px solid #1a1a2e',
            boxShadow: 'inset 0 0 20px rgba(147, 197, 253, 0.2), 0 0 10px rgba(147, 197, 253, 0.3)'
          }}
        >
          <div 
            className="whitespace-nowrap inline-flex"
            style={{
              animation: 'scroll-banner 12s linear infinite'
            }}
          >
            <span 
              className="text-xs md:text-2xl font-bold tracking-wider"
              style={{ 
                fontFamily: 'Courier New, monospace',
                background: 'linear-gradient(90deg, #FFB5E8 0%, #B5DEFF 15%, #FFDDB5 30%, #D5AAFF 45%, #B5FFB9 60%, #FFD5B5 75%, #FFB5E8 90%, #B5DEFF 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: 'none',
                letterSpacing: '0.1em',
                filter: 'drop-shadow(0 0 8px rgba(255, 181, 232, 0.6)) drop-shadow(0 0 12px rgba(181, 222, 255, 0.6)) drop-shadow(0 0 16px rgba(255, 221, 181, 0.4))'
              }}
            >
              ★★★ MORE MUSIC COMING SOON!!! ★★★&nbsp;&nbsp;&nbsp;&nbsp;
            </span>
            <span 
              className="text-xs md:text-2xl font-bold tracking-wider"
              style={{ 
                fontFamily: 'Courier New, monospace',
                background: 'linear-gradient(90deg, #FFB5E8 0%, #B5DEFF 15%, #FFDDB5 30%, #D5AAFF 45%, #B5FFB9 60%, #FFD5B5 75%, #FFB5E8 90%, #B5DEFF 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: 'none',
                letterSpacing: '0.1em',
                filter: 'drop-shadow(0 0 8px rgba(255, 181, 232, 0.6)) drop-shadow(0 0 12px rgba(181, 222, 255, 0.6)) drop-shadow(0 0 16px rgba(255, 221, 181, 0.4))'
              }}
            >
              ★★★ MORE MUSIC COMING SOON!!! ★★★&nbsp;&nbsp;&nbsp;&nbsp;
            </span>
            <span 
              className="text-xs md:text-2xl font-bold tracking-wider"
              style={{ 
                fontFamily: 'Courier New, monospace',
                background: 'linear-gradient(90deg, #FFB5E8 0%, #B5DEFF 15%, #FFDDB5 30%, #D5AAFF 45%, #B5FFB9 60%, #FFD5B5 75%, #FFB5E8 90%, #B5DEFF 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: 'none',
                letterSpacing: '0.1em',
                filter: 'drop-shadow(0 0 8px rgba(255, 181, 232, 0.6)) drop-shadow(0 0 12px rgba(181, 222, 255, 0.6)) drop-shadow(0 0 16px rgba(255, 221, 181, 0.4))'
              }}
            >
              ★★★ MORE MUSIC COMING SOON!!! ★★★&nbsp;&nbsp;&nbsp;&nbsp;
            </span>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden"
          style={{
            background: 'linear-gradient(180deg, #0A4A7F 0%, #0D3D6B 100%)'
          }}
        >
          {/* Left Section - Video Player */}
          <div className="flex-none md:flex-1 flex flex-col md:min-h-0">
            {/* Video Display Area */}
            <div className="w-full h-[35vh] md:h-auto md:flex-1 bg-black flex items-center justify-center relative"
              style={{
                boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.8)'
              }}
            >
              {loading ? (
                <div className="text-blue-400 text-lg" style={{ fontFamily: 'Tahoma, sans-serif' }}>
                  Loading...
                </div>
              ) : hasStartedPlaying ? (
                <div ref={playerContainerRef} className="w-full h-full" />
              ) : currentVideo ? (
                <div 
                  className="relative w-full h-full cursor-pointer group"
                  onClick={() => {
                    setHasStartedPlaying(true);
                    setIsPlaying(true);
                  }}
                >
                  {/* Background Thumbnail - Full size with higher quality */}
                  <img 
                    src={`https://i.ytimg.com/vi/${currentVideo}/maxresdefault.jpg`}
                    alt="Video thumbnail"
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to medium quality if maxres doesn't exist
                      const target = e.target as HTMLImageElement;
                      target.src = `https://i.ytimg.com/vi/${currentVideo}/hqdefault.jpg`;
                    }}
                  />
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all">
                    <div 
                      className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 rounded-full flex items-center justify-center transition-transform group-hover:scale-110"
                      style={{
                        background: 'linear-gradient(135deg, #FF6B00 0%, #FF8C00 30%, #3366FF 70%, #0047AB 100%)',
                        boxShadow: '0 8px 40px rgba(255, 107, 0, 0.8)'
                      }}
                    >
                      <div className="text-white text-6xl md:text-7xl lg:text-8xl ml-2">▶</div>
                    </div>
                    <p className="text-white text-sm md:text-base mt-6 text-center px-4" style={{ fontFamily: 'Tahoma, sans-serif', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                     Click to play or <br />
                     Select a track from the songs list!
                    </p>
                  </div>
                </div>
              ) : videos.length > 0 ? (
                <div 
                  className="relative w-full h-full cursor-pointer group"
                  onClick={() => playVideo(videos[0].id.videoId)}
                >
                  {/* Background Thumbnail - Full size with higher quality */}
                  <img 
                    src={`https://i.ytimg.com/vi/${videos[0].id.videoId}/maxresdefault.jpg`}
                    alt="Video thumbnail"
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to medium quality if maxres doesn't exist
                      const target = e.target as HTMLImageElement;
                      target.src = `https://i.ytimg.com/vi/${videos[0].id.videoId}/hqdefault.jpg`;
                    }}
                  />
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all">
                    <div 
                      className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 rounded-full flex items-center justify-center transition-transform group-hover:scale-110"
                      style={{
                        background: 'linear-gradient(135deg, #FF6B00 0%, #FF8C00 30%, #3366FF 70%, #0047AB 100%)',
                        boxShadow: '0 8px 40px rgba(255, 107, 0, 0.8)'
                      }}
                    >
                      <div className="text-white text-6xl md:text-7xl lg:text-8xl ml-2">▶</div>
                    </div>
                    <p className="text-white text-sm md:text-base mt-6 text-center px-4" style={{ fontFamily: 'Tahoma, sans-serif', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                      Select a track from the songs list
                    </p>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Now Playing Info Bar */}
            <div className="px-3 md:px-4 py-1.5 md:py-2 bg-gradient-to-b from-gray-700 to-gray-800 border-t border-gray-900">
              <div 
                className={`text-white text-[10px] md:text-xs truncate ${currentVideo ? 'hover:underline cursor-pointer' : ''}`}
                style={{ fontFamily: 'Tahoma, sans-serif' }}
                onClick={() => currentVideo && window.open(`https://www.youtube.com/watch?v=${currentVideo}`, '_blank')}
                title={currentVideo ? "Open in YouTube" : ""}
              >
                {currentVideo && videos.find(v => v.id.videoId === currentVideo)?.snippet.title || 'No track selected'}
              </div>
            </div>
          </div>

          {/* Right Sidebar - Playlist */}
          <div className="w-full md:w-96 flex-1 md:flex-initial flex flex-col md:border-l-2 border-t-2 md:border-t-0 border-gray-700 overflow-hidden">
            {/* Playlist Header */}
            <div className="px-2 md:px-3 py-1.5 md:py-2.5"
              style={{
                background: 'linear-gradient(180deg, #4A9EDE 0%, #1C68A8 50%, #0F4C85 100%)',
                borderBottom: '1px solid #083D6B'
              }}
            >
              <h3 className="text-white text-xs md:text-sm font-bold drop-shadow" style={{ fontFamily: 'Tahoma, sans-serif' }}>
                Songs List
              </h3>
            </div>

            {/* Playlist Items */}
            <div className="flex-1 overflow-y-auto bg-white min-h-0"
            style={{
                backgroundImage: 'linear-gradient(to bottom, #FFFFFF 0%, #F0F0F0 100%)',
                WebkitOverflowScrolling: 'touch'
              }}
            >
              {loading ? (
                <div className="p-4 text-center text-gray-600 text-sm" style={{ fontFamily: 'Tahoma, sans-serif' }}>
                  Loading playlist...
                </div>
              ) : videos.length === 0 ? (
                <div className="p-4 text-center text-gray-600 text-sm" style={{ fontFamily: 'Tahoma, sans-serif' }}>
                  No videos found
                </div>
              ) : (
                <div>
                  {videos.map((video, index) => (
                    <div
                      key={video.id.videoId}
                      className={`px-2 py-2.5 md:py-2 cursor-pointer border-b border-gray-200 transition-colors ${
                        currentVideo === video.id.videoId 
                          ? 'bg-blue-100 border-l-4 border-l-blue-600' 
                          : 'hover:bg-blue-50'
                      }`}
                      onClick={() => playVideo(video.id.videoId)}
                      style={{ fontFamily: 'Tahoma, sans-serif' }}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold min-w-[18px] md:min-w-[20px] flex-shrink-0 ${
                          currentVideo === video.id.videoId ? 'text-blue-600' : 'text-gray-400'
                        }`}>
                          {currentVideo === video.id.videoId ? '▶' : `${index + 1}.`}
                        </span>
                        <img 
                          src={video.snippet.thumbnails.medium.url}
                          alt={video.snippet.title}
                          className="w-14 h-10 md:w-16 md:h-12 object-cover rounded flex-shrink-0 border border-gray-300"
                        />
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs leading-snug mb-1 line-clamp-2 ${
                            currentVideo === video.id.videoId ? 'text-blue-900 font-semibold' : 'text-gray-800'
                          }`}>
                            {video.snippet.title}
                          </p>
                          <p className="text-[10px] text-gray-500">
                            {new Date(video.snippet.publishedAt).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Control Bar - WMP9 Style */}
        <div className="px-2 md:px-4 py-2 md:py-3"
          style={{
            background: 'linear-gradient(180deg, #D4D4D4 0%, #B8B8B8 50%, #A0A0A0 100%)',
            borderTop: '1px solid #888888',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.5)'
          }}
        >
          <div className="flex items-center gap-1.5 md:gap-3">
            {/* Playback Controls */}
            <div className="flex gap-1">
              <button 
                onClick={playPrevious}
                disabled={videos.findIndex(v => v.id.videoId === currentVideo) === 0}
                className="w-8 h-8 md:w-9 md:h-9 rounded-full disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-white text-sm md:text-base font-bold shadow-lg transition-all active:scale-95"
                style={{
                  background: videos.findIndex(v => v.id.videoId === currentVideo) === 0 
                    ? 'linear-gradient(180deg, #6A8CAA 0%, #4A6C8A 100%)'
                    : 'linear-gradient(180deg, #6A9CFF 0%, #2563D4 100%)',
                  border: '1px solid rgba(0,0,0,0.3)',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.3)'
                }}
              >
                ⏮
              </button>
              <button 
                onClick={togglePlayPause}
                className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-white text-lg md:text-xl font-bold shadow-lg transition-all active:scale-95"
                style={{
                  background: isPlaying 
                    ? 'linear-gradient(180deg, #FFA040 0%, #FF6B00 100%)'
                    : 'linear-gradient(180deg, #5ADE5A 0%, #2BAD2B 100%)',
                  border: '1px solid rgba(0,0,0,0.3)',
                  boxShadow: '0 3px 6px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.4)'
                }}
              >
                {isPlaying ? '⏸' : '▶'}
              </button>
              <button 
                onClick={playNext}
                disabled={videos.findIndex(v => v.id.videoId === currentVideo) === videos.length - 1}
                className="w-8 h-8 md:w-9 md:h-9 rounded-full disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-white text-sm md:text-base font-bold shadow-lg transition-all active:scale-95"
                style={{
                  background: videos.findIndex(v => v.id.videoId === currentVideo) === videos.length - 1
                    ? 'linear-gradient(180deg, #6A8CAA 0%, #4A6C8A 100%)'
                    : 'linear-gradient(180deg, #6A9CFF 0%, #2563D4 100%)',
                  border: '1px solid rgba(0,0,0,0.3)',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.3)'
                }}
              >
                ⏭
              </button>
              <button 
                onClick={stopPlayback}
                className="w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center text-white text-sm md:text-base font-bold shadow-lg transition-all active:scale-95"
                style={{
                  background: 'linear-gradient(180deg, #FF7A7A 0%, #D43F3F 100%)',
                  border: '1px solid rgba(0,0,0,0.3)',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.3)'
                }}
              >
                ⏹
              </button>
            </div>

            {/* Seek/Progress Bar */}
            <div className="flex-1 px-1 md:px-2">
              <div 
                className="h-3 md:h-4 bg-gradient-to-b from-gray-300 to-gray-400 rounded-full border border-gray-500 overflow-hidden shadow-inner relative cursor-pointer"
                style={{
                  boxShadow: 'inset 0 2px 3px rgba(0,0,0,0.3)'
                }}
                onClick={handleProgressClick}
              >
                <div 
                  className="h-full bg-gradient-to-b from-blue-400 to-blue-600 rounded-full transition-all duration-100"
                  style={{
                    width: `${progress}%`,
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.3)'
                  }}
                ></div>
              </div>
            </div>

            {/* Volume Control */}
            <div className="hidden md:flex items-center gap-2">
              <button 
                onClick={toggleMute}
                className="text-gray-700 text-lg hover:text-gray-900 hover:scale-110 transition-all cursor-pointer"
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted || volume === 0 ? '🔇' : volume < 50 ? '🔉' : '🔊'}
              </button>
              <div 
                className="w-20 lg:w-24 h-3 bg-gradient-to-b from-gray-300 to-gray-400 rounded-full border border-gray-500 overflow-hidden shadow-inner cursor-pointer"
                style={{
                  boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.3)'
                }}
                onClick={handleVolumeClick}
              >
                <div 
                  className="h-full bg-gradient-to-b from-green-400 to-green-600 rounded-full transition-all duration-100" 
                  style={{ 
                    width: `${volume}%`,
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.3)'
                  }}
                ></div>
              </div>
            </div>

            {/* Time Display */}
            <div className="hidden sm:block text-xs text-gray-700 font-mono bg-gray-200 px-2 py-1 rounded border border-gray-400"
              style={{
                fontFamily: 'Courier New, monospace',
                boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.2)'
              }}
            >
              {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>
      </div>

        {/* Status Bar */}
        <div className="px-3 py-1 bg-gradient-to-b from-gray-300 to-gray-400 border-t border-gray-500 flex items-center justify-between text-xs"
          style={{
            fontFamily: 'Tahoma, sans-serif',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.3)'
          }}
        >
          <span className="text-gray-700 truncate">
            {videos.length} item{videos.length !== 1 ? 's' : ''} in playlist
          </span>
          <span className="text-gray-700 hidden sm:inline">Ready</span>
        </div>
      </div>

      {/* Halloween Animation Styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes scroll-banner {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
      `}</style>
    </div>
  );
}

