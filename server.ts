import express from "express";
import cors from "cors";
import yts from "yt-search";

const app = express();
const PORT = 3001;

app.use(cors());

// Route to find the best YouTube Video ID for a track
app.get("/api/search-youtube", async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: "Missing query" });
    
    // Search on YouTube for the audio/video
    const results = await yts(q as string);
    const video = results.videos[0];
    
    if (!video) return res.status(404).json({ error: "No video found" });
    
    // Return the YouTube Watch URL (ReactPlayer can play this!)
    // And also returns the real duration from YouTube
    res.json({ 
        url: video.url, 
        videoId: video.videoId,
        duration: video.seconds,
        title: video.title 
    });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ error: "Search failed" });
  }
});

app.listen(PORT, () => {
  console.log(`Audio Search Server running on http://localhost:${PORT}`);
});
