async function testPiped() {
  const query = 'nx zero razões e emoções official audio';
  const url = `https://pipedapi.kavin.rocks/search?q=${encodeURIComponent(query)}&filter=videos`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log('Status:', response.status);
    if (data.items && data.items.length > 0) {
      const video = data.items[0];
      console.log('Video URL:', video.url);
      console.log('Title:', video.title);
    } else {
      console.log('No results');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

testPiped();
