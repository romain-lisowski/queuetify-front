const baseUrl = process.env.VUE_APP_SERVER_URL;
const dataHeaders = { "Content-type": "application/json; charset=UTF-8" };

/**
 * Calls to server API
 */
export default {
  /**
   * Get rooms available
   */
  async getPublicRooms() {
    const response = await fetch(baseUrl + "/rooms");
    const rooms = await response.json();
    return rooms;
  },

  /**
   * Get one room
   */
  async getRoom(roomId) {
    const response = await fetch(baseUrl + "/rooms/" + roomId);
    const room = await response.json();
    return room;
  },

  /**
   * Get user secret room
   */
  async getUserRoom(user) {
    const response = await fetch(baseUrl + "/rooms/user", {
      method: "POST",
      body: JSON.stringify({ user: user }),
      headers: dataHeaders
    });

    const room = await response.json();
    return room;
  },

  /**
   * Get current playing track of a room
   */
  async getCurrentTrack(room) {
    const response = await fetch(baseUrl + "/tracks/current/" + room.id);
    const track = await response.json();
    return track;
  },

  /**
   * Get queue tracks of a room
   */
  async getTracks(room) {
    const response = await fetch(baseUrl + "/tracks/" + room.id);
    const tracks = await response.json();
    return tracks;
  },

  /**
   * Add track to queue
   */
  async addTrack(room, track, user) {
    const createTrackDto = {
      room_id: room.id,
      spotify_id: track.id,
      name: track.name,
      artist: track.artists[0].name,
      duration: track.duration_ms,
      image_big: track.album.images[0].url,
      image_medium: track.album.images[1].url,
      image_small: track.album.images[2].url,
      user: user
    };

    await fetch(baseUrl + "/tracks", {
      method: "POST",
      body: JSON.stringify(createTrackDto),
      headers: dataHeaders
    });
  },

  /**
   * Remove track from queue
   */
  async removeTrack(room, track) {
    await fetch(baseUrl + "/tracks", {
      method: "DELETE",
      body: JSON.stringify({
        ...track,
        room_id: room.id
      }),
      headers: dataHeaders
    });
  },

  /**
   * Vote for a track
   */
  async voteTrack(track, user, increment) {
    await fetch(baseUrl + "/votes", {
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

    await fetch(baseUrl + "/users", {
      method: "POST",
      body: JSON.stringify(createUserDto),
      headers: dataHeaders
    });
  },

  // remove user from the room
  async removeUser(room, user) {
    await fetch(baseUrl + "/users", {
      method: "DELETE",
      body: JSON.stringify({
        ...user,
        room_id: room.id
      }),
      headers: dataHeaders
    });
  }
};
