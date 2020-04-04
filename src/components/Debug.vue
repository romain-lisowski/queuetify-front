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
