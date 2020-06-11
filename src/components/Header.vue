<template>
  <div class="header" v-if="spotifyUser">
    <div class="user">
      <div class="user_avatar">
        <img v-if="spotifyUser.image" :src="spotifyUser.image" />
        <div v-else class="avatar-placeholder">
          <span>{{ spotifyUser.name.charAt(0) }}</span>
        </div>
      </div>
      <div class="user_name">{{ spotifyUser.name }}<UserArrow /></div>

      <ul class="user_menu">
        <li>
          <button @click="logout">
            Logout
          </button>
        </li>
      </ul>
    </div>

    <div class="room_info">
      <div class="room_info__status">
        <span v-if="sync" class="sync"></span>
        <span v-else class="unsync"></span>
      </div>
      <div v-if="currentRoom" class="room_info__name">{{ currentRoom.name }}<UserArrow /></div>
      <ul class="room_info__menu">
        <li>
          <button @click="home">
            Change room
          </button>
        </li>
      </ul>
    </div>

    <div v-if="users && users.length > 0" class="users">
      <div v-for="user of users" :key="user.spotify_id" class="user">
        <div class="user_name">
          <a :href="user.spotify_url" target="_blank">
            {{ user.name }}
          </a>
        </div>
        <div class="user_avatar">
          <img v-if="user.image" :src="user.image" />
          <div v-else class="avatar-placeholder">
            <span>{{ user.name.charAt(0) }}</span>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="user-none"></div>
  </div>
</template>

<script>
import UserArrow from "@/assets/svg/user-arrow.svg";

export default {
  name: "Header",
  components: {
    UserArrow
  },
  computed: {
    spotifyUser() {
      return this.$store.state.spotifyUser;
    },
    users() {
      return this.$store.state.users;
    },
    currentRoom() {
      return this.$store.state.currentRoom;
    },
    sync() {
      return (
        (!this.$store.state.playerState && !this.$store.state.currentTrack) ||
        (this.$store.state.playerState &&
          this.$store.state.currentTrack &&
          this.$store.state.playerState.track_window.current_track.id ===
            this.$store.state.currentTrack.id)
      );
    }
  },
  methods: {
    home() {
      this.$router.push({ name: "Home" });
    },
    logout() {
      this.$store.dispatch("logout");
      this.$router.push({ name: "Home" });
    }
  }
};
</script>
