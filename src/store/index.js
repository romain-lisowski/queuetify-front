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
    users: null
  },

  actions: {
    async fetchSpotifyTokens({ commit, dispatch }, code) {
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
      localStorage.setItem("spotifyAccessToken", token);
      commit("setSpotifyAccessToken", token);
    },

    logout({ commit, dispatch, state }) {
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
      LibSpotifyUser.getUser(state.spotifyAccessToken).then(spotifyUser => {
        localStorage.setItem("spotifyUser", JSON.stringify(spotifyUser));
        commit("setSpotifyUser", spotifyUser);
      });
    },

    initRoom({ dispatch }) {
      LibPlayback.initPlayer();
      dispatch("fetchQueue");
      dispatch("fetchUsers");
    },

    fetchUsers({ commit }) {
      LibFirebase.getUsers().then(users => {
        commit("setUsers", users);
      });
    },

    fetchQueue({ commit }) {
      LibFirebase.getTracks().then(queue => {
        commit("setQueue", queue);
      });
    },

    async fetchCurrentTrack({ commit, state }) {
      const track = await LibFirebase.getCurrentTrack();
      commit("setCurrentTrack", track);

      if (!state.playerState || state.playerState.paused) {
        if (track) {
          LibPlayback.play({
            player: state.player,
            trackId: track.id
          });
        } else {
          console.log("No track to play");
        }
      }
    },

    // eslint-disable-next-line no-unused-vars
    vote({ commit, dispatch }, { socket, track, increment }) {
      LibFirebase.voteTrack(socket, track, increment);
    },

    SOCKET_ADD_TRACK({ dispatch }) {
      dispatch("fetchQueue");
    },

    SOCKET_VOTE_TRACK({ dispatch }) {
      dispatch("fetchQueue");
    },

    SOCKET_NEXT_TRACK({ dispatch }) {
      dispatch("fetchQueue");
      dispatch("fetchCurrentTrack");
    },

    SOCKET_CONNECT({ dispatch }) {
      dispatch("fetchUsers");
    },

    SOCKET_DISCONNECT({ dispatch, state }) {
      LibFirebase.removeUser(state.spotifyUser);
      dispatch("fetchUsers");
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
