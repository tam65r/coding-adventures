const client_id = "";
const client_secret = "";

const redirect_uri = "https://open.spotify.com/";

const AUTHORIZE = "https://accounts.spotify.com/authorize";
const TOKEN = "https://accounts.spotify.com/api/token";


function fetchAcessToken(code) {
    const body = `grant_type=authorization_code&code=${code}&redirect_uri=${encodeURI(redirect_uri)}&client_id=${client_id}`
    callAuthorizationApi(body); 
}

function callAuthorizationApi(body) {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", TOKEN, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader('Authorization', 'Basic ' + btoa(client_id + ":" + client_secret));
    xhr.send(body);
    xhr.onload = handleAuthorizationResponse;
}

function handleAuthorizationResponse() {
    if (this.status == 200) {
        var data = JSON.parse(this.responseText);
        if (data.access_token != undefined) {
            access_token = data.access_token;
            localStorage.setItem("access_token", access_token);
        }
        if (data.refresh_token != undefined) {
            refresh_token = data.refresh_token;
            localStorage.setItem("refresh_token",refresh_token);
        }
    }
    else {
        console.log(this.responseText);
        alert(this.responseText);
    }
}

function requestAuthorization() {
    let url = AUTHORIZE;
    url += "?client_id=" + client_id;
    url += "&response_type=code";
    url += "&redirect_uri=" + encodeURI(redirect_uri);
    url += "&show_dialog=true";
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


    if (changeInfo.url && changeInfo.url.startsWith(redirect_uri)) {
        const urlParams = new URL(changeInfo.url).searchParams;
        const code = urlParams.get('code');
        fetchAcessToken(code);
        browser.tabs.remove(tabId);

        browser.tabs.onUpdated.removeListener(onTabUpdated);
    }
}

function refreshAccessToken() {
    const refreshToken = localStorage.getItem("refresh_token");
    let body = "grant_type=refresh_token";
    body += "&refresh_token=" + refreshToken;
    body += "&client_id=" + client_id;
    callAuthorizationApi(body);
}


function callApi(method, url, body, callback) {
    const access_token = localStorage.getItem("access_token");
    console.log(url + JSON.stringify(body));
    let xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
    xhr.send(body);
    xhr.onload = callback;
}

function retrieveActiveTab() {
    browser.tabs.query({ active: true, currentWindow: true })
                .then(async (tabs) => {
                    const currentTab = tabs[0];
                    if (currentTab.url.startsWith("https://www.youtube.com/")   ) {
                        console.log(currentTab);
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
                    console.log(message.title)
                    if (message.title) {
                        extractTitle(message.title);
                    }
                    browser.runtime.onMessage.removeListener();
                });
}

document.addEventListener('DOMContentLoaded', (event) => {
    //onPageLoad();

    document.getElementById('login').addEventListener('click', requestAuthorization);
    document.getElementById('get-active-tab').addEventListener('click', retrieveActiveTab);
    document.getElementById('test-button').addEventListener('click', test);
});

function test() {
    const htmlElement = {
        "html": "<iframe style=\"border-radius: 12px\" width=\"100%\" height=\"152\" title=\"Spotify Embed: Starlight (feat. Myles Kennedy)\" frameborder=\"0\" allowfullscreen allow=\"autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture\" loading=\"lazy\" src=\"https://open.spotify.com/embed/track/2t9s7ClOA37D8VIymaB5R5?utm_source=oembed\"></iframe>",
        "width": 456,
        "height": 152,
        "version": "1.0",
        "provider_name": "Spotify",
        "provider_url": "https://spotify.com",
        "type": "rich",
        "title": "Starlight (feat. Myles Kennedy)",
        "thumbnail_url": "https://i.scdn.co/image/ab67616d00001e0216172059bb4024f4a1d9b99a",
        "thumbnail_width": 300,
        "thumbnail_height": 300,
        "iframe_url": "https://open.spotify.com/embed/track/2t9s7ClOA37D8VIymaB5R5?utm_source=oembed"
      }

      const iframe = document.createElement('iframe');
      iframe.style.borderRadius = "12px";
      iframe.width = "100%";  
      iframe.height = htmlElement.height;
      iframe.title = `Spotify Embed: ${htmlElement.title}`;
      iframe.frameBorder = "0";
      iframe.allowFullscreen = true;
      iframe.allow = "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture";
      iframe.loading = "lazy";
      iframe.src = htmlElement.iframe_url;
      
      // Add the iframe to the div
      document.getElementById('main-div').appendChild(iframe);
    
}