<template>
  <div class="header" v-if="spotifyUser">
    <div class="user">
      <div class="user_avatar">
        <img
          v-if="spotifyUser.images.length > 0"
          :src="spotifyUser.images[0].url"
        />
        <div v-else class="avatar-placeholder">
          <span>{{ spotifyUser.display_name.charAt(0) }}</span>
        </div>
      </div>
      <div class="user_name">{{ spotifyUser.display_name }}<UserArrow /></div>

      <ul class="user_menu">
        <li>
          <button class="" @click="logout">
            Logout
          </button>
        </li>
      </ul>
    </div>

    <!-- Get other connected users -->
    <div class="users">
      <!-- if no other users -->
      <!-- 
      <div class="user-none"></div>
      -->

      <!-- else : display users -->
      <!-- for other users -->
      <div class="user">
        <div class="user_name">{{ spotifyUser.display_name }}</div>
        <div class="user_avatar">
          <!-- todo later if avatar else -->
          <div class="avatar-placeholder">
            <span>{{ spotifyUser.display_name.charAt(0) }}</span>
          </div>
        </div>
      </div>

      <div class="user">
        <div class="user_name">{{ spotifyUser.display_name }}</div>
        <div class="user_avatar">
          <div class="avatar-placeholder">
            <span>{{ spotifyUser.display_name.charAt(0) }}</span>
          </div>
        </div>
      </div>

      <div class="user">
        <div class="user_name">{{ spotifyUser.display_name }}</div>
        <div class="user_avatar">
          <div class="avatar-placeholder">
            <span>{{ spotifyUser.display_name.charAt(0) }}</span>
          </div>
        </div>
      </div>
      <!-- endfor -->
    </div>
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
