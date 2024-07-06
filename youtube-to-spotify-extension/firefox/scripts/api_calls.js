function checkTokenStatus() {
    makeFetchRequest("https://api.spotify.com/v1/me")
    .then(({status, result}) => {
        if (status == 401) {
            refreshAccessToken();
    }})
    .catch(error => console.log(error));
}


async function addTrackToPlaylist(track) {
    checkTokenStatus();
  
    await retrievePlaylistId();
    
    const playlistId = localStorage.getItem("playlist_id");

    console.log(track);
  
    const body = {
      "uris": [track.uri]
    };
  
    try {
        const {status, result} = await makeFetchRequest(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`,"POST",body);
        if (status == 201) {
            fetchSpotifyEmbed(track);
            sessionStorage.setItem("youtube_title", null);
        } else if (status == 401) {
            await refreshAccessToken();
            let title = sessionStorage.getItem("youtube_title");
            extractTitle(title);
        }
    } catch (error) {
        console.log(error);
    }
  }

async function retrievePlaylistId() {
    let playlistId = localStorage.getItem("playlist_id");
    console.log("Playlist Id step1 " + playlistId);

    if (playlistId == null)  {
        await createPlaylistId();
        playlistId = localStorage.getItem("playlist_id");
    }
}

async function checkPlaylist() {
    try {
        const { status, result } = await makeFetchRequest("https://api.spotify.com/v1/me/playlists");
        if (status == 200) {
            const { items } = result;
            for (const playlist of items) {
                if (playlist.name == "Youtube To Spotify") {
                    localStorage.setItem("playlist_id", playlist.id);
                    return true;
                }
            }
        } else if (status == 401) {
            await refreshAccessToken();
            let title = sessionStorage.getItem("youtube_title");
            extractTitle(title);
        }
    } catch (error) {
        console.log(error);
    }
    
    return false;
}

async function createPlaylistId () {

    const flag = await checkPlaylist();
    if (!flag) {
        const body = {
            "name": "Youtube To Spotify",
            "description": "Your favorite youtube music saved to spotify",
            "public": false
        }

        try {
            const { status, result } = await makeFetchRequest("https://api.spotify.com/v1/me/playlists","POST",body);
            if (status == 201) {
                localStorage.setItem("playlist_id", result.id);
            } else if (status == 401) {
                await refreshAccessToken();
                let title = sessionStorage.getItem("youtube_title");
                extractTitle(title);
            }
        } catch (error) {
            console.log(error);
        }
    }
}


async function extractTitle(title) {
    console.log(title);
    sessionStorage.setItem("youtube_title", title);
    fetchTrack(title);
}

async function fetchTrack(title) {
    const url = `https://api.spotify.com/v1/search?q=${title}&type=track`;
    try {
        const {status, result} = await makeFetchRequest(url);
        if (status == 200) {
            const {items} = result.tracks;
            addTrackToPlaylist(items[0])
        } else if (status == 401) {
            await refreshAccessToken();
            let title = sessionStorage.getItem("youtube_title");
            extractTitle(title);
        }
    } catch (error) {
        console.log(error);
    }
}

async function fetchSpotifyEmbed(track){
    let tracksId = JSON.parse(localStorage.getItem("tracks_id"));
    if (tracksId == null) {
        tracksId = [track.id];
    } else {
        tracksId.unshift(track.id);
    }
    localStorage.setItem("tracks_id",JSON.stringify(tracksId));
    loadIFrames();
}

async function fetchUserInformation() {
    try {
        const {status, result} = await makeFetchRequest('https://api.spotify.com/v1/me');
        if (status == 200) {
            localStorage.setItem("user_id", result.id);
            localStorage.setItem("user_image", result.images[0].url);
        } else if (status == 401) {
            await refreshAccessToken();
        }
    } catch (error) {
        console.log(error);
    }
}