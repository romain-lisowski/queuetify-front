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

        <div v-if="!queueMaxLengthReach">
          <button class="add-track" @click="showSearch">
            <span>+</span>
            Add a song
          </button>
        </div>
        <div v-else>
          Queue is full
        </div>
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
    this.$store.dispatch("initRoom");
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
      this.$refs.search.$refs.searchInput.focus();
    },
    closeSearch() {
      this.$refs.search.$refs.searchWrapper.classList.remove("active");
    }
  }
};
</script>
