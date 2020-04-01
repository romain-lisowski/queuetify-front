import { db } from "@/firebase";
const spotifyApiUrl = "https://api.spotify.com";

export default {
  // Get track to be played
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
  // Get playlist
  async getTracksIds() {
    return db
      .collection("rooms")
      .doc("room1")
      .get()
      .then(snapshot => snapshot.data().tracks)
      .catch(error => {
        console.error(error);
      });
  },

  async getTracks(accessToken) {
    const tracksIds = await this.getTracksIds();
    return fetch(`${spotifyApiUrl}/v1/tracks?ids=${tracksIds.join()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`
      }
    })
      .then(response => response.json())
      .catch(error => {
        console.error(error);
      });
  }
};
