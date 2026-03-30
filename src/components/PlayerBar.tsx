import { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { Play, Pause, SkipBack, SkipForward, Repeat, Shuffle, Volume2, VolumeX, Loader2, ChevronDown, ChevronUp, Heart, MoreHorizontal } from "lucide-react";
import { usePlayerStore } from "../store/usePlayerStore";
import { useFavoritesStore } from "../store/useFavoritesStore";
import { ProgressBar } from "./ProgressBar";
import { VolumeControl } from "./VolumeControl";
import { formatTime } from "../utils/formatTime";
import { cn } from "../utils/cn";
import axios from "axios";
import { toast } from "sonner";

export function PlayerBar() {
  const {
    currentTrack,
    isPlaying,
    togglePlayPause,
    nextTrack,
    prevTrack,
    isRepeating,
    toggleRepeat,
    isShuffling,
    toggleShuffle,
    volume,
    setVolume,
    progress,
    setProgress,
    youtubeUrl,
    setYoutubeUrl,
    isLoadingAudio,
    setLoadingAudio,
    plan,
    canSkip,
    registerSkip
  } = usePlayerStore();
  
  const { isFavorite, toggleFavorite } = useFavoritesStore();

  const playerRef = useRef<any>(null);
  const [duration, setDuration] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  // Search for the full YouTube song when the track changes
  useEffect(() => {
    if (!currentTrack) return;

    const findFullAudio = async () => {
      setLoadingAudio(true);
      setYoutubeUrl(null); // Clear the player so it doesn't play old track or trigger early

      try {
        const query = `${currentTrack.name} ${currentTrack.artist} official audio`;
        console.log("SEARCHING:", query);
        
        // Use relative /api endpoint in production (Vercel) and localhost:3001 in development
        const env = (import.meta as any).env;
        const apiUrl = env?.MODE === 'development' ? 'http://localhost:3001' : '';
        const response = await axios.get(`${apiUrl}/api/search-youtube`, {
          params: { q: query },
          timeout: 5000 
        });
        
        if (response.data.url) {
          console.log("FULL AUDIO FOUND:", response.data.url);
          setYoutubeUrl(response.data.url);
          if (response.data.duration) setDuration(response.data.duration);
        } else {
          console.warn("Using fallback audio (No URL found on YouTube)");
          setYoutubeUrl(currentTrack.audio);
          setDuration(30);
        }
      } catch (err) {
        console.warn("Using fallback audio (Server might be off)");
        setYoutubeUrl(currentTrack.audio);
        setDuration(30);
      } finally {
        setLoadingAudio(false);
      }
    };

    findFullAudio();
  }, [currentTrack?.id]);

  // Media Session API for mobile lock-screen and background controls
  useEffect(() => {
    if (!currentTrack || !('mediaSession' in navigator)) return;

    // Update metadata
    navigator.mediaSession.metadata = new MediaMetadata({
      title: currentTrack.name,
      artist: currentTrack.artist,
      album: currentTrack.album || "SopaFlow",
      artwork: [
        { src: currentTrack.image || "", sizes: '96x96', type: 'image/jpeg' },
        { src: currentTrack.image || "", sizes: '128x128', type: 'image/jpeg' },
        { src: currentTrack.image || "", sizes: '192x192', type: 'image/jpeg' },
        { src: currentTrack.image || "", sizes: '256x256', type: 'image/jpeg' },
        { src: currentTrack.image || "", sizes: '384x384', type: 'image/jpeg' },
        { src: currentTrack.image || "", sizes: '512x512', type: 'image/jpeg' },
      ]
    });

    // Update playback state
    navigator.mediaSession.playbackState = isPlaying ? "playing" : "paused";

    // Set action handlers
    navigator.mediaSession.setActionHandler('play', () => togglePlayPause());
    navigator.mediaSession.setActionHandler('pause', () => togglePlayPause());
    navigator.mediaSession.setActionHandler('previoustrack', () => prevTrack());
    navigator.mediaSession.setActionHandler('nexttrack', () => {
      if (canSkip()) {
        registerSkip();
        nextTrack();
      } else {
        toast.error("Limite de pulos atingido!");
      }
    });

    // Seek handlers (Optional)
    navigator.mediaSession.setActionHandler('seekto', (details) => {
        if (details.seekTime !== undefined) handleSeek(details.seekTime);
    });

    // Update position state for the system progress bar
    if ('setPositionState' in navigator.mediaSession) {
        try {
            navigator.mediaSession.setPositionState({
                duration: duration || currentTrack.duration || 0,
                playbackRate: isPlaying ? 1 : 0,
                position: progress || 0,
            });
        } catch (e) {
            // Silently fail if state is invalid
        }
    }

  }, [currentTrack, isPlaying, youtubeUrl, canSkip, nextTrack, prevTrack, registerSkip, togglePlayPause, duration, progress]);

  if (!currentTrack) return null;

  const handleSeek = (time: number) => {
    if (playerRef.current) {
        playerRef.current.seekTo(time, "seconds");
        setProgress(time);
    }
  };

  const handleOnProgress = (state: any) => {
    if (state.playedSeconds !== undefined) {
       setProgress(state.playedSeconds);
       
       // Limit to 1 minute for FREE users
       if (plan === 'free' && state.playedSeconds >= 60) {
         if (isPlaying) {
            togglePlayPause();
            toast.error("O plano Free permite ouvir apenas 1 minuto de cada música. Faça o upgrade para o Premium!", {
              duration: 5000,
              description: "Assine agora para ouvir músicas completas!"
            });
         }
       }
    }
  };

  const Player = ReactPlayer as any;

  return (
    <>
      {/* Full Screen Mobile Player Overlay */}
      {isExpanded && (
        <div className="fixed inset-0 z-[100] bg-zinc-950 flex flex-col p-6 pt-12 animate-in slide-in-from-bottom-[100%] duration-300">
          <button 
            onClick={() => setIsExpanded(false)}
            className="absolute top-6 left-6 text-white p-2 z-10"
          >
            <ChevronDown className="w-8 h-8" />
          </button>
          
          <div className="flex-1 flex flex-col items-center justify-center gap-8 mt-10">
            <div className="w-full max-w-[320px] aspect-square rounded-2xl overflow-hidden shadow-2xl bg-zinc-800">
              {currentTrack.image && (
                <img
                    src={currentTrack.image}
                    alt={currentTrack.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                />
              )}
            </div>
            
            <div className="w-full flex flex-col items-start gap-1">
              <h2 className="text-2xl font-bold text-white line-clamp-1">{currentTrack.name}</h2>
              <p className="text-lg text-zinc-400 line-clamp-1">{currentTrack.artist}</p>
            </div>

            <div className="w-full flex items-center justify-center text-xs font-medium tabular-nums text-zinc-400 gap-2 mb-2">
              <ProgressBar 
                  duration={duration || currentTrack.duration} 
                  onSeek={handleSeek} 
              />
            </div>

            <div className="w-full max-w-[400px] flex justify-between items-center mt-2 px-2">
               <button onClick={toggleShuffle} className={cn("p-2 transition-colors", isShuffling ? "text-green-500" : "text-zinc-400 hover:text-white")}>
                 <Shuffle className="w-6 h-6" />
               </button>
               <button onClick={prevTrack} className="text-zinc-100 hover:text-white p-2 transition-colors">
                 <SkipBack className="w-10 h-10 fill-current" />
               </button>
               <button
                 onClick={togglePlayPause}
                 className="w-20 h-20 flex items-center justify-center rounded-full bg-green-500 text-black shadow-lg hover:scale-105 active:scale-95 transition-all"
               >
                 {isLoadingAudio ? (
                   <Loader2 className="w-8 h-8 animate-spin" />
                 ) : isPlaying ? (
                   <Pause className="w-8 h-8 fill-current" />
                 ) : (
                   <Play className="w-8 h-8 fill-current ml-2" />
                 )}
               </button>
               <button onClick={nextTrack} className="text-zinc-100 p-2 hover:text-white transition-colors">
                 <SkipForward className="w-10 h-10 fill-current" />
               </button>
               <button onClick={toggleRepeat} className={cn("p-2 transition-colors", isRepeating ? "text-green-500" : "text-zinc-400 hover:text-white")}>
                 <Repeat className="w-6 h-6" />
               </button>
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-[80px] md:bottom-0 left-0 md:left-[260px] right-0 z-[60] bg-[#121212] border-t border-zinc-900 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] sm:rounded-tl-3xl px-4 sm:px-8 py-3 h-[72px] sm:h-[100px] mb-[env(safe-area-inset-bottom,0)]">
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between gap-4 h-full">
        
        {/* Invisible Player - NOT using display:none because it can block audio/video playback */}
        <div 
          className="fixed opacity-0 pointer-events-none" 
          style={{ width: '300px', height: '300px', zIndex: -50, top: 0, left: 0 }}
        >
           {youtubeUrl && (
              <Player
                ref={playerRef}
                url={youtubeUrl}
                playing={isPlaying}
                volume={volume}
                onProgress={handleOnProgress}
                onDuration={(d: number) => setDuration(d)}
                onEnded={() => nextTrack()}
                onError={(e: any) => console.error("Player error:", e)}
                onReady={() => console.log("Player is ready to play", youtubeUrl)}
                onPlay={() => console.log("Player started playing")}
                onPause={() => console.log("Player paused")}
                width="100%"
                height="100%"
                config={{
                   youtube: {
                      playerVars: { autoplay: 0, controls: 0, disablekb: 1 }
                   }
                }}
              />
           )}
        </div>

        {/* Track Info */}
        <div 
           className="flex items-center gap-4 w-full sm:w-[30%] min-w-0 cursor-pointer group"
           onClick={() => setIsExpanded(true)}
        >
          <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-xl overflow-hidden flex-shrink-0 bg-zinc-800 shadow-md transform transition-transform group-hover:scale-105">
            {currentTrack.image && (
                <img
                    src={currentTrack.image}
                    alt={currentTrack.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                />
            )}
          </div>
          <div className="flex flex-col min-w-0 pr-2 sm:pr-0 flex-1">
            <span className="text-sm font-bold text-white truncate">
              {currentTrack.name}
              <span className="text-zinc-400 font-normal ml-1 hidden sm:inline">- {currentTrack.artist}</span>
            </span>
            <div className="flex items-center gap-2 mt-1">
               <span className="text-xs text-zinc-400 font-semibold tracking-wide">
                 {formatTime(progress)} / {formatTime(duration || currentTrack.duration)}
               </span>
               <button 
                 onClick={(e) => { e.stopPropagation(); toggleFavorite(currentTrack); }}
                 className="p-1 hover:bg-zinc-800 rounded-full transition-colors hidden sm:block"
               >
                 <Heart className={cn("w-3.5 h-3.5", isFavorite(currentTrack.id) ? "fill-[#20D760] text-[#20D760]" : "text-zinc-500 hover:text-white")} />
               </button>
            </div>
          </div>

          {/* Mobile Player Controls (hidden on sm+) */}
          <div className="sm:hidden flex items-center gap-3">
            <button
              onClick={(e) => { e.stopPropagation(); prevTrack(); }}
              className="p-2 text-zinc-400 active:text-white transition-colors"
            >
              <SkipBack className="w-5 h-5 fill-current" />
            </button>

            <button
                onClick={(e) => { e.stopPropagation(); togglePlayPause(); }}
                className="w-10 h-10 flex items-center justify-center rounded-full text-black bg-[#20D760] shadow-[0_4px_10px_rgba(34,197,94,0.2)] active:scale-95 transition-transform"
            >
                {isLoadingAudio ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : isPlaying ? (
                  <Pause className="w-5 h-5 fill-current" />
                ) : (
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                )}
            </button>

            <button
              onClick={(e) => { 
                e.stopPropagation();
                if (canSkip()) {
                  registerSkip();
                  nextTrack();
                } else {
                  toast.error("Limite de pulos atingido!", {
                    description: "Upgrade para Premium para pulos ilimitados!",
                  });
                }
              }}
              className="p-2 text-zinc-400 active:text-white transition-colors"
            >
              <SkipForward className="w-5 h-5 fill-current" />
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="hidden sm:flex items-center justify-center w-[40%] max-w-[700px]">
          <div className="flex items-center gap-8">
            <button
              onClick={toggleShuffle}
              className={cn(
                "p-2 transition-colors",
                isShuffling ? "text-[#20D760]" : "text-zinc-400 hover:text-white"
              )}
            >
              <Shuffle className="w-5 h-5" />
            </button>
            
            <button
              onClick={prevTrack}
              className="text-zinc-400 hover:text-white transition-colors"
            >
              <SkipBack className="w-6 h-6 fill-current" />
            </button>
            
            <button
              onClick={togglePlayPause}
              className="w-[52px] h-[52px] flex items-center justify-center rounded-full bg-[#20D760] text-black hover:scale-105 active:scale-95 transition-all shadow-[0_4px_20px_rgba(34,197,94,0.2)] disabled:opacity-50"
            >
              {isLoadingAudio ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : isPlaying ? (
                <Pause className="w-6 h-6 fill-current" />
              ) : (
                <Play className="w-6 h-6 fill-current ml-1" />
              )}
            </button>
            
            <button
              onClick={() => {
                if (canSkip()) {
                  registerSkip();
                  nextTrack();
                } else {
                  toast.error("Limite de pulos atingido!", {
                    description: "Você pode pular 4 músicas por hora no plano Free. Upgrade para Premium para pulos ilimitados!",
                  });
                }
              }}
              className="text-zinc-400 hover:text-white transition-colors"
            >
              <SkipForward className="w-6 h-6 fill-current" />
            </button>
            
            <button
              onClick={toggleRepeat}
              className={cn(
                "p-2 transition-colors",
                isRepeating ? "text-[#20D760]" : "text-zinc-400 hover:text-white"
              )}
            >
              <Repeat className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Extra Controls */}
        <div className="hidden sm:flex items-center justify-end w-[30%] gap-4">
          <button className="text-zinc-400 hover:text-white transition-colors">
            <MoreHorizontal className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setVolume(volume === 0 ? 0.8 : 0)}
              className="text-zinc-400 hover:text-white transition-colors"
            >
              {volume === 0 ? (
                <VolumeX className="w-5 h-5" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
            </button>
            <div className="w-20 mt-1">
              <VolumeControl />
            </div>
          </div>
          <button 
             onClick={() => setIsExpanded(true)} 
             className="w-8 h-8 flex items-center justify-center rounded-full border border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors ml-2"
          >
            <ChevronUp className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
    </>
  );
}
