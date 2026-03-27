import { useRef, useState, useEffect } from "react";
import { usePlayerStore } from "../store/usePlayerStore";

export function VolumeControl() {
  const { volume, setVolume } = usePlayerStore();
  const [isDragging, setIsDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  const percentage = volume * 100;

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    updateVolumeFromEvent(e);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDragging) {
      updateVolumeFromEvent(e);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false);
      updateVolumeFromEvent(e);
    }
  };

  const updateVolumeFromEvent = (e: React.PointerEvent | PointerEvent) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const newVolume = x / rect.width;
    setVolume(newVolume);
  };

  useEffect(() => {
    const handleGlobalPointerUp = (e: PointerEvent) => {
      if (isDragging) {
        setIsDragging(false);
        updateVolumeFromEvent(e);
      }
    };

    const handleGlobalPointerMove = (e: PointerEvent) => {
      if (isDragging) {
        updateVolumeFromEvent(e);
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
  }, [isDragging, setVolume]);

  return (
    <div
      ref={trackRef}
      className="relative w-24 h-1 bg-zinc-800 rounded-full cursor-pointer group"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <div
        className="absolute top-0 left-0 h-full bg-[#20D760] rounded-full transition-colors"
        style={{ width: `${percentage}%` }}
      />
      <div
        className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ left: `calc(${percentage}% - 6px)` }}
      />
    </div>
  );
}
