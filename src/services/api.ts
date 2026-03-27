import { Track } from "../types";
import axios from "axios";

export const jamendoApi = {
  // Use iTunes API for high-quality metadata of famous artists (No key needed)
  async searchTracks(query: string, limit = 20): Promise<Track[]> {
    try {
      if (!query || query === "trending") query = "Top Hits";
      
      const response = await axios.get(`https://itunes.apple.com/search`, {
        params: {
          term: query,
          media: "music",
          limit: limit,
          entity: "song"
        }
      });

      const results = response.data.results || [];
      
      return results.map((track: any) => {
        // Use 300x300 cover instead of 600x600 to load much faster
        const optimizedImage = track.artworkUrl100.replace("100x100bb.jpg", "300x300bb.jpg");
        
        return {
          id: track.trackId.toString(),
          name: track.trackName,
          artist: track.artistName,
          album: track.collectionName || "Single",
          image: optimizedImage,
          // For now we don't have the YouTube URL here, 
          // we'll resolve it when the user clicks Play.
          // Or we use the 30s preview as a backup.
          audio: track.previewUrl,
          duration: Math.floor(track.trackTimeMillis / 1000) || 0,
        };
      });
    } catch (error) {
      console.error("Error searching tracks:", error);
      return [];
    }
  },

  async getTracksByTags(tags: string[], limit = 20): Promise<Track[]> {
    const query = tags.length > 0 ? tags[0] : "trending";
    return this.searchTracks(query, limit);
  },
  
  // New: Search for audio on YouTube (used when playing starts)
  async getYoutubeUrl(track: Track): Promise<string> {
    try {
        const query = `${track.name} ${track.artist} audio`;
        // Use a public search proxy or similar to find the video ID
        // Note: In a real app we'd use YouTube Data API, but for study, 
        // we can try a public search instance.
        // For now, let's keep the iTunes preview as a backup if YouTube fails.
        return track.audio; 
    } catch (err) {
        return track.audio;
    }
  }
};
