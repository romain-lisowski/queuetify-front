import store from "@/store";

const baseUrl = process.env.VUE_APP_SERVER_URL;
const dataHeaders = { "Content-type": "application/json; charset=UTF-8" };

export default {
  // get playing track
  async getCurrentTrack() {
    const response = await fetch(baseUrl + "/current_track");
    const track = await response.json();
    return track;
  },

  // get queued tracks
  async getTracks() {
    const response = await fetch(baseUrl + "/tracks");
    const tracks = await response.json();
    return tracks;
  },

  // add track to queue
  async addTrack(track) {
    const trackFromatted = {
      room: "room1",
      id: track.id,
      name: track.name,
      artist: track.artists[0].name,
      duration: track.duration_ms,
      image_big: track.album.images[0].url,
      image_medium: track.album.images[1].url,
      image_small: track.album.images[2].url,
      user: store.state.spotifyUser,
      vote: 0,
      voters: []
    };

    fetch(baseUrl + "/tracks", {
      method: "POST",
      body: JSON.stringify({
        track: trackFromatted
      }),
      headers: dataHeaders
    });
  },

  async removeTrack(track) {
    fetch(baseUrl + "/tracks", {
      method: "DELETE",
      body: JSON.stringify({
        track: track
      }),
      headers: dataHeaders
    });
  },

  // vote for a track
  async voteTrack(track, increment) {
    fetch(baseUrl + "/tracks/vote", {
      method: "POST",
      body: JSON.stringify({
        track: track,
        increment: increment,
        spotifyUser: store.state.spotifyUser
      }),
      headers: dataHeaders
    });
  },

  // get other users of the room
  async getUsers() {
    const response = await fetch(baseUrl + "/users");
    const users = await response.json();

    // remove current user from array
    if (store.state.spotifyUser) {
      users.forEach((user, index) => {
        if (user.spotify_id === store.state.spotifyUser.spotify_id) {
          users.splice(index, 1);
        }
      });
    }

    return users;
  },

  // add user to the room
  async addUser(user) {
    const userFormatted = {
      room: "room1",
      spotify_id: user.spotify_id,
      name: user.name,
      spotify_url: user.spotify_url,
      image: user.image
    };

    fetch(baseUrl + "/users", {
      method: "POST",
      body: JSON.stringify({
        user: userFormatted
      }),
      headers: dataHeaders
    });
  },

  // remove user from the room
  async removeUser(user) {
    fetch(baseUrl + "/users", {
      method: "DELETE",
      body: JSON.stringify({
        user: user
      }),
      headers: dataHeaders
    });
  }
};
