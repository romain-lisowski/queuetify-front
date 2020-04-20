import LibSpotifyAccount from "@/lib/LibSpotifyAccount";
import store from "@/store";
import { DateTime } from "luxon";

const spotifyApiUrl = process.env.VUE_APP_SPOTIFY_API_URL;

export default {
  initPlayer() {
    let player = null;

    window.onSpotifyWebPlaybackSDKReady = () => {
      // eslint-disable-next-line no-undef
      player = new Spotify.Player({
        name: "Q Web Player",
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
          }
        });
      }, 1000);
    };
  },

  addListeners(player) {
    // Playback status updates
    player.addListener("player_state_changed", state => {
      // from pause to play
      if (
        store.state.playerState &&
        store.state.playerState.paused &&
        !state.paused
      ) {
        this.seek(player);
      }

      store.commit("setPlayerState", state);
    });

    // Ready
    // eslint-disable-next-line camelcase
    player.addListener("ready", ({ device_id }) => {
      console.log("Ready with Device ID", device_id);
      store.dispatch("fetchCurrentTrack");
    });
  },

  async play({ player, trackId }) {
    player._options.getOAuthToken(accessToken => {
      fetch(
        `${spotifyApiUrl}/v1/me/player/play?device_id=${player._options.id}`,
        {
          method: "PUT",
          body: JSON.stringify({
            uris: ["spotify:track:" + trackId]
          }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`
          }
        }
      ).then(() => {
        setTimeout(() => {
          this.seek(player);
        }, 1000);
      });
    });
  },

  seek(player) {
    if (store.state.currentTrack) {
      const begin = DateTime.fromSeconds(
        store.state.currentTrack.played.seconds
      );
      const now = DateTime.local().setZone("utc");
      const seek = now - begin;

      // seek position on track
      if (seek > 0) {
        player.seek(seek);
      }
    }
  }
};
