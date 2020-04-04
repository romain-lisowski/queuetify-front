import Vue from "vue";
import Vuex from "vuex";
import LibSpotifyAccount from "@/lib/LibSpotifyAccount";
import LibPlayback from "@/lib/LibPlayback";
import LibSpotifyApi from "@/lib/LibSpotifyApi";

Vue.use(Vuex);

let spotifyAccessToken = null;
try {
  spotifyAccessToken = localStorage.getItem("spotifyAccessToken");
} catch (e) {
  localStorage.removeItem("spotifyAccessToken");
}

let spotifyRefreshToken = null;
try {
  spotifyRefreshToken = localStorage.getItem("spotifyRefreshToken");
} catch (e) {
  localStorage.removeItem("spotifyRefreshToken");
}

let player = null;
let playerState = null;
let queue = null;
let currentTrack = null;

export default new Vuex.Store({
  state: {
    spotifyAccessToken,
    spotifyRefreshToken,
    player,
    playerState,
    queue,
    currentTrack
  },

  actions: {
    async getSpotifyAuth({ commit }, code) {
      if (code !== "undefined") {
        LibSpotifyAccount.getTokens(code).then(spotifyAuth => {
          if (spotifyAuth.access_token !== undefined) {
            // save access_token and refresh_token to localstorage
            localStorage.setItem(
              "spotifyAccessToken",
              spotifyAuth.access_token
            );
            localStorage.setItem(
              "spotifyRefreshToken",
              spotifyAuth.refresh_token
            );
            commit("setSpotifyAccessToken", spotifyAuth.access_token);
            commit("setSpotifyRefreshToken", spotifyAuth.refresh_token);
          } else {
            console.error("store.getSpotifyAuth : ", spotifyAuth);
          }
        });
      } else {
        console.error("Spotify code not defined");
      }
    },

    refreshToken({ commit }, token) {
      localStorage.setItem("spotifyAccessToken", token);
      commit("setSpotifyAccessToken", token);
    },

    initPlayer({ commit, state }) {
      if (state.spotifyAccessToken) {
        const player = LibPlayback.initPlayer();
        commit("setPlayer", player);
      } else {
        console.error("store.initPlayer : ", state.spotifyAccessToken);
      }
    },

    getQueue({ commit, state }) {
      if (state.spotifyAccessToken) {
        LibSpotifyApi.getTracks(state.spotifyAccessToken).then(data => {
          if (data.tracks) {
            if (data.tracks.length === 1) {
              if (state.playerState && state.playerState.paused) {
                LibPlayback.play({ player: state.player });
              }
            } else {
              commit("setQueue", data.tracks.splice(1));
            }
          } else {
            commit("setQueue", []);
          }
        });
      } else {
        console.error("store.getQueue : ", spotifyAccessToken);
      }
    },

    nextTrack({ state }) {
      console.log(state.player);
      LibPlayback.play({ player: state.player });
      this.dispatch("getQueue");
    }
  },

  mutations: {
    setSpotifyAccessToken(state, token) {
      state.spotifyAccessToken = token;
    },
    setSpotifyRefreshToken(state, token) {
      state.spotifyRefreshToken = token;
    },
    setPlayer(state, player) {
      state.player = player;
    },
    setQueue(state, tracks) {
      state.queue = tracks;
    },
    setCurrentTrack(state, track) {
      state.currentTrack = track;
    },
    setPlayerState(state, playerState) {
      state.playerState = playerState;
    }
  }
});
