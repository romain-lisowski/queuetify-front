import LibSpotifyAccount from "@/lib/LibSpotifyAccount";
import store from "@/store";

const spotifyApiUrl = "https://api.spotify.com";

export default {
  initPlayer() {
    let player = null;

    window.onSpotifyWebPlaybackSDKReady = () => {
      // eslint-disable-next-line no-undef
      player = new Spotify.Player({
        name: "Queue Web Playback Player",
        getOAuthToken: cb => {
          // get new token
          let accessToken = null;
          LibSpotifyAccount.refreshToken(store.state.spotifyRefreshToken)
            .then(token => {
              accessToken = token.access_token;
              store.dispatch("refreshToken", accessToken);
              cb(accessToken);
            })
            .catch(error => {
              console.log("Error refreshing token", error);
            });
        }
      });

      this.addListeners(player);
      store.commit("setPlayer", player);
      player.connect();

      // store player state every second and skip track if played
      setInterval(() => {
        player.getCurrentState().then(state => {
          if (state && !state.paused) {
            store.commit("setPlayerState", state);
            if (
              store.state.currentTrack &&
              store.state.currentTrack.duration - state.position < 1000
            ) {
              store.dispatch("nextTrack");
            }
          }
        });
      }, 1000);
    };
  },

  addListeners(player) {
    // Playback status updates
    player.addListener("player_state_changed", state => {
      store.commit("setPlayerState", state);
      console.log(state);
    });

    // Ready
    // eslint-disable-next-line camelcase
    player.addListener("ready", ({ device_id }) => {
      console.log("Ready with Device ID", device_id);
      store.dispatch("fetchCurrentTrack");
    });
  },

  async play({
    player: {
      _options: { getOAuthToken, id }
    },
    trackId
  }) {
    getOAuthToken(accessToken => {
      fetch(`${spotifyApiUrl}/v1/me/player/play?device_id=${id}`, {
        method: "PUT",
        body: JSON.stringify({
          uris: ["spotify:track:" + trackId]
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`
        }
      });
    });
  }
};
