document.addEventListener('DOMContentLoaded', (event) => {
    onPageLoad();

    document.getElementById('login').addEventListener('click', requestAuthorization);
    document.getElementById('get-active-tab').addEventListener('click', retrieveActiveTab);
});

function onPageLoad() {
    loadIFrames();
}


function loadIFrames() {
    const tracksId = JSON.parse(localStorage.getItem("tracks_id"));

    if (tracksId == null) {
        return;
    }
    
    const div = document.getElementById('iframes-container')

    const iframes = div.getElementsByTagName('iframe');
    
    Array.from(iframes).forEach(iframe => {
        iframe.remove();
    });

    tracksId.forEach( element => {
            let iframe  = createSpotifyIFrame(element);
            div.appendChild(iframe);
    });
}

