import { firebase } from "@firebase/app";
import { db } from "@/firebase";
import io from "socket.io-client";
import store from "@/store";

const socket = io(process.env.VUE_APP_SERVER_URL);

export default {
  async getCurrentTrack() {
    return db
      .collection("tracks")
      .doc("room1")
      .get()
      .then(snapshot => snapshot.data().current_track)
      .catch(error => {
        console.error("LibFirebase.getCurrentTrack", error);
      });
  },

  async getQueue() {
    return db
      .collection("tracks")
      .doc("room1")
      .get()
      .then(snapshot => {
        return snapshot.data() ? snapshot.data().queue : [];
      })
      .catch(error => {
        console.error("LibFirebase.getQueue", error);
      });
  },

  addTrackToQueue(track) {
    db.collection("tracks")
      .doc("room1")
      .update({
        queue: firebase.firestore.FieldValue.arrayUnion({
          id: track.id,
          name: track.name,
          artist: track.artists[0].name,
          duration: track.duration_ms,
          image_big: track.album.images[0].url,
          image_medium: track.album.images[1].url,
          image_small: track.album.images[2].url,
          user: store.state.spotifyUser,
          vote: 0
        })
      })
      .then(() => {
        socket.emit("E_ADD_TRACK");
      })
      .catch(error => {
        console.error("LibFirebase.addTrackToQueue", error);
      });
  },

  voteTrack(track, increment) {
    // first remove old track
    this.removeTrackFromQueue(track);
    // and add updated track
    db.collection("tracks")
      .doc("room1")
      .update({
        queue: firebase.firestore.FieldValue.arrayUnion({
          id: track.id,
          name: track.name,
          artist: track.artist,
          duration: track.duration,
          image_big: track.image_big,
          image_medium: track.image_medium,
          image_small: track.image_small,
          vote: track.vote + increment
        })
      })
      .then(() => {
        socket.emit("E_VOTE_TRACK");
      })
      .catch(error => {
        console.error("LibFirebase.voteTrack", error);
      });
  },

  removeTrackFromQueue(track) {
    db.collection("tracks")
      .doc("room1")
      .update({
        queue: firebase.firestore.FieldValue.arrayRemove(track)
      })
      .catch(error => {
        console.error("LibFirebase.removeTrackFromQueue", error);
      });
  },

  async updateCurrentTrack(track) {
    db.collection("tracks")
      .doc("room1")
      .update({
        current_track: track
      })
      .catch(error => {
        console.error("LibFirebase.addTrackToQueue", error);
      });
  },

  async getUsers() {
    return db
      .collection("users")
      .doc("room1")
      .get()
      .then(snapshot => snapshot.data().users)
      .catch(error => {
        console.error("LibFirebase.getUsers", error);
      });
  },

  // move next track from queue to current track
  async getNextTrack() {
    let nextTrack = null;
    return this.getQueue()
      .then(queue => {
        if (queue.length > 0) {
          const sortQueue = queue.sort((track1, track2) => {
            return track2.vote - track1.vote;
          });
          nextTrack = sortQueue[0];
          this.removeTrackFromQueue(nextTrack);
        }
        this.updateCurrentTrack(nextTrack);
        socket.emit("E_NEXT_TRACK", nextTrack);
      })
      .catch(error => {
        console.error("LibFirebase.nextTrack", error);
      });
  },

  addUser(user) {
    db.collection("users")
      .doc("room1")
      .update({
        users: firebase.firestore.FieldValue.arrayUnion({
          spotify_id: user.spotify_id,
          name: user.name,
          spotify_url: user.spotify_url,
          image: user.image
        })
      })
      .then(() => {
        socket.emit("E_USER_CONNECTED");
      })
      .catch(error => {
        console.error("LibFirebase.addUser", error);
      });
  },

  removeUser(user) {
    db.collection("users")
      .doc("room1")
      .update({
        users: firebase.firestore.FieldValue.arrayRemove(user)
      })
      .catch(error => {
        console.error("LibFirebase.removeUser", error);
      });
  }
};
