const accountUrl = "https://accounts.spotify.com";

export default {
  // Call spotify authorization url
  getAuthorization() {
    const querystring = require("querystring");
    const queryString = querystring.stringify({
      client_id: process.env.VUE_APP_SPOTIFY_CLIENT_ID,
      response_type: "code",
      redirect_uri: process.env.VUE_APP_SPOTIFY_API_REDIRECT_URL,
      scope:
        "streaming user-read-playback-state user-read-currently-playing user-read-playback-position user-read-recently-played user-modify-playback-state"
    });

    const url = `${accountUrl}/authorize?${queryString}`;
    window.location = url;
  },

  // Get access_token, refresh_token, ...
  async getTokens(code) {
    const url = `${accountUrl}/api/token`;
    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
        Authorization:
          "Basic " +
          btoa(
            `${process.env.VUE_APP_SPOTIFY_CLIENT_ID}:${process.env.VUE_APP_SPOTIFY_CLIENT_SECRET}`
          )
      },
      body: `grant_type=authorization_code&code=${code}&redirect_uri=${process.env.VUE_APP_SPOTIFY_API_REDIRECT_URL}`
    })
      .then(response => response.json())
      .catch(error => {
        console.error(error);
      });
  },

  async refreshToken(refreshToken) {
    const url = `${accountUrl}/api/token`;
    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
        Authorization:
          "Basic " +
          btoa(
            `${process.env.VUE_APP_SPOTIFY_CLIENT_ID}:${process.env.VUE_APP_SPOTIFY_CLIENT_SECRET}`
          )
      },
      body: `grant_type=refresh_token&refresh_token=${refreshToken}`
    })
      .then(response => response.json())
      .catch(error => {
        console.error("Error refresh token", error);
      });
  }
};
