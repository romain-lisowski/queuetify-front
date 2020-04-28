const baseUrl = process.env.VUE_APP_SERVER_URL;
const dataHeaders = { "Content-type": "application/json; charset=UTF-8" };

export default {
  // get rooms
  async getRooms() {
    const response = await fetch(baseUrl + "/rooms");
    const rooms = await response.json();
    return rooms;
  },

  // get playing track
  async getCurrentTrack(roomName) {
    const response = await fetch(baseUrl + "/current_track/" + roomName);
    const track = await response.json();
    return track;
  },

  // get queued tracks
  async getTracks(roomName) {
    const response = await fetch(baseUrl + "/tracks/" + roomName);
    const tracks = await response.json();
    return tracks;
  },

  // add track to queue
  async addTrack(roomName, track, spotifyUser) {
    const trackFromatted = {
      id: track.id,
      name: track.name,
      artist: track.artists[0].name,
      duration: track.duration_ms,
      image_big: track.album.images[0].url,
      image_medium: track.album.images[1].url,
      image_small: track.album.images[2].url,
      user: spotifyUser,
      vote: 0,
      voters: []
    };

    fetch(baseUrl + "/tracks/" + roomName, {
      method: "POST",
      body: JSON.stringify({
        track: trackFromatted
      }),
      headers: dataHeaders
    });
  },

  async removeTrack(roomName, track) {
    fetch(baseUrl + "/tracks/" + roomName, {
      method: "DELETE",
      body: JSON.stringify({
        track: track
      }),
      headers: dataHeaders
    });
  },

  // vote for a track
  async voteTrack(roomName, track, increment, spotifyUser) {
    fetch(baseUrl + "/tracks/vote/" + roomName, {
      method: "POST",
      body: JSON.stringify({
        track: track,
        increment: increment,
        spotifyUser: spotifyUser
      }),
      headers: dataHeaders
    });
  },

  // get other users of the room
  async getUsers(roomName, spotifyUser) {
    const response = await fetch(baseUrl + "/users/" + roomName);
    const users = await response.json();

    // remove current user from array
    if (spotifyUser) {
      users.forEach((user, index) => {
        if (user.spotify_id === spotifyUser.spotify_id) {
          users.splice(index, 1);
        }
      });
    }

    return users;
  },

  // add user to the room
  async addUser(roomName, user) {
    const userFormatted = {
      spotify_id: user.spotify_id,
      name: user.name,
      spotify_url: user.spotify_url,
      image: user.image
    };

    fetch(baseUrl + "/users/" + roomName, {
      method: "POST",
      body: JSON.stringify({
        user: userFormatted
      }),
      headers: dataHeaders
    });
  },

  // remove user from the room
  async removeUser(roomName, user) {
    fetch(baseUrl + "/users/" + roomName, {
      method: "DELETE",
      body: JSON.stringify({
        user: user
      }),
      headers: dataHeaders
    });
  }
};
