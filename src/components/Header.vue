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
          <button class="" @click="logout">
            Logout
          </button>
        </li>
      </ul>
    </div>

    <div v-if="users && users.length > 0" class="users">
      <div v-for="user of users" :key="user.spotify_id" class="user">
        
          <div class="user_name">{{ user.name }}</div>
          <div class="user_avatar">
            <!-- todo later if avatar else -->
            <div class="avatar-placeholder">
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
    }
  },
  methods: {
    logout() {
      this.$store.dispatch("logout");
      this.$router.push({ name: "Home" });
    }
  }
};
</script>
