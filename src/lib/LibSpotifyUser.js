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
      .then(spotifyUser => {
        const user = {
          spotify_id: spotifyUser.id,
          name: spotifyUser.display_name,
          spotify_url: spotifyUser.href,
          image: spotifyUser.images[0].url
        };

        LibFirebase.addUser(user);
        return user;
      })
      .catch(error => {
        console.error("LibSpotifyApi.getTracks", error);
      });
  }
};
