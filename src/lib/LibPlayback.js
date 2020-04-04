import LibSpotifyApi from "@/lib/LibSpotifyApi";
import LibSpotifyAccount from "@/lib/LibSpotifyAccount";
import LibFirebase from "@/lib/LibFirebase";
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
            if (store.state.currentTrack.duration_ms - state.position < 1000) {
              LibFirebase.removeTrack(store.state.currentTrack.id);
            }
          }
        });
      }, 1000);
    };
  },
  addListeners(player) {
    // Error handling
    player.addListener("initialization_error", ({ message }) => {
      console.error(message);
    });
    player.addListener("authentication_error", ({ message }) => {
      console.error(message);
    });
    player.addListener("account_error", ({ message }) => {
      console.error(message);
    });
    player.addListener("playback_error", ({ message }) => {
      console.error(message);
    });

    // Playback status updates
    player.addListener("player_state_changed", state => {
      store.commit("setPlayerState", state);
      console.log(state);
    });

    // Not Ready
    // eslint-disable-next-line camelcase
    player.addListener("not_ready", ({ device_id }) => {
      console.log("Device ID has gone offline", device_id);
    });

    // Ready
    // eslint-disable-next-line camelcase
    player.addListener("ready", ({ device_id }) => {
      console.log("Ready with Device ID", device_id);
      this.play({ player });
    });
  },

  async play({
    player: {
      _options: { getOAuthToken, id }
    }
  }) {
    getOAuthToken(async accessToken => {
      const track = await LibSpotifyApi.getCurrentTrack(accessToken);
      if (track && track.id) {
        store.commit("setCurrentTrack", track);
        fetch(`${spotifyApiUrl}/v1/me/player/play?device_id=${id}`, {
          method: "PUT",
          body: JSON.stringify({
            uris: ["spotify:track:" + track.id]
          }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`
          }
        });
      } else {
        store.commit("setCurrentTrack", null);
      }
    });
  }
};
