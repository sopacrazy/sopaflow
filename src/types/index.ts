export interface Track {
  id: string;
  name: string;
  artist: string; // We'll consolidate primary artists here
  album: string;
  image: string; // We'll take the highest quality image
  audio: string; // We'll take the highest quality audio (320kbps)
  duration: number;
}
