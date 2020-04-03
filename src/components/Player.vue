<template>
  <div class="player">
    <div class="player__track">
      <div class="player__track_artwork">
        <img :src="currentTrack.album.images[0].url" />
      </div>
      <div class="player__track_info">
        <div class="track-name">
          {{ currentTrack.name }}
        </div>
        <div class="track-artist">
          {{ currentTrack.artists[0].name }}
        </div>
      </div>
    </div>

    <div class="player__controls">
      <div class="player__controls_mute"></div>

      <div class="player__controls_progress">
        <div class="durations">
          <div>{{ convertTime(currentTrack.duration_ms) }}</div>
          <div>{{ convertTime(currentTrack.duration_ms) }}</div>
        </div>
        <div class="progress-b"></div>
      </div>
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
