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
      <div class="player__controls_inner">
        <div class="timer start">{{ convertTime(playerPosition) }}</div>
        <button class="toggle-mute" @click="togglePlay">
          <span v-if="play"><IconMute /></span>
          <span v-else><IconUnmute /></span>
        </button>
        <div class="timer end">{{ convertTime(currentTrack.duration_ms) }}</div>
      </div>
      <div class="player__controls_progress">
        <div :style="increaseBar" class="progress-bar"></div>
      </div>
    </div>
  </div>
</template>

<script>
import IconMute from "@/assets/svg/icon-mute.svg";
import IconUnmute from "@/assets/svg/icon-unmute.svg";

import { millisToMinutesAndSeconds } from "@/lib/LibUtils";

export default {
  name: "Player",
  data() {
    return {
      play: true
    };
  },
  components: {
    IconMute,
    IconUnmute
  },
  props: {
    currentTrack: {
      type: Object,
      required: true
    }
  },
  computed: {
    playerPosition() {
      const playerState = this.$store.state.playerState;
      return playerState ? playerState.position : 0;
    },
    increaseBar() {
      return {
        width: `${(this.playerPosition / this.currentTrack.duration_ms) * 100}%`
      };
    }
  },
  methods: {
    convertTime(millis) {
      return millisToMinutesAndSeconds(millis);
    },
    togglePlay() {
      const player = this.$store.state.player;
      player.togglePlay().then(() => {
        this.play = !this.play;
      });
    }
  }
};
</script>
