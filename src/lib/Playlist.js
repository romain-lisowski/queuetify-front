import { db } from "@/firebase";

export default {
  // Get track to be played
  async getCurrentTrack() {
    return db
      .collection("rooms")
      .doc("room1")
      .get()
      .then(snapshot => snapshot.data().tracks[0])
      .catch(error => {
        console.error(error);
      });
  },
  // Get playlist
  async getTracks() {
    return db
      .collection("rooms")
      .doc("room1")
      .get()
      .then(snapshot => snapshot.data().tracks)
      .catch(error => {
        console.error(error);
      });
  }
};
