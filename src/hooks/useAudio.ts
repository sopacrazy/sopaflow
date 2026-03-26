import { useEffect, useRef } from "react";
import { usePlayerStore } from "../store/usePlayerStore";

export function useAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const setProgress = usePlayerStore((state) => state.setProgress);
  const nextTrack = usePlayerStore((state) => state.nextTrack);
  const togglePlayPause = usePlayerStore((state) => state.togglePlayPause);
  const currentTrack = usePlayerStore((state) => state.currentTrack);
  const isPlaying = usePlayerStore((state) => state.isPlaying);
  const volume = usePlayerStore((state) => state.volume);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }

    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      setProgress(audio.currentTime);
    };

    const handleEnded = () => {
      nextTrack();
    };

    const handleError = () => {
      const error = audio.error;
      console.error("Audio playback error:", error?.message || "Unknown error", error?.code);
      if (isPlaying) {
        // Only stop if it's a real fatal error
        // togglePlayPause(); 
      }
    };

    const handleCanPlay = () => {
      if (isPlaying) {
        audio.play().catch(console.error);
      }
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);
    audio.addEventListener("canplay", handleCanPlay);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
      audio.removeEventListener("canplay", handleCanPlay);
    };
  }, [nextTrack, setProgress, togglePlayPause, isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    if (audio.src !== currentTrack.audio) {
      console.log("Playing Track:", currentTrack.name, "URL:", currentTrack.audio);
      // Remove crossOrigin as it can block some CDN streams
      audio.removeAttribute("crossorigin");
      audio.src = currentTrack.audio;
      audio.load();
    }

    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          if (err.name !== "AbortError") {
             console.error("Playback failed:", err);
          }
        });
      }
    } else {
      audio.pause();
    }
  }, [currentTrack, isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setProgress(time);
    }
  };

  return { seek };
}
