<template>
  <div>
    <h2>PLAYER</h2>
    <div>
      <strong>Artist:</strong>
      {{ currentTrack.artists[0].name }}
    </div>
    <div>
      <strong>Track :</strong>
      {{ currentTrack.name }}
    </div>
    <div>
      <strong>Duration :</strong>
      {{ convertTime(currentTrack.duration_ms) }}
    </div>
    <div>
      <img :src="currentTrack.album.images[0].url" />
    </div>
  </div>
</template>

<script>
import { millisToMinutesAndSeconds } from "@/lib/Utils";

export default {
  name: "Player",
  props: {
    currentTrack: {
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
