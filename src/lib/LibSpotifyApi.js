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
        console.error("LibSpotifyApi.getCurrentTrack", error);
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
        console.error("LibSpotifyApi.getTracks", error);
      });
  },
  async searchTracks(search, accessToken) {
    return fetch(
      `${spotifyApiUrl}/v1/search?q=${search}&type=track&offset=0&limit=50`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`
        }
      }
    )
      .then(response => response.json())
      .catch(error => {
        console.error("LibSpotifyApi.search", error);
      });
  }
};
