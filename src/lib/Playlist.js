import { db } from "@/firebase";
const spotifyApiUrl = "https://api.spotify.com";

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

  async getCurrentTrack(accessToken) {
    const trackId = await this.getCurrentTrackId();
    return fetch(`${spotifyApiUrl}/v1/tracks/${trackId}`, {
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
