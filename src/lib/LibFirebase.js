import { firebase } from "@firebase/app";
import { db } from "@/firebase";
import store from "@/store";

export default {
  async getCurrentTrackId() {
    return db
      .collection("rooms")
      .doc("room1")
      .get()
      .then(snapshot => snapshot.data().tracks[0])
      .catch(error => {
        console.error("LibFirebase.getCurrentTrackId", error);
      });
  },

  async getTracksIds() {
    return db
      .collection("rooms")
      .doc("room1")
      .get()
      .then(snapshot => snapshot.data().tracks)
      .catch(error => {
        console.error("LibFirebase.getTracksIds", error);
      });
  },

  addTrack(trackId) {
    db.collection("rooms")
      .doc("room1")
      .update({
        tracks: firebase.firestore.FieldValue.arrayUnion(trackId)
      })
      .then(() => {
        store.dispatch("getQueue");
        console.log("Track added : " + trackId);
      })
      .catch(error => {
        console.error("LibFirebase.addTrack", error);
      });
  },

  removeTrack(trackId) {
    db.collection("rooms")
      .doc("room1")
      .update({
        tracks: firebase.firestore.FieldValue.arrayRemove(trackId)
      })
      .then(() => {
        store.dispatch("getQueue");
        console.log("Track added : " + trackId);
      })
      .catch(error => {
        console.error("LibFirebase.addTrack", error);
      });
  }
};
