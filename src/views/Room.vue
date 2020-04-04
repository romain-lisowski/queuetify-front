<template>
  <div class="room">
    <div class="room_content">
      <div class="room_content-wrapper">
        <div v-if="spotifyUser">
          <img
            height="50px"
            v-if="spotifyUser.images.length > 0"
            :src="spotifyUser.images[0].url"
          />
          <button class="btn btn-main hover-this" @click="logout">
            Logout
          </button>
        </div>
        <Search />
        <Player v-if="currentTrack" :current-track="currentTrack" />
        <div v-else>No playing track</div>
        <Queue v-if="queue && queue.length > 0" :queue="queue" />
        <div v-else>Empty queue</div>
      </div>
      <div class="add-track">
        Add a song
      </div>
    </div>
    <div
      v-if="currentTrack"
      class="room_bg"
      :style="{
        'background-image': 'url(' + currentTrack.album.images[0].url + ')'
      }"
    ></div>
  </div>
</template>

<script>
import Player from "@/components/Player";
import Queue from "@/components/Queue";
import Search from "@/components/Search";

export default {
  name: "Room",
  components: {
    Player,
    Queue,
    Search
  },
  computed: {
    currentTrack() {
      return this.$store.state.currentTrack;
    },
    queue() {
      return this.$store.state.queue;
    },
    spotifyUser() {
      return this.$store.state.spotifyUser;
    }
  },
  serverPrefetch: {
    tracks() {
      return this.fetchQueue();
    }
  },
  mounted() {
    if (!this.tracks) {
      this.fetchQueue();
    }
    this.$store.dispatch("initPlayer");
  },
  methods: {
    fetchQueue() {
      return this.$store.dispatch("getQueue");
    },
    logout() {
      this.$store.dispatch("logout");
      this.$router.push({ name: "Home" });
    }
  }
};
</script>
