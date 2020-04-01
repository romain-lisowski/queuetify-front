<template>
  <div>
    <h2>QUEUE</h2>
    <div v-for="(track, index) of queue" :key="index">
      <Track :track="track" />
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
