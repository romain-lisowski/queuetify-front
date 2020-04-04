const spotifyApiUrl = "https://api.spotify.com";

export default {
  async getUser(spotifyAccessToken) {
    return fetch(`${spotifyApiUrl}/v1/me`, {
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
  }
};
