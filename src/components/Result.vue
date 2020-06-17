<template>
  <div
    class="queue-track"
    @click="addTrack"
    @mousemove="trackHover"
    @mouseenter="trackIn"
    @mouseleave="trackOut"
    :class="{
      inactive:
        alreadyInQueue || queueMaxLengthReach || queueMaxLengthPerUserReach
    }"
  >
    <div ref="cursorWrapper" class="cursor-wrapper">
      <div v-if="queueMaxLengthReach" ref="cursor" class="queue-track_cursor">
        Sorry, the queue is full 😵
      </div>
      <div
        v-else-if="queueMaxLengthPerUserReach"
        ref="cursor"
        class="queue-track_cursor"
      >
        Sorry, you added too many songs 😵
      </div>
      <div v-else-if="!alreadyInQueue" ref="cursor" class="queue-track_cursor">
        Add to queue<ButtonArrow />
      </div>
      <div v-else ref="cursor" class="queue-track_cursor">Already in queue</div>
    </div>
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
    <div>
      {{ convertTime(track.duration_ms) }}
    </div>
  </div>
</template>

<script>
import { millisToMinutesAndSeconds } from "@/lib/LibUtils";
import ButtonArrow from "@/assets/svg/button-arrow.svg";
import LibServerApi from "@/lib/LibServerApi";

export default {
  name: "Result",
  components: {
    ButtonArrow
  },
  props: {
    track: {
      type: Object,
      required: true
    }
  },
  computed: {
    alreadyInQueue() {
      const existingTrack = this.$store.state.queue.find(
        track => track.spotify_id === this.track.id
      );
      return existingTrack !== undefined;
    },
    queueMaxLengthReach() {
      return (
        this.$store.state.queue.length >=
        process.env.VUE_APP_RASPUTIFY_MAX_QUEUE_LENGTH
      );
    },
    queueMaxLengthPerUserReach() {
      const userTracks = this.$store.state.queue.filter(
        track =>
          track.user.spotify_id === this.$store.state.spotifyUser.spotify_id
      );
      return (
        userTracks &&
        userTracks.length >=
          process.env.VUE_APP_RASPUTIFY_MAX_QUEUE_LENGTH_PER_USER
      );
    }
  },
  methods: {
    addTrack() {
      const existingTrack = this.$store.state.queue.find(
        track => track.spotify_id === this.track.id
      );

      if (existingTrack === undefined) {
        LibServerApi.addTrack(
          this.$store.state.currentRoom,
          this.track,
          this.$store.state.spotifyUser
        );
      }
    },
    trackHover(e) {
      const cursorWrapper = this.$refs.cursorWrapper;
      const { clientX: x, clientY: y } = e;
      if (cursorWrapper) {
        cursorWrapper.style.left = x + "px";
        cursorWrapper.style.top = y + "px";
      }
    },
    trackIn() {
      const cursor = this.$refs.cursor;
      if (cursor) {
        cursor.classList.add("active");
      }
    },
    trackOut() {
      const cursor = this.$refs.cursor;
      if (cursor) {
        cursor.classList.remove("active");
      }
    },
    convertTime(millis) {
      return millisToMinutesAndSeconds(millis);
    }
  }
};
</script>
