<template>
  <div class="container">
    <h1>Room 1 :</h1>
    <ul>
      <li v-for="(track, index) of tracks" :key="index">
        <strong>Artist:</strong> {{ track.artists[0].name }}, <strong>Track :</strong> {{ track.name }}, <strong>Duration (ms) :</strong> {{ track.duration_ms }}
      </li>
    </ul>
  </div>
</template>

<script>
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
    }
  }
};
</script>
