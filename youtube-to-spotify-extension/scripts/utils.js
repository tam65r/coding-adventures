async function makeFetchRequest(url, method = 'GET',  body = null, headers = null, redirect = 'follow') {
    if (headers == null) {
      const accessToken = localStorage.getItem("access_token");
        headers = {
          "Content-Type": "application/json",
          "Authorization": "Bearer "+ accessToken
        }
    } 

    const requestOptions = {
      method: method,
      headers: headers,
      redirect: redirect
    };
  
    if (body) {
      if (headers["Content-Type"] === "application/x-www-form-urlencoded") {
          requestOptions.body = body; 
      } else {
          requestOptions.body = JSON.stringify(body);
      }
  }
  
    try {
      const response = await fetch(url, requestOptions);
      const result = await response.json();
      const status = response.status;

      return { status, result };
    } catch (error) {
      console.error('Fetch error:', error);
      throw error;
    }
  }
  

function createSpotifyIFrame(trackId) {

  const iframe = document.createElement('iframe');
  iframe.setAttribute('src', `https://open.spotify.com/embed/track/${trackId}?utm_source=oembed`);
  iframe.setAttribute('width', '100%');
  iframe.setAttribute('height', '152');
  iframe.setAttribute('frameborder', '0');
  iframe.setAttribute('allowtransparency', 'true');
  iframe.className = 'spotify-embed';

  return iframe;
}