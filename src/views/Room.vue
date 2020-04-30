<template>
  <transition
    v-on:before-appear="customBeforeAppearHook"
    v-on:appear="customAppearHook"
    v-on:after-appear="customAfterAppearHook"
  >
    <div class="room" v-on:keyup.esc="closeSearch" tabindex="0">
      <div ref="loaderBefore" class="loader-before"></div>
      <div ref="loaderAfter" class="loader-after"></div>
      <Header />

      <Search ref="search" />

      <div class="room_content">
        <div class="room_content-wrapper">
          <Player :track="currentTrack" />
          <Queue :queue="queue" />
        </div>
        <button ref="addTrack" class="add-track" @click="showSearch">
          <span class="icon">+</span>
          Add a song
          <span class="info"
            >{{ userRemainingTracks }}
            <span class="small">remaining</span></span
          >
        </button>
      </div>
      <div class="room_bg-texture"></div>
      <div
        v-if="currentTrack"
        class="room_bg"
        :style="{
          'background-image': 'url(' + currentTrack.image_big + ')'
        }"
      ></div>
      <div v-else class="room_bg-default"></div>
    </div>
  </transition>
</template>

<script>
import Player from "@/components/Player";
import Queue from "@/components/Queue";
import Search from "@/components/Search";
import Header from "@/components/Header";
import { TimelineLite, Back } from "gsap";

export default {
  name: "Room",
  components: {
    Player,
    Queue,
    Search,
    Header
  },
  props: {
    name: {
      type: String,
      required: true
    }
  },
  computed: {
    currentTrack() {
      return this.$store.state.currentTrack;
    },
    queue() {
      return this.$store.state.queue;
    },
    user() {
      return this.$store.state.spotifyUser;
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
    },
    userRemainingTracks() {
      const userTracks = this.$store.state.queue.filter(
        track =>
          track.user.spotify_id === this.$store.state.spotifyUser.spotify_id
      );
      return (
        process.env.VUE_APP_QUEUE_MAX_QUEUE_LENGTH_PER_USER - userTracks.length
      );
    }
  },
  created() {
    // insert spotify script
    let spotifyPlayerScript = document.createElement("script");
    spotifyPlayerScript.setAttribute(
      "src",
      "https://sdk.scdn.co/spotify-player.js"
    );
    document.head.appendChild(spotifyPlayerScript);

    // init player, queue, current track, ...
    this.$store.dispatch("initRoom", { roomName: this.name });

    // change room of socket
    this.$socket.emit("JOIN", this.name);
  },
  methods: {
    customBeforeAppearHook() {},
    customAppearHook() {},
    customAfterAppearHook() {
      const loaderBefore = this.$refs.loaderBefore;
      const loaderAfter = this.$refs.loaderAfter;
      const timeline = new TimelineLite();

      timeline.to(loaderBefore, 0.4, {
        x: "200vw",
        ease: Back.easeInOut // Specify an ease
      });
      timeline.to(loaderAfter, 0.4, {
        x: "200vw",
        delay: -0.4,
        ease: Back.easeInOut // Specify an ease
      });
    },
    showSearch() {
      this.$refs.search.$refs.searchWrapper.classList.toggle("active");
      this.$refs.addTrack.classList.toggle("active");
      this.$refs.search.$refs.searchInput.focus();
    },
    closeSearch() {
      this.$refs.search.$refs.searchWrapper.classList.remove("active");
      this.$refs.addTrack.classList.toggle("active");
    }
  }
};
</script>
