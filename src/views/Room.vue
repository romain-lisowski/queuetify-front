<template>
  <div class="room">
    <div class="room_content">
      <div class="room_content-wrapper">
        <Search />
        <Player :current-track="currentTrack" />
        <Queue :queue="queue" />
      </div>
      <div class="add-track">
        Add a song
      </div>
    </div>
    <div
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
    }
  }
};
</script>
