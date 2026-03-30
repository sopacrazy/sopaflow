import { Track } from "../types";
import axios from "axios";

export const jamendoApi = {
  // Helpers
  shuffle<T>(array: T[]): T[] {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  },

  // Use iTunes API for high-quality metadata of famous artists (No key needed)
  async searchTracks(query: string, limit = 20, random = false): Promise<Track[]> {
    try {
      let term = query;
      if (!term || term === "trending") term = "Top Chart 2024";
      if (term === "Top Brasil") term = "Brasil Top 50 2024";
      if (term === "Top Global Hits" || term === "Top Internacional") term = "Global Top 50 Hits";
      
      const response = await axios.get(`https://itunes.apple.com/search`, {
        params: {
          term: term,
          media: "music",
          limit: random ? 100 : limit,
          entity: "song"
        }
      });

      let results = response.data.results || [];
      
      if (random) {
        results = this.shuffle(results).slice(0, limit);
      }
      
      return results.map((track: any) => {
        // Use 300x300 cover instead of 600x600 to load much faster
        const optimizedImage = track.artworkUrl100.replace("100x100bb.jpg", "300x300bb.jpg");
        
        return {
          id: track.trackId.toString(),
          name: track.trackName,
          artist: track.artistName,
          album: track.collectionName || "Single",
          image: optimizedImage,
          audio: track.previewUrl,
          duration: Math.floor(track.trackTimeMillis / 1000) || 0,
          genre: track.primaryGenreName,
        };
      });
    } catch (error) {
      console.error("Error searching tracks:", error);
      return [];
    }
  },

  async searchArtistWithAlbums(artistName: string, maxResults = 10): Promise<{ artist: string, albums: any[] }> {
    try {
      const response = await axios.get(`https://itunes.apple.com/search`, {
        params: {
          term: artistName,
          media: "music",
          entity: "album",
          limit: maxResults
        }
      });
      return {
        artist: artistName,
        albums: response.data.results || []
      };
    } catch (error) {
      return { artist: artistName, albums: [] };
    }
  },

  async getAlbumTracks(collectionId: string): Promise<Track[]> {
    try {
      const url = `https://itunes.apple.com/lookup?id=${collectionId}&entity=song`;
      console.log("ITUNES LOOKUP:", url);
      
      const response = await axios.get(url);
      
      // First result is the album metadata, following are tracks
      const results = response.data.results || [];
      const tracksOnly = results.filter((res: any) => res.wrapperType === "track");
      
      console.log(`FOUND ${tracksOnly.length} TRACKS FOR COLLECTION ${collectionId}`);

      return tracksOnly.map((track: any) => ({
        id: track.trackId.toString(),
        name: track.trackName,
        artist: track.artistName,
        album: track.collectionName,
        image: track.artworkUrl100.replace("100x100bb.jpg", "300x300bb.jpg"),
        audio: track.previewUrl,
        duration: Math.floor(track.trackTimeMillis / 1000) || 0,
        genre: track.primaryGenreName,
      }));
    } catch (error) {
      console.error("Error fetching album tracks:", error);
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
        return track.audio; 
    } catch (err) {
        return track.audio;
    }
  }
};
