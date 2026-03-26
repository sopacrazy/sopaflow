import { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { Play, Pause, SkipBack, SkipForward, Repeat, Shuffle, Volume2, VolumeX, Loader2, ChevronDown } from "lucide-react";
import { usePlayerStore } from "../store/usePlayerStore";
import { ProgressBar } from "./ProgressBar";
import { VolumeControl } from "./VolumeControl";
import { cn } from "../utils/cn";
import axios from "axios";

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
    setLoadingAudio
  } = usePlayerStore();

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
        // Try our local backend server
        const response = await axios.get(`http://localhost:3001/api/search-youtube`, {
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

      <div className="fixed bottom-0 left-0 right-0 z-50 bg-black border-t border-zinc-900 px-2 sm:px-4 py-3 h-[72px] sm:h-24">
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
                      playerVars: { autoplay: 1, controls: 0, disablekb: 1 }
                   }
                }}
              />
           )}
        </div>

        {/* Track Info */}
        <div 
           className="flex items-center gap-3 sm:gap-4 w-full sm:w-[30%] min-w-0 cursor-pointer"
           onClick={() => setIsExpanded(true)}
        >
          <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-md overflow-hidden flex-shrink-0 bg-zinc-800 shadow-xl">
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
            <span className="text-sm font-semibold text-white truncate hover:underline">
              {currentTrack.name}
            </span>
            <span className="text-xs text-zinc-400 truncate hover:underline">
              {currentTrack.artist}
            </span>
          </div>

          {/* Mobile Play/Pause (hidden on sm+) */}
          <button
              onClick={(e) => { e.stopPropagation(); togglePlayPause(); }}
              className="sm:hidden w-12 h-12 flex items-center justify-center rounded-full text-white bg-transparent active:scale-95 transition-transform"
          >
              {isLoadingAudio ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : isPlaying ? (
                <Pause className="w-6 h-6 fill-current" />
              ) : (
                <Play className="w-6 h-6 fill-current" />
              )}
          </button>
        </div>

        {/* Controls & Progress */}
        <div className="hidden sm:flex flex-col items-center w-[40%] max-w-[700px] gap-2">
          <div className="flex items-center gap-6">
            <button
              onClick={toggleShuffle}
              className={cn(
                "p-1.5 rounded-full transition-colors",
                isShuffling ? "text-green-500" : "text-zinc-400 hover:text-white"
              )}
            >
              <Shuffle className="w-4 h-4" />
            </button>
            
            <button
              onClick={prevTrack}
              className="text-zinc-400 hover:text-white transition-colors"
            >
              <SkipBack className="w-6 h-6 fill-current" />
            </button>
            
            <button
              onClick={togglePlayPause}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-black hover:scale-105 active:scale-95 transition-all shadow-md disabled:opacity-50"
            >
              {isLoadingAudio ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : isPlaying ? (
                <Pause className="w-5 h-5 fill-current" />
              ) : (
                <Play className="w-5 h-5 fill-current ml-1" />
              )}
            </button>
            
            <button
              onClick={nextTrack}
              className="text-zinc-400 hover:text-white transition-colors"
            >
              <SkipForward className="w-6 h-6 fill-current" />
            </button>
            
            <button
              onClick={toggleRepeat}
              className={cn(
                "p-1.5 rounded-full transition-colors",
                isRepeating ? "text-green-500" : "text-zinc-400 hover:text-white"
              )}
            >
              <Repeat className="w-4 h-4" />
            </button>
          </div>
          
          <div className="w-full flex items-center gap-2 text-xs font-medium tabular-nums text-zinc-400">
             <ProgressBar 
                duration={duration || currentTrack.duration} 
                onSeek={handleSeek} 
             />
          </div>
        </div>

        {/* Volume Control */}
        <div className="hidden sm:flex items-center justify-end w-[30%] gap-3">
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
          <div className="w-24">
            <VolumeControl />
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
