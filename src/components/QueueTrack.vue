<template>
  <div>
    <h3>QUEUE TRACK</h3>
    <div>
      <strong>Artist:</strong>
      {{ track.artists[0].name }}
    </div>
    <div>
      <strong>Track :</strong>
      {{ track.name }}
    </div>
    <div>
      <strong>Duration :</strong>
      {{ convertTime(track.duration_ms) }}
    </div>
    <div>
      <img :src="track.album.images[2].url" />
    </div>
  </div>
</template>

<script>
import { millisToMinutesAndSeconds } from "@/lib/Utils";

export default {
  name: "QueueTrack",
  props: {
    track: {
      type: Object,
      required: true
    }
  },
  methods: {
    convertTime(millis) {
      return millisToMinutesAndSeconds(millis);
    }
  }
};
</script>
