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
  
    console.log("ADD track id " + playlistId);
  
    makeFetchRequest(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`,"POST",body)
        .then(({status, result}) => {
            if (status == 201) {
                console.log(JSON.stringify(result));
            } else if (status == 401) {
                console.log("VALIDA O TOKEND E ACESSO");
            }
        })
        .catch(error => console.log(error));
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
                    console.log("DEU VERDADEIRO E VOU SALVAR A PLAYLIST CORRETA");
                    localStorage.setItem("playlist_id", playlist.id);
                    return true;
                }
            }
        } else if (status == 401) {
            console.log("VALIDA O TOKEND E ACESSO");
        }
    } catch (error) {
        console.log(error);
    }
    
    return false;
}

async function createPlaylistId () {

    const flag = await checkPlaylist();
    console.log("Check Flag For playlist id " + flag);
    if (!flag) {
        const body = {
            "name": "Youtube To Spotify",
            "description": "Your favorite youtube music saved to spotify",
            "public": false
        }

        try {
            const { status, result } = await makeFetchRequest("https://api.spotify.com/v1/me/playlists");
            if (status == 201) {
                console.log("Playlist id + " + result.id);
                localStorage.setItem("playlist_id", result.id);
            } else if (status == 401) {
                console.log("VALIDA O TOKEND E ACESSO");
            }
        } catch (error) {
            console.log(error);
        }

        makeFetchRequest("https://api.spotify.com/v1/me/playlists","POST",body)
        .then(({status, result}) => {
            //console.log(status + "criacoa dalaylist " + JSON.stringify(result));
            if (status == 201) {
                console.log("Playlist id + " + result.id);
                localStorage.setItem("playlist_id", result.id);
            } else if (status == 401) {
                console.log("VALIDA O TOKEND E ACESSO");
            }
        })
        .catch(error => console.log(error));
    }
}


function extractTitle(title) {
    let regex = /[\/\(\)\-\?\,\.]/g;
    title = title.replaceAll(regex, "");
    title = title.replaceAll(" ","");
    console.log(title);
    let url = `https://api.spotify.com/v1/search?q=${title}&type=track`;

    makeFetchRequest(url)
        .then(({status, result}) => {
            if (status == 200) {
                const {items} = result.tracks;
                addTrackToPlaylist(items[0])
            } else if (status == 401) {
                console.log("VALIDA O TOKEND E ACESSO");
            }
        })
        .catch(error => console.log(error));
}
