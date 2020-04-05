<template>
  <div class="player">
    <div class="player__track">
      <div class="player__track_user">
        <div class="vote-count">2</div>
        <div class="user">bastien</div>
      </div>
      <div class="player__track_artwork">
        <img v-if="track" :src="track.image_big" />
        <div v-else class="artwork-default">
          <ArtworkDefault />
        </div>
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
          <span v-else class="track-artist-default">Start adding songs</span>
        </div>
      </div>
    </div>

    <div class="player__controls" v-if="track">
      <div class="player__controls_inner">
        <div class="timer start">{{ convertTime(playerPosition) }}</div>
        <button class="toggle-mute" @click="togglePlay">
          <span v-if="play" class="control mute"><IconMute /></span>
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
import ArtworkDefault from "@/assets/svg/artwork-default.svg";

import { millisToMinutesAndSeconds } from "@/lib/LibUtils";

export default {
  name: "Player",
  data() {
    return {
      play: true
    };
  },
  props: {
    track: {
      type: Object
    }
  },
  components: {
    IconMute,
    IconUnmute,
    ArtworkDefault
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
    togglePlay() {
      const player = this.$store.state.player;
      player.togglePlay().then(() => {
        this.play = !this.play;
      });
    }
  }
};
</script>
