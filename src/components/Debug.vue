<template>
  <div class="search">
    <h2>DEBUG PANEL</h2>
    <button class="btn btn-main hover-this" @click="next">
      Next track
    </button>
    <button class="btn btn-main hover-this" @click="empty">
      Empty queue
    </button>
  </div>
</template>

<script>
import LibFirebase from "@/lib/LibFirebase";

export default {
  name: "Search",
  methods: {
    next() {
      console.log("next");
      LibFirebase.removeTrack(this.$store.state.currentTrack.id);
    },
    empty() {
      console.log("empty");
      const tracks = this.$store.state.queue;
      tracks.forEach(track => {
        LibFirebase.removeTrack(track.id);
      });
    }
  }
};
</script>
