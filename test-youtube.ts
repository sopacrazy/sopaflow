async function testInvidious() {
  const query = 'nx zero razões e emoções';
  const url = `https://invidious.projectsegfau.lt/api/v1/search?q=${encodeURIComponent(query)}&type=video`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log('Status:', response.status);
    if (data.length > 0) {
      const video = data[0];
      console.log('Video ID:', video.videoId);
      console.log('Title:', video.title);
    } else {
      console.log('No results');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

testInvidious();
