import LibSpotifyAccount from "@/lib/LibSpotifyAccount";
import store from "@/store";
import { DateTime } from "luxon";

const spotifyApiUrl = process.env.VUE_APP_SPOTIFY_API_URL;

export default {
  /**
   * Wait SDK to be loaded
   */
  async waitForSpotifyWebPlaybackSDKToLoad() {
    return new Promise(resolve => {
      if (window.Spotify) {
        resolve(window.Spotify);
      } else {
        window.onSpotifyWebPlaybackSDKReady = () => {
          resolve(window.Spotify);
        };
      }
    });
  },

  /**
   * Init Spotify playback
   */
  async initPlayer() {
    let player = null;

    const { Player } = await this.waitForSpotifyWebPlaybackSDKToLoad();
    player = new Player({
      name: "Queuetify Web Player",
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
  },

  /**
   * Add listeners to the Spotify playback
   */
  addListeners(player) {
    // Playback status updates
    player.addListener("player_state_changed", state => {
      // from pause to play
      if (
        store.state.playerState &&
        store.state.playerState.paused &&
        !state.paused
      ) {
        store.dispatch("fetchCurrentTrack");
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

  /**
   * Play track on Spotify playback
   */
  async play({ player, trackId }) {
    const begin = DateTime.fromSeconds(
      store.state.currentTrack.played_at.seconds
    );
    const now = DateTime.local().setZone("utc");
    const seek = now - begin > 0 ? now - begin : 0;

    player._options.getOAuthToken(accessToken => {
      fetch(
        `${spotifyApiUrl}/v1/me/player/play?device_id=${player._options.id}`,
        {
          method: "PUT",
          body: JSON.stringify({
            uris: ["spotify:track:" + trackId],
            position_ms: seek
          }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`
          }
        }
      );
    });
  },

  /**
   * Seek and go to position on current track
   */
  seek(player) {
    if (store.state.currentTrack) {
      const begin = DateTime.fromSeconds(
        store.state.currentTrack.played_at.seconds
      );
      const now = DateTime.local().setZone("utc");
      const seek = now - begin;

      // seek position on track
      if (seek > 2000) {
        player.seek(seek);
      }
    }
  }
};
