<template>
  <div class="container">
    <h1>Room 1 :</h1>
    <Player v-if="currentTrack" :current-track="currentTrack" />
    <Queue v-if="queue" :queue="queue" />
  </div>
</template>

<script>
import Player from "@/components/Player";
import Queue from "@/components/Queue";

export default {
  name: "Room",
  components: {
    Player,
    Queue
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
