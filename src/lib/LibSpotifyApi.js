const spotifyApiUrl = "https://api.spotify.com";

export default {
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
