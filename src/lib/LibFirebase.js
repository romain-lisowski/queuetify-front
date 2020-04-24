import { firebase } from "@firebase/app";
import { db } from "@/firebase";
import store from "@/store";

export default {
  async getCurrentTrack() {
    let track = null;
    const querySnapshot = await db
      .collection("current_tracks")
      .where("room", "==", "room1")
      .limit(1)
      .get();

    querySnapshot.forEach(doc => {
      track = doc.data();
    });
    return track;
  },

  async getTracks() {
    const tracks = [];
    const querySnapshot = await db
      .collection("tracks")
      .where("room", "==", "room1")
      .orderBy("vote", "desc")
      .orderBy("created", "asc")
      .get();

    querySnapshot.forEach(doc => {
      tracks.push(doc.data());
    });

    return tracks;
  },

  async addTrack(socket, track) {
    await db.collection("tracks").add({
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
      voters: [],
      created: firebase.firestore.FieldValue.serverTimestamp()
    });

    socket.emit("E_ADD_TRACK");
  },

  async voteTrack(socket, track, increment) {
    const querySnapshot = await db
      .collection("tracks")
      .where("room", "==", "room1")
      .where("id", "==", track.id)
      .get();

    querySnapshot.forEach(async doc => {
      await doc.ref.update({
        vote: track.vote + increment,
        voters: firebase.firestore.FieldValue.arrayUnion({
          ...store.state.spotifyUser,
          increment: increment
        })
      });

      socket.emit("E_VOTE_TRACK");
    });
  },

  async getUsers() {
    const users = [];
    const querySnapshot = await db
      .collection("users")
      .where("room", "==", "room1")
      .get();

    querySnapshot.forEach(doc => {
      if (doc.data().spotify_id != store.state.spotifyUser.spotify_id) {
        users.push(doc.data());
      }
    });

    return users;
  },

  async addUser(user) {
    await db
      .collection("users")
      .doc(user.spotify_id)
      .set({
        room: "room1",
        spotify_id: user.spotify_id,
        name: user.name,
        spotify_url: user.spotify_url,
        image: user.image
      });
  },

  async removeUser(user) {
    const querySnapshot = await db
      .collection("users")
      .where("room", "==", "room1")
      .where("spotify_id", "==", user.spotify_id)
      .get();
    querySnapshot.forEach(doc => {
      doc.ref.delete();
    });
  }
};
