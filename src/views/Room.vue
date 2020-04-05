<template>
  <div class="room" v-on:keyup.esc="closeSearch" tabindex="0">
    <Debug />
    <Header />

    <Search ref="search" />

    <div class="room_content">
      <div class="room_content-wrapper">
        <Player />
        <Queue :queue="queue" />
      </div>

      <button class="add-track" @click="showSearch">
        <span>+</span>
        Add a song
      </button>
    </div>
    <div
      v-if="currentTrack"
      class="room_bg"
      :style="{
        'background-image': 'url(' + currentTrack.album.images[0].url + ')'
      }"
    ></div>
    <div v-else class="room_bg-default"></div>
  </div>
</template>

<script>
import Player from "@/components/Player";
import Queue from "@/components/Queue";
import Search from "@/components/Search";
import Header from "@/components/Header";
import Debug from "@/components/Debug";

export default {
  name: "Room",
  components: {
    Player,
    Queue,
    Search,
    Header,
    Debug
  },
  computed: {
    currentTrack() {
      return this.$store.state.currentTrack;
    },
    queue() {
      return this.$store.state.queue;
    }
  },
  serverPrefetch: {
    tracks() {
      return this.fetchQueue();
    }
  },
  created() {
    let spotifyPlayerScript = document.createElement("script");
    spotifyPlayerScript.setAttribute(
      "src",
      "https://sdk.scdn.co/spotify-player.js"
    );
    document.head.appendChild(spotifyPlayerScript);
  },
  mounted() {
    if (!this.tracks) {
      this.fetchQueue();
      this.$store.dispatch("initPlayer");
    }
  },
  methods: {
    fetchQueue() {
      return this.$store.dispatch("getQueue");
    },
    showSearch() {
      this.$refs.search.$refs.searchWrapper.classList.toggle("active");
      this.$refs.search.$refs.searchInput.focus();
    },
    closeSearch() {
      this.$refs.search.$refs.searchWrapper.classList.remove("active");
    }
  }
};
</script>
