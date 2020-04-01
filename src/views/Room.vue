<template>
  <div class="container">
    <h1>Room 1 :</h1>
    <ul>
      <li v-for="(track, index) of tracks" :key="index">
        <div><strong>Artist:</strong> {{ track.artists[0].name }}</div>
        <div><strong>Track :</strong> {{ track.name }}</div>
        <div>
          <strong>Duration :</strong>
          {{ convertTime(track.duration_ms) }}
        </div>
        <div><img :src="track.album.images[1].url" /></div>
      </li>
    </ul>
  </div>
</template>

<script>
import { millisToMinutesAndSeconds } from "@/lib/Utils";

export default {
  name: "Room",
  computed: {
    tracks() {
      return this.$store.state.tracks;
    }
  },
  serverPrefetch: {
    tracks() {
      return this.fetchTracks();
    }
  },
  mounted() {
    if (!this.tracks) {
      this.fetchTracks();
    }
    this.$store.dispatch("initPlayer");
  },
  methods: {
    fetchTracks() {
      return this.$store.dispatch("getTracks");
    },
    convertTime(millis) {
      return millisToMinutesAndSeconds(millis);
    }
  }
};
</script>
