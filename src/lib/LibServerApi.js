const baseUrl = process.env.VUE_APP_SERVER_URL;
const dataHeaders = { "Content-type": "application/json; charset=UTF-8" };

export default {
  // get rooms
  async getRooms() {
    const response = await fetch(baseUrl + "/rooms");
    const rooms = await response.json();
    return rooms;
  },

  // get room
  async getRoom(roomId) {
    const response = await fetch(baseUrl + "/rooms/" + roomId);
    const room = await response.json();
    return room;
  },

  // get playing track
  async getCurrentTrack(room) {
    const response = await fetch(baseUrl + "/tracks/current/" + room.id);
    const track = await response.json();
    return track;
  },

  // get queued tracks
  async getTracks(room) {
    const response = await fetch(baseUrl + "/tracks/" + room.id);
    const tracks = await response.json();
    return tracks;
  },

  // add track to queue
  async addTrack(room, track, user) {
    const trackFromatted = {
      room_id: room.id,
      id: track.id,
      name: track.name,
      artist: track.artists[0].name,
      duration: track.duration_ms,
      image_big: track.album.images[0].url,
      image_medium: track.album.images[1].url,
      image_small: track.album.images[2].url,
      user: user
    };

    fetch(baseUrl + "/tracks", {
      method: "POST",
      body: JSON.stringify(trackFromatted),
      headers: dataHeaders
    });
  },

  async removeTrack(room, track) {
    fetch(baseUrl + "/tracks", {
      method: "DELETE",
      body: JSON.stringify({
        ...track,
        room_id: room.id
      }),
      headers: dataHeaders
    });
  },

  // vote for a track
  async voteTrack(track, user, increment) {
    fetch(baseUrl + "/votes", {
      method: "POST",
      body: JSON.stringify({
        track: track,
        increment: increment,
        user: user
      }),
      headers: dataHeaders
    });
  },

  // get other users of the room
  async getUsers(room, user) {
    const response = await fetch(baseUrl + "/users/" + room.id);
    const users = await response.json();

    // remove current user from array
    if (user) {
      users.forEach((user, index) => {
        if (user.spotify_id === user.spotify_id) {
          users.splice(index, 1);
        }
      });
    }

    return users;
  },

  // add user to the room
  async addUser(room, user) {
    const createUserDto = {
      room_id: room.id,
      spotify_id: user.spotify_id,
      name: user.name,
      image: user.image,
      spotify_url: user.spotify_url
    };

    fetch(baseUrl + "/users", {
      method: "POST",
      body: JSON.stringify(createUserDto),
      headers: dataHeaders
    });
  },

  // remove user from the room
  async removeUser(room, user) {
    fetch(baseUrl + "/users", {
      method: "DELETE",
      body: JSON.stringify({
        ...user,
        room_id: room.id
      }),
      headers: dataHeaders
    });
  }
};
