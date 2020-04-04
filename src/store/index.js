import Vue from "vue";
import Vuex from "vuex";
import LibSpotifyAccount from "@/lib/LibSpotifyAccount";
import LibPlayback from "@/lib/LibPlayback";
import LibSpotifyApi from "@/lib/LibSpotifyApi";

Vue.use(Vuex);

// init from localstorage
let spotifyAuth = null;
try {
  spotifyAuth = JSON.parse(localStorage.getItem("spotifyAuth"));
} catch (e) {
  localStorage.setItem("spotifyAuth", null);
}
let player = null;
let playerState = null;
let queue = null;
let currentTrack = null;

export default new Vuex.Store({
  state: {
    spotifyAuth,
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
            // save to localstorage
            localStorage.setItem("spotifyAuth", JSON.stringify(spotifyAuth));
            commit("setSpotifyAuth", spotifyAuth);
          } else {
            console.log("error", "Spotify getToken error", spotifyAuth);
          }
        });
      } else {
        console.log("error", "Spotify code not defined");
      }
    },

    initPlayer({ commit, state }) {
      if (state.spotifyAuth && state.spotifyAuth.access_token) {
        const player = LibPlayback.initPlayer();
        commit("setPlayer", player);
      } else {
        console.log("error", "Missing auth to init player", spotifyAuth);
      }
    },

    getQueue({ commit, state }) {
      if (state.spotifyAuth && state.spotifyAuth.access_token) {
        LibSpotifyApi.getTracks(state.spotifyAuth.access_token)
          .then(tracks => {
            commit("setQueue", tracks.tracks.splice(1));
          })
          .catch(() => {
            this.dispatch("refreshToken");
          });
      } else {
        console.log("error", "Missing auth to get tracks", spotifyAuth);
      }
    },

    refreshToken({ commit, state }, token) {
      state.spotifyAuth.access_token = token;
      localStorage.setItem("spotifyAuth", JSON.stringify(state.spotifyAuth));
      commit("setSpotifyAuth", spotifyAuth);
    }
  },
  mutations: {
    setSpotifyAuth(state, spotifyAuth) {
      state.spotifyAuth = spotifyAuth;
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
