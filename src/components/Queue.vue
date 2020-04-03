<template>
  <div class="queue">
    <div class="queue_header">
      <h3>Queue</h3>
      <div class="queue-counter">
        <span class="count">{{ queue.length }}</span>
        Songs
      </div>
    </div>
    <div class="queue_list">
      <Track v-for="(track, index) of queue" :key="index" :track="track" />
    </div>
  </div>
</template>

<script>
import Track from "@/components/QueueTrack";

export default {
  name: "Queue",
  components: {
    Track
  },
  props: {
    queue: {
      type: Array,
      required: true
    }
  }
};
</script>
