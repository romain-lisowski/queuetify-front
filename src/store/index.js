import Vue from "vue";
import Vuex from "vuex";
import LibSpotifyAccount from "@/lib/LibSpotifyAccount";
import LibPlayback from "@/lib/LibPlayback";
import LibSpotifyUser from "@/lib/LibSpotifyUser";
import LibServerApi from "@/lib/LibServerApi";

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
    users: null,
    rooms: [],
    currentRoom: null
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

    initRoom({ commit, dispatch, state }, { roomName }) {
      if (state.player) {
        state.player.disconnect();
      }
      LibPlayback.initPlayer();
      LibServerApi.addUser(roomName, state.spotifyUser);
      commit("setCurrentRoom", roomName);
      dispatch("fetchRooms");
      dispatch("fetchTracks");
      dispatch("fetchUsers");
    },

    fetchUsers({ commit, state }) {
      LibServerApi.getUsers(state.currentRoom, state.spotifyUser).then(
        users => {
          commit("setUsers", users);
        }
      );
    },

    fetchRooms({ commit }) {
      LibServerApi.getRooms().then(rooms => {
        commit("setRooms", rooms);
      });
    },

    fetchTracks({ commit, state }) {
      LibServerApi.getTracks(state.currentRoom).then(queue => {
        commit("setQueue", queue);
      });
    },

    async fetchCurrentTrack({ commit, state }) {
      const track = await LibServerApi.getCurrentTrack(state.currentRoom);
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

    vote({ state }, { track, increment }) {
      LibServerApi.voteTrack(
        state.currentRoom,
        track,
        increment,
        state.spotifyUser
      );
    },

    SOCKET_REFRESH_TRACKS({ dispatch }) {
      dispatch("fetchTracks");
    },

    SOCKET_REFRESH_CURRENT_TRACK({ dispatch }) {
      dispatch("fetchCurrentTrack");
    },

    SOCKET_REFRESH_USERS({ dispatch }) {
      dispatch("fetchUsers");
    },

    SOCKET_CONNECT({ dispatch }) {
      dispatch("fetchUsers");
    },

    SOCKET_DISCONNECT({ dispatch, state }) {
      LibServerApi.removeUser(state.currentRoom, state.spotifyUser);
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
    },
    setRooms(state, rooms) {
      state.rooms = rooms;
    },
    setCurrentRoom(state, room) {
      state.currentRoom = room;
    }
  }
});
