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

export default new Vuex.Store({
  state: {
    spotifyAccessToken,
    spotifyRefreshToken,
    spotifyUser,
    player: null,
    playerState: null,
    queue: [],
    currentTrack: null,
    isConnected: false
  },

  actions: {
    async fetchSpotifyTokens({ commit, dispatch }, code) {
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
            dispatch("fetchSpotifyUser");
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

    initRoom({ dispatch }) {
      console.info("initRoom");
      LibPlayback.initPlayer();
      dispatch("fetchQueue");
    },

    fetchCurrentTrack({ commit, dispatch, state }) {
      console.info("fetchCurrentTrack");
      LibFirebase.getCurrentTrack().then(track => {
        commit("setCurrentTrack", track);
        if (!track) {
          dispatch("nextTrack");
        }

        if (!state.playerState || state.playerState.paused) {
          dispatch("play");
        }
      });
    },

    fetchQueue({ commit }) {
      console.info("fetchQueue");
      LibFirebase.getQueue().then(queue => {
        const sortQueue = queue.sort((track1, track2) => {
          return track2.vote - track1.vote;
        });
        commit("setQueue", sortQueue);
      });
    },

    nextTrack() {
      console.info("nextTrack");
      LibFirebase.getNextTrack();
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
    },

    // eslint-disable-next-line no-unused-vars
    vote({ commit, dispatch }, { track, increment }) {
      console.info("vote");
      LibFirebase.voteTrack(track, increment);
    },

    SOCKET_ADD_TRACK({ dispatch }) {
      dispatch("fetchQueue");
      dispatch("fetchCurrentTrack");
    },

    SOCKET_VOTE_TRACK({ dispatch }) {
      dispatch("fetchQueue");
    },

    SOCKET_NEXT_TRACK({ commit, state, dispatch }, track) {
      commit("setCurrentTrack", track);
      if (track) {
        dispatch("fetchQueue");
        dispatch("play");
      } else {
        state.player.pause();
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
    },
    SOCKET_CONNECT(state) {
      state.isConnected = true;
    },
    SOCKET_DISCONNECT(state) {
      state.isConnected = false;
    }
  }
});
