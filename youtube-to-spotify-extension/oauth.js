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

browser.tabs.onUpdated.addListener(onTabUpdated);

function onTabUpdated(tabId, changeInfo, tab) {
    
    const accessToken = localStorage.getItem("access_token");
    const refreshToken = localStorage.getItem("refresh_token");

    if (accessToken != null && refreshToken != null) {
        browser.tabs.onUpdated.removeListener(onTabUpdated);
        return;
    }


    if (changeInfo.url && changeInfo.url.startsWith(redirectUri)) {
        const urlParams = new URL(changeInfo.url).searchParams;
        const code = urlParams.get('code');
        fetchAcessToken(code);
        browser.tabs.remove(tabId);

        browser.tabs.onUpdated.removeListener(onTabUpdated);
    }
}

async function refreshAccessToken() {
    const refreshToken = localStorage.getItem("refresh_token");
    let body = `grant_type=refresh_token&refresh_token=${refreshToken}&client_id=${clientId}`;
    await postAuthorizationRequest(body);
}


function retrieveActiveTab() {
    browser.tabs.query({ active: true, currentWindow: true })
                .then(async (tabs) => {
                    const currentTab = tabs[0];
                    if (currentTab.url.startsWith("https://www.youtube.com/")   ) {
                        try {
                            await browser.scripting.executeScript({
                                target: {
                                  tabId: currentTab.id,
                                  allFrames: true,
                                },
                                files: ["youtube_extractor.js"],
                              });
                        } catch (err) {
                            console.log(err);   
                        }
                    }
                })
                .catch(error => {
                    console.error("Error fetching current tab:", error);
                });
                browser.runtime.onMessage.addListener((message) => {
                    if (message.title) {
                        extractTitle(message.title);
                    }
                    browser.runtime.onMessage.removeListener();
                });
}
