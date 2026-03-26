async function testSaavn() {
  const query = 'believer';
  const url = `https://jiosaavn-api-v3.vercel.app/api/search/songs?query=${query}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Success:', data.success);
    if (data.data.results && data.data.results.length > 0) {
      const song = data.data.results[0];
      console.log('Title:', song.name);
      console.log('Audio:', song.downloadUrl[song.downloadUrl.length - 1].link);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

testSaavn();
