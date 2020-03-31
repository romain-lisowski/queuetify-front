import PlaylistLib from "@/lib/Playlist";
import store from "@/store";
const spotifyApiUrl = "https://api.spotify.com";

export default {
  initPlayer(accessToken) {
    let player = null;

    window.onSpotifyWebPlaybackSDKReady = () => {
      // eslint-disable-next-line no-undef
      player = new Spotify.Player({
        name: "Queue Web Playback Player",
        getOAuthToken: cb => {
          cb(accessToken);
        }
      });

      this.addListeners(player);
      store.commit("setPlayer", player);
      player.connect();
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
    const track = await PlaylistLib.getCurrentTrackId();
    getOAuthToken(accessToken => {
      fetch(`${spotifyApiUrl}/v1/me/player/play?device_id=${id}`, {
        method: "PUT",
        body: JSON.stringify({
          uris: ["spotify:track:" + track]
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`
        }
      });
    });
  }
};
