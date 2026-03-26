import { useEffect, useRef, useState } from "react";
import { usePlayerStore } from "../store/usePlayerStore";
import { formatTime } from "../utils/formatTime";

interface ProgressBarProps {
  duration: number;
  onSeek: (time: number) => void;
}

export function ProgressBar({ duration, onSeek }: ProgressBarProps) {
  const progress = usePlayerStore((state) => state.progress);
  const [isDragging, setIsDragging] = useState(false);
  const [dragProgress, setDragProgress] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  const displayProgress = isDragging ? dragProgress : progress;
  const percentage = duration > 0 ? (displayProgress / duration) * 100 : 0;

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    updateProgressFromEvent(e);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDragging) {
      updateProgressFromEvent(e);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false);
      const newTime = updateProgressFromEvent(e);
      if (newTime !== undefined) {
        onSeek(newTime);
      }
    }
  };

  const updateProgressFromEvent = (e: React.PointerEvent) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percentage = x / rect.width;
    const newTime = percentage * duration;
    setDragProgress(newTime);
    return newTime;
  };

  useEffect(() => {
    const handleGlobalPointerUp = () => {
      if (isDragging) {
        setIsDragging(false);
        onSeek(dragProgress);
      }
    };

    const handleGlobalPointerMove = (e: PointerEvent) => {
      if (isDragging && trackRef.current) {
        const rect = trackRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
        const percentage = x / rect.width;
        setDragProgress(percentage * duration);
      }
    };

    if (isDragging) {
      window.addEventListener("pointerup", handleGlobalPointerUp);
      window.addEventListener("pointermove", handleGlobalPointerMove);
    }

    return () => {
      window.removeEventListener("pointerup", handleGlobalPointerUp);
      window.removeEventListener("pointermove", handleGlobalPointerMove);
    };
  }, [isDragging, dragProgress, duration, onSeek]);

  return (
    <div className="flex items-center gap-2 w-full text-xs text-zinc-400 font-mono">
      <span className="w-10 text-right">{formatTime(displayProgress)}</span>
      
      <div
        ref={trackRef}
        className="relative flex-1 h-1.5 bg-zinc-800 rounded-full cursor-pointer group"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <div
          className="absolute top-0 left-0 h-full bg-indigo-500 rounded-full group-hover:bg-indigo-400 transition-colors"
          style={{ width: `${percentage}%` }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ left: `calc(${percentage}% - 6px)` }}
        />
      </div>

      <span className="w-10">{formatTime(duration)}</span>
    </div>
  );
}
