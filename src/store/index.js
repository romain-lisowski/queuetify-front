import Vue from "vue";
import Vuex from "vuex";
import LibSpotifyAccount from "@/lib/LibSpotifyAccount";
import LibPlayback from "@/lib/LibPlayback";
import LibSpotifyUser from "@/lib/LibSpotifyUser";
import LibFirebase from "@/lib/LibFirebase";

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

let spotifyUser = null;
try {
  spotifyUser = JSON.parse(localStorage.getItem("spotifyUser"));
} catch (e) {
  localStorage.removeItem("spotifyUser");
}

let player = null;
let playerState = null;
let queue = [];
let currentTrack = null;

export default new Vuex.Store({
  state: {
    spotifyAccessToken,
    spotifyRefreshToken,
    spotifyUser,
    player,
    playerState,
    queue,
    currentTrack
  },

  actions: {
    async fetchSpotifyTokens({ commit }, code) {
      console.info("fetchSpotifyTokens");
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
            this.dispatch("fetchSpotifyUser");
          } else {
            console.error("store.fetchSpotifyTokens : ", spotifyAuth);
          }
        });
      } else {
        console.error("Spotify code not defined");
      }
    },

    refreshToken({ commit }, token) {
      console.info("refreshToken");
      localStorage.setItem("spotifyAccessToken", token);
      commit("setSpotifyAccessToken", token);
    },

    logout({ commit, state }) {
      console.info("logout");
      commit("setSpotifyAccessToken", null);
      commit("setSpotifyRefreshToken", null);
      commit("setSpotifyUser", null);
      localStorage.removeItem("spotifyAccessToken");
      localStorage.removeItem("spotifyRefreshToken");
      localStorage.removeItem("spotifyUser");
      state.player.disconnect();
    },

    fetchSpotifyUser({ commit, state }) {
      console.info("fetchSpotifyUser");
      LibSpotifyUser.getUser(state.spotifyAccessToken).then(spotifyUser => {
        localStorage.setItem("spotifyUser", JSON.stringify(spotifyUser));
        commit("setSpotifyUser", spotifyUser);
      });
    },

    initRoom() {
      console.info("initRoom");
      LibPlayback.initPlayer();
      this.dispatch("fetchQueue");
    },

    fetchCurrentTrack({ commit, state }) {
      console.info("fetchCurrentTrack");
      LibFirebase.getCurrentTrack().then(track => {
        commit("setCurrentTrack", track);
        if (!track) {
          this.dispatch("nextTrack");
        }

        if (!state.playerState || state.playerState.paused) {
          this.dispatch("play");
        }
      });
    },

    fetchQueue({ commit }) {
      console.info("fetchQueue");
      LibFirebase.getQueue().then(queue => {
        commit("setQueue", queue);
      });
    },

    nextTrack({ commit, state }) {
      console.info("nextTrack");
      LibFirebase.getNextTrack().then(track => {
        commit("setCurrentTrack", track);
        if (track) {
          this.dispatch("fetchQueue");
          this.dispatch("play");
        } else {
          state.player.pause();
        }
      });
    },

    addTrack() {
      console.info("addTrack");
      this.dispatch("fetchQueue");
      this.dispatch("fetchCurrentTrack");
    },

    play({ state }) {
      console.info("play");
      if (state.currentTrack) {
        LibPlayback.play({
          player: state.player,
          trackId: state.currentTrack.id
        });
      } else {
        console.log("No track to play");
      }
    }
  },

  mutations: {
    setSpotifyAccessToken(state, token) {
      state.spotifyAccessToken = token;
    },
    setSpotifyRefreshToken(state, token) {
      state.spotifyRefreshToken = token;
    },
    setSpotifyUser(state, spotifyUser) {
      state.spotifyUser = spotifyUser;
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
