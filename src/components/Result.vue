<template>
  <div
    class="queue-track"
    :class="{
      inactive:
        alreadyInQueue || queueMaxLengthReach || queueMaxLengthPerUserReach
    }"
  >
    <div class="queue-track__info">
      <div class="queue-track__info_artwork">
        <img
          v-if="track && track.album.images.length >= 2"
          :src="track.album.images[2].url"
        />
        <div class="artwork-default" v-else></div>
      </div>
      <div class="queue-track__info_content">
        <div class="track-name">
          <span v-if="track">{{ track.name }}</span>
        </div>
        <div class="track-artist">
          <span v-if="track">{{ track.artists[0].name }}</span>
        </div>
      </div>
    </div>
    <button @click="addTrack" class="btn btn-inline">
      Add to queue
    </button>
  </div>
</template>

<script>
import LibFirebase from "@/lib/LibFirebase";

export default {
  name: "Result",
  props: {
    track: {
      type: Object,
      required: true
    }
  },
  computed: {
    alreadyInQueue() {
      const existingTrack = this.$store.state.queue.find(
        track => track.id === this.track.id
      );
      return existingTrack !== undefined;
    },
    queueMaxLengthReach() {
      return (
        this.$store.state.queue.length >=
        process.env.VUE_APP_QUEUE_MAX_QUEUE_LENGTH
      );
    },
    queueMaxLengthPerUserReach() {
      const userTracks = this.$store.state.queue.filter(
        track =>
          track.user.spotify_id === this.$store.state.spotifyUser.spotify_id
      );
      return (
        userTracks &&
        userTracks.length >= process.env.VUE_APP_QUEUE_MAX_QUEUE_LENGTH_PER_USER
      );
    }
  },
  methods: {
    addTrack() {
      LibFirebase.addTrack(this.track);
    }
  }
};
</script>
