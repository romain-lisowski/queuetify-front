<template>
  <div class="room">
    <Header />

    <div ref="search" class="search-wrapper">
      <Search />
    </div>

    <div class="room_content">
      <div class="room_content-wrapper">
        <Player v-if="currentTrack" :current-track="currentTrack" />
        <div v-else>No playing track</div>
        <Queue v-if="queue && queue.length > 0" :queue="queue" />
        <div v-else>Empty queue</div>
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
  </div>
</template>

<script>
import Player from "@/components/Player";
import Queue from "@/components/Queue";
import Search from "@/components/Search";
import Header from "@/components/Header";

export default {
  name: "Room",
  components: {
    Player,
    Queue,
    Search,
    Header
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
    },
    showSearch() {
      this.$refs.search.classList.toggle("active");
    }
  }
};
</script>
