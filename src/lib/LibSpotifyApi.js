import LibFirebase from "@/lib/LibFirebase";
const spotifyApiUrl = "https://api.spotify.com";

export default {
  async getCurrentTrack(spotifyAccessToken) {
    const trackId = await LibFirebase.getCurrentTrackId();
    if (trackId) {
      return fetch(`${spotifyApiUrl}/v1/tracks/${trackId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${spotifyAccessToken}`
        }
      })
        .then(response => response.json())
        .catch(error => {
          console.error("LibSpotifyApi.getCurrentTrack", error);
        });
    } else {
      return null;
    }
  },

  async getTracks(spotifyAccessToken) {
    const tracksIds = await LibFirebase.getTracksIds();
    if (tracksIds.length > 0) {
      return fetch(`${spotifyApiUrl}/v1/tracks?ids=${tracksIds.join()}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${spotifyAccessToken}`
        }
      })
        .then(response => response.json())
        .catch(error => {
          console.error("LibSpotifyApi.getTracks", error);
        });
    } else {
      return [];
    }
  },
  async searchTracks(search, spotifyAccessToken) {
    return fetch(
      `${spotifyApiUrl}/v1/search?q=${search}&type=track&offset=0&limit=50`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${spotifyAccessToken}`
        }
      }
    )
      .then(response => response.json())
      .catch(error => {
        console.error("LibSpotifyApi.search", error);
      });
  }
};
