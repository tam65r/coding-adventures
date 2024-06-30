async function makeFetchRequest(url, method = 'GET',  body = null, headers = null, redirect = 'follow') {
    console.log(url);

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
      requestOptions.body = JSON.stringify(body);
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
  