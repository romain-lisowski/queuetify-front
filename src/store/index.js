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
    socket: null,
    users: null
  },

  actions: {
    async fetchSpotifyTokens({ commit, dispatch }, code) {
      console.info("store: fetchSpotifyTokens");
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
      console.info("store: refreshToken");
      localStorage.setItem("spotifyAccessToken", token);
      commit("setSpotifyAccessToken", token);
    },

    logout({ commit, dispatch, state }) {
      console.info("store: logout");
      dispatch("SOCKET_DISCONNECT");

      commit("setSpotifyAccessToken", null);
      commit("setSpotifyRefreshToken", null);
      commit("setSpotifyUser", null);

      localStorage.removeItem("spotifyAccessToken");
      localStorage.removeItem("spotifyRefreshToken");
      localStorage.removeItem("spotifyUser");

      if (state.player) {
        state.player.disconnect();
      }
    },

    fetchSpotifyUser({ commit, state }) {
      console.info("store: fetchSpotifyUser");
      LibSpotifyUser.getUser(state.spotifyAccessToken).then(spotifyUser => {
        localStorage.setItem("spotifyUser", JSON.stringify(spotifyUser));
        commit("setSpotifyUser", spotifyUser);
      });
    },

    initRoom({ dispatch }) {
      console.info("store: initRoom");
      LibPlayback.initPlayer();
      dispatch("fetchQueue");
      dispatch("fetchUsers");
    },

    fetchUsers({ commit }) {
      console.info("store: fetchUsers");
      LibFirebase.getUsers().then(users => {
        commit("setUsers", users);
      });
    },

    fetchCurrentTrack({ commit, dispatch, state }) {
      console.info("store: fetchCurrentTrack");
      LibFirebase.getCurrentTrack().then(track => {
        commit("setCurrentTrack", track);

        if (!state.playerState || state.playerState.paused) {
          dispatch("play");
        }
      });
    },

    fetchQueue({ commit }) {
      console.info("store: fetchQueue");
      LibFirebase.getQueue().then(queue => {
        commit("setQueue", queue);
      });
    },

    play({ state }) {
      console.info("store: play");
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
      console.info("store: vote");
      LibFirebase.voteTrack(track, increment);
    },

    SOCKET_ADD_TRACK({ dispatch }) {
      console.log("store: SOCKET_ADD_TRACK");
      dispatch("fetchQueue");
      dispatch("fetchCurrentTrack");
    },

    SOCKET_VOTE_TRACK({ dispatch }) {
      console.log("store: SOCKET_VOTE_TRACK");
      dispatch("fetchQueue");
    },

    SOCKET_NEXT_TRACK({ commit, state, dispatch }, track) {
      console.log("store: SOCKET_NEXT_TRACK");
      commit("setCurrentTrack", track);
      if (track) {
        dispatch("fetchQueue");
        dispatch("play");
      } else {
        state.player.pause();
      }
    },

    SOCKET_DISCONNECT({ state }) {
      console.log("store: SOCKET_DISCONNECT");
      LibFirebase.removeUser(state.spotifyUser);
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
    setUsers(state, users) {
      state.users = users;
    },
    setCurrentTrack(state, track) {
      state.currentTrack = track;
    },
    setPlayerState(state, playerState) {
      state.playerState = playerState;
    }
  }
});
