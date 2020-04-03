import { db } from "@/firebase";

export default {
  async getCurrentTrackId() {
    return db
      .collection("rooms")
      .doc("room1")
      .get()
      .then(snapshot => snapshot.data().tracks[0])
      .catch(error => {
        console.error(error);
      });
  },

  async getTracksIds() {
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
