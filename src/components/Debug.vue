<template>
  <div class="debug">
    <div class="actions">
      <button @click="next">
        Next
      </button>
      <button @click="empty">
        Empty
      </button>
    </div>
  </div>
</template>

<script>
import LibFirebase from "@/lib/LibFirebase";

export default {
  name: "Search",
  methods: {
    next() {
      this.$store.dispatch("nextTrack");
    },
    empty() {
      const tracks = this.$store.state.queue;
      tracks.forEach(track => {
        LibFirebase.removeTrackFromQueue(track);
      });
      this.$store.dispatch("fetchQueue");
      this.$store.dispatch("nextTrack");
    }
  }
};
</script>
