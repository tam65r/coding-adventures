function extractYouTubeVideoTitle() {
        const videoTitleElement = document.querySelector('h1.style-scope.ytd-watch-metadata yt-formatted-string.style-scope.ytd-watch-metadata');

        const musicName = document.querySelector('h1.yt-video-attribute-view-model__title');
        
        const artistName = document.querySelector('h4.yt-video-attribute-view-model__subtitle');

    if (musicName) {
        const searchQuery = musicName.textContent + " " + artistName.textContent;
        return searchQuery;
    }else if (videoTitleElement) {
        let title = videoTitleElement.innerText;
        let regex = /[\/\(\)\-\?\,\.]/g;
        title = title.replaceAll(regex, "");
        title = title.replaceAll(" ","");
        return title;
    } else {
        return null;
    }
}

const searchQuery = extractYouTubeVideoTitle();
browser.runtime.sendMessage({
    title: searchQuery
});

location.reload();