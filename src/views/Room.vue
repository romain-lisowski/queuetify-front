<template>
  <div
    class="room"
    v-on:keyup.esc="closeSearch"
    tabindex="0"
    v-click-outside="closeSearch"
  >
    <Debug />
    <Header />

    <Search ref="search" />

    <div class="room_content">
      <div class="room_content-wrapper">
        <Player :track="currentTrack" />
        <Queue :queue="queue" />
      </div>

      <button class="add-track" @click="showSearch">
        <span>+</span>
        Add a song
      </button>
    </div>
    <div class="room_bg-texture"></div>
    <div
      v-if="currentTrack"
      class="room_bg"
      :style="{
        'background-image': 'url(' + currentTrack.image_big + ')'
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
  created() {
    // insert spotify script
    let spotifyPlayerScript = document.createElement("script");
    spotifyPlayerScript.setAttribute(
      "src",
      "https://sdk.scdn.co/spotify-player.js"
    );
    document.head.appendChild(spotifyPlayerScript);

    // init player, queue, current track, ...
    this.$store.dispatch("initRoom");
  },
  methods: {
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
