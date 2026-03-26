import type { VercelRequest, VercelResponse } from '@vercel/node';
import yts from 'yt-search';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS configuration
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: "Missing query" });
    
    // Search on YouTube for the audio/video
    const results = await yts(q as string);
    const video = results.videos[0];
    
    if (!video) return res.status(404).json({ error: "No video found" });
    
    return res.status(200).json({ 
        url: video.url, 
        videoId: video.videoId,
        duration: video.seconds,
        title: video.title 
    });
  } catch (error) {
    console.error("Search error:", error);
    return res.status(500).json({ error: "Search failed" });
  }
}
