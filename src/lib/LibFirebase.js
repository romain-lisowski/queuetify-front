import { firebase } from "@firebase/app";
import { db } from "@/firebase";
import store from "@/store";

export default {
  async getCurrentTrack() {
    return db
      .collection("rooms")
      .doc("room1")
      .get()
      .then(snapshot => snapshot.data().current_track)
      .catch(error => {
        console.error("LibFirebase.getCurrentTrack", error);
      });
  },

  async getQueue() {
    return db
      .collection("rooms")
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
    db.collection("rooms")
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
          vote: 0
        })
      })
      .then(() => {
        store.dispatch("addTrack");
      })
      .catch(error => {
        console.error("LibFirebase.addTrackToQueue", error);
      });
  },

  voteTrack(track, increment) {
    // first remove old track
    this.removeTrackFromQueue(track);
    // and add updated track
    db.collection("rooms")
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
        store.dispatch("fetchQueue");
      })
      .catch(error => {
        console.error("LibFirebase.voteTrack", error);
      });
  },

  removeTrackFromQueue(track) {
    db.collection("rooms")
      .doc("room1")
      .update({
        queue: firebase.firestore.FieldValue.arrayRemove(track)
      })
      .catch(error => {
        console.error("LibFirebase.removeTrackFromQueue", error);
      });
  },

  async updateCurrentTrack(track) {
    db.collection("rooms")
      .doc("room1")
      .update({
        current_track: track
      })
      .catch(error => {
        console.error("LibFirebase.addTrackToQueue", error);
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
          this.removeTrackFromQueue(sortQueue[0]);
        }
        this.updateCurrentTrack(nextTrack);
        return nextTrack;
      })
      .catch(error => {
        console.error("LibFirebase.nextTrack", error);
      });
  }
};
