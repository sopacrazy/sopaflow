async function testSaavn() {
  const query = 'believer';
  const url = `https://saavn.me/search/songs?query=${query}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log('Status:', response.status);
    if (data.results && data.results.length > 0) {
      const song = data.results[0];
      console.log('Title:', song.name);
      console.log('Download URL (HQ):', song.downloadUrl[song.downloadUrl.length - 1].link);
    } else {
      console.log('No results or éxito: false');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

testSaavn();
