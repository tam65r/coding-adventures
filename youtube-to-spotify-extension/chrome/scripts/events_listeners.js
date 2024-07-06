document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('login').addEventListener('click', requestAuthorization);
    document.getElementById('get-active-tab').addEventListener('click', retrieveActiveTab);
    document.getElementById('delete-button').addEventListener('click', deleteIFrames);
    onPageLoad();
});

function onPageLoad() {
    removeLoginEvent();
    loadIFrames();
}

function removeLoginEvent() {
    const accessToken = localStorage.getItem("access_token");
    
    if (accessToken != null) {
        document.getElementById('login').removeEventListener('click', requestAuthorization);
        replaceLoginButton();
    }
}

async function replaceLoginButton() {
    let id = localStorage.getItem("user_id");
    let image  = localStorage.getItem("user_image");
    if (id == null || image == null) {
        await fetchUserInformation();
    }
    id = localStorage.getItem("user_id");
    image  = localStorage.getItem("user_image");

    document.getElementById("profile-picture").src = image;
    document.getElementById("profile-name").textContent = id; 
}


function loadIFrames() {
    const tracksId = JSON.parse(localStorage.getItem("tracks_id"));

    if (tracksId == null) {
        return;
    }

    const div = document.getElementById('iframes-container')
    removeIFrames();

    tracksId.forEach( element => {
            let iframe  = createSpotifyIFrame(element);
            div.appendChild(iframe);
    });
}

function removeIFrames() {
    const div = document.getElementById('iframes-container');

    const iframes = div.getElementsByTagName('iframe');
    
    Array.from(iframes).forEach(iframe => {
        iframe.remove();
    });

}

function deleteIFrames() {
    removeIFrames();
    localStorage.setItem("tracks_id",null)
}

function retrieveActiveTab() {
    chrome.tabs.query({ active: true, currentWindow: true })
                .then(async (tabs) => {
                    const currentTab = tabs[0];
                    if (currentTab.url.startsWith("https://www.youtube.com/")) {
                        try {
                            await chrome.scripting.executeScript({
                                target: {
                                  tabId: currentTab.id,
                                  allFrames: true,
                                },
                                files: ["scripts/content-scripts/youtube_extractor.js"],
                              });
                        } catch (err) {
                            console.log(err);   
                        }
                    }
                })
                .catch(error => {
                    console.error("Error fetching current tab:", error);
                });
                chrome.runtime.onMessage.addListener((message) => {
                    if (message.title) {
                        extractTitle(message.title);
                    }
                    chrome.runtime.onMessage.removeListener();
                });
}


chrome.tabs.onUpdated.addListener(onTabUpdated);

function onTabUpdated(tabId, changeInfo, tab) {
    
    const accessToken = localStorage.getItem("access_token");
    const refreshToken = localStorage.getItem("refresh_token");

    if (accessToken != null && refreshToken != null) {
        chrome.tabs.onUpdated.removeListener(onTabUpdated);
        return;
    }


    if (changeInfo.url && changeInfo.url.startsWith(redirectUri)) {
        const urlParams = new URL(changeInfo.url).searchParams;
        const code = urlParams.get('code');
        fetchAcessToken(code);
        chrome.tabs.remove(tabId);

        chrome.tabs.onUpdated.removeListener(onTabUpdated);
    }
}