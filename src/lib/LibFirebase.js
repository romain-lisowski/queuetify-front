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
          image_small: track.album.images[2].url
        })
      })
      .then(() => {
        store.dispatch("addTrack");
      })
      .catch(error => {
        console.error("LibFirebase.addTrackToQueue", error);
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
          nextTrack = queue[0];
          this.removeTrackFromQueue(nextTrack);
        }
        this.updateCurrentTrack(nextTrack);
        return nextTrack;
      })
      .catch(error => {
        console.error("LibFirebase.nextTrack", error);
      });
  }
};
