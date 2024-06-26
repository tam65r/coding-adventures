const client_id = "5519a73f3de5485c80c9269ae0b3a419";
const client_secret = "ab7e20529ca64ca28f29a5527812492f";

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
});