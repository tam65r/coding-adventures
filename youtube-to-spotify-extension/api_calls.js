

function handleRetrieveTracks() {
    if (this.status == 200) {
        var data = JSON.parse(this.responseText);
        console.log(data);
        addTrackToPlaylist(data.tracks.items[0]);
    }
    else {
        console.log(this.responseText);
        //alert(this.responseText);
    }
}

function checkTokenStatus() {
    callApi("GET","https://api.spotify.com/v1/me",null, handleTokenStatus);
}

function handleTokenStatus() {
    if (this.status == 401) {
        refreshAccessToken();
    }
}

function addTrackToPlaylist(track)  {
    checkTokenStatus();
    let playlistId = retrievePlaylistId();

    let body = {
        "uris": [
            track.uri
        ]
    }

    callApi("POST",`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, body, handleTrackToPlaylist);
    
}

function handleTrackToPlaylist() {
    if (this.status == 201) {
        console.log("TRACK ADDED");
    }
    else {
        console.log(this.responseText);
    }
}

function retrievePlaylistId() {
    let playlistId = localStorage.getItem("playlist_id");
    console.log("Playlist Id step1 " + playlistId);

    if (playlistId == null)  {
        console.log("Playlist Id step2" + playlistId);
        createPlaylistId();
        playlistId = localStorage.getItem("playlist_id");
        return playlistId;
    }
    return playlistId;
}

function createPlaylistId () {

    callApi("GET","https://api.spotify.com/v1/me/playlists",null, handlePlaylistsRequest);

    playlistId = localStorage.getItem("playlist_id");

    if (playlistId == null) {
       // callApi("GET","https://api.spotify.com/v1/me",null, handleUserDataRequest);
        const userId = localStorage.getItem("user_id");

        body = {
            "name": "Youtube To Spotify",
            "description": "Your favorite youtube music saved to spotify",
            "public": false
        }

        //callApi("POST", `https://api.spotify.com/v1/users/${userId}/playlists`, body, handlePlaylistCreation);
        callApi("POST", `https://api.spotify.com/v1/me/playlists`, body, handlePlaylistCreation);
    }
}


function handlePlaylistCreation() {
    if (this.status == 201) {
        var data = JSON.parse(this.responseText);
        localStorage.setItem("playlist_id", data.id);
    } else {
        console.log(this.responseText)
    }
}

function handleUserDataRequest() {
    if (this.status == 200) {
        var data = JSON.parse(this.responseText);
        console.log("GET DETAILS " + data);
        localStorage.setItem("user_id",data.id);
    }
    else {
        console.log(this.responseText);
        //alert(this.responseText);
    }
}

function handlePlaylistsRequest() {

    if(this.status == 200) {
        var data = JSON.parse(this.responseText);
        console.log("PLAYLISTS " + data.items);
        data.items.forEach( playlist => {
            if (playlist.name == "Youtube To Spotify") {
                localStorage.setItem("playlist_id", playlist.id);
            }
        });
    }
    else {
        console.log(this.responseText);
        //alert(this.responseText);
    }

}




function extractTitle(title) {
    let regex = /[\/\(\)\-\?\,\.]/g;
    title = title.replaceAll(regex, "");
    title = title.replaceAll(" ","");
    console.log(title);
    let url = `https://api.spotify.com/v1/search?q=${title}&type=track`;

    callApi("GET",url,null,handleRetrieveTracks);
}
