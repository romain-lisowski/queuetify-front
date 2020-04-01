import Vue from "vue";
import Vuex from "vuex";
import SpotifyAuthLib from "@/lib/SpotifyAuth";
import PlayerLib from "@/lib/Player";
import PlaylistLib from "@/lib/Playlist";

Vue.use(Vuex);

// init from localstorage
let spotifyAuth = null;
try {
  spotifyAuth = JSON.parse(localStorage.getItem("spotifyAuth"));
} catch (e) {
  localStorage.setItem("spotifyAuth", null);
}

let player = null;
let queue = null;
let currentTrack = null;

export default new Vuex.Store({
  state: {
    spotifyAuth,
    player,
    queue,
    currentTrack
  },
  actions: {
    async spotifyGetTokens({ commit }, code) {
      if (code !== "undefined") {
        const spotifyAuth = await SpotifyAuthLib.getTokens(code);
        if (spotifyAuth.access_token !== undefined) {
          // save to localstorage
          localStorage.setItem("spotifyAuth", JSON.stringify(spotifyAuth));
          commit("setSpotifyAuth", spotifyAuth);
        } else {
          console.log("error", "Spotify getToken error", spotifyAuth);
        }
      } else {
        console.log("error", "Spotify code not defined");
      }
    },

    async initPlayer({ commit, state }) {
      if (state.spotifyAuth && state.spotifyAuth.access_token) {
        const player = PlayerLib.initPlayer(spotifyAuth.access_token);
        commit("setPlayer", player);
      } else {
        console.log("error", "Missing auth to init player", spotifyAuth);
      }
    },

    getQueue({ commit, state }) {
      if (state.spotifyAuth && state.spotifyAuth.access_token) {
        return PlaylistLib.getTracks(state.spotifyAuth.access_token).then(
          tracks => {
            commit("setQueue", tracks.tracks.splice(1));
          }
        );
      } else {
        console.log("error", "Missing auth to get tracks", spotifyAuth);
      }
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
    }
  }
});
