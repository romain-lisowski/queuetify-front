import LibFirebase from "@/lib/LibFirebase";
const spotifyApiUrl = "https://api.spotify.com";

export default {
  async getCurrentTrack(accessToken) {
    const trackId = await LibFirebase.getCurrentTrackId();
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

  async getTracks(accessToken) {
    const tracksIds = await LibFirebase.getTracksIds();
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
