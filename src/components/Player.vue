<template>
  <div class="player">
    <Message />

    <div class="player__track">
      <div class="player__track_user">
        <div v-if="track" class="vote-count">
          {{ track.vote }}<span>👍</span>
        </div>
        <div v-if="track" class="user">{{ track.user.name }}</div>
      </div>
      <div class="player__track_artwork">
        <div class="track-artwork--texture"></div>
        <img v-if="track" :src="track.image_big" />
        <div v-else class="artwork--default"></div>
        <div v-if="track" class="track-artwork--vinyl"></div>
      </div>
      <div class="player__track_info">
        <div class="track-name">
          <span v-if="track">{{ track.name }}</span>
          <span v-else class="track-name-default"
            >It’s very quiet around here !
          </span>
        </div>
        <div class="track-artist">
          <span v-if="track">{{ track.artist }}</span>
          <span v-else class="track-artist-default btn" @click="showSearch"
            >Start adding songs <ButtonArrow />
          </span>
        </div>
      </div>
    </div>

    <div class="player__controls" v-if="track">
      <div class="player__controls_inner">
        <div class="timer start">{{ convertTime(playerPosition) }}</div>
        <button class="toggle-mute" @click="togglePause">
          <span v-if="volume" class="control mute"><IconMute /></span>
          <span v-else class="control unmute"><IconUnmute /></span>
        </button>
        <div class="timer end">{{ convertTime(track.duration) }}</div>
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
import ButtonArrow from "@/assets/svg/button-arrow.svg";
import Message from "@/components/Message";

import { millisToMinutesAndSeconds } from "@/lib/LibUtils";

export default {
  name: "Player",
  data() {
    return {
      volume: 1
    };
  },
  props: {
    track: {
      type: Object
    }
  },
  components: {
    Message,
    ButtonArrow,
    IconMute,
    IconUnmute
  },
  computed: {
    playerPosition() {
      const playerState = this.$store.state.playerState;
      return playerState ? playerState.position : 0;
    },
    increaseBar() {
      return {
        width: `${(this.playerPosition / this.track.duration) * 100}%`
      };
    }
  },
  methods: {
    convertTime(millis) {
      return millisToMinutesAndSeconds(millis);
    },
    showSearch() {
      this.$parent.$refs.search.$refs.searchWrapper.classList.toggle("active");
      this.$parent.$refs.addTrack.classList.toggle("active");
      this.$parent.$refs.search.$refs.searchInput.focus();
    },
    togglePause() {
      if (this.volume === 1) {
        this.volume = 0;
      } else {
        this.volume = 1;
      }
      const player = this.$store.state.player;
      player.setVolume(this.volume);
    }
  }
};
</script>
