function extractYouTubeVideoTitle() {
    const videoTitleElement = document.querySelector('h1.style-scope.ytd-watch-metadata yt-formatted-string.style-scope.ytd-watch-metadata');

    if (videoTitleElement) {
        return videoTitleElement.innerText;
    } else {
        return null;
    }
}

const videoTitle = extractYouTubeVideoTitle();
browser.runtime.sendMessage({
    title: videoTitle
});