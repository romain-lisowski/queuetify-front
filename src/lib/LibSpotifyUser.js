import LibFirebase from "@/lib/LibFirebase";

const spotifyApiUrl = process.env.VUE_APP_SPOTIFY_API_URL;

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
          spotify_url: spotifyUser.external_urls.spotify,
          image:
            spotifyUser.images.length > 0 ? spotifyUser.images[0].url : null
        };

        LibFirebase.addUser(user);
        return user;
      })
      .catch(error => {
        console.error("LibSpotifyApi.getTracks", error);
      });
  }
};
