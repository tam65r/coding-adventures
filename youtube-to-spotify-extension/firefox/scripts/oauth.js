const clientId = "";
const clientSecret = "";

const redirectUri = "https://open.spotify.com/";


function fetchAcessToken(code) {
    const body = `grant_type=authorization_code&code=${code}&redirect_uri=${encodeURI(redirectUri)}&client_id=${clientId}`
    postAuthorizationRequest(body); 
}

async function postAuthorizationRequest(body) {
    let headers = {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": "Basic "+  btoa(clientId + ":" + clientSecret)
      }
    try {
        const { status, result } = await makeFetchRequest("https://accounts.spotify.com/api/token", "POST", body, headers);
        if (status === 200) {
            if (result.access_token) {
                access_token = result.access_token;
                localStorage.setItem("access_token", access_token);
            }
            if (result.refresh_token) {
                refresh_token = result.refresh_token;
                localStorage.setItem("refresh_token", refresh_token);
            }
        }
    } catch (error) {
        console.log(error);
    }
}

function requestAuthorization() {
    let url = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURI(redirectUri)}&show_dialog=true`;
    url += "&scope=playlist-read-private playlist-read-collaborative playlist-modify-private playlist-modify-public user-library-modify user-library-read";
   
    browser.tabs.create({ url, active: true });
    browser.tabs.onUpdated.addListener(onTabUpdated);
}


async function refreshAccessToken() {
    const refreshToken = localStorage.getItem("refresh_token");
    let body = `grant_type=refresh_token&refresh_token=${refreshToken}&client_id=${clientId}`;
    await postAuthorizationRequest(body);
}

