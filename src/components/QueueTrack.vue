<template>
  <div class="queue-track">
    <div class="queue-track__info">
      <div class="queue-track__info_artwork">
        <img v-if="track" :src="track.image_small" />
        <div class="artwork-default" v-else>
          <ArtworkDefault />
        </div>
      </div>
      <div class="queue-track__info_content">
        <div class="track-name">
          <span v-if="track">{{ track.name }}</span>
        </div>
        <div class="track-artist">
          <span v-if="track">{{ track.artist }}</span>
        </div>
      </div>
    </div>

    <div class="queue-track__user" v-if="track">
      bastien
    </div>
    <div class="queue-track__vote" v-if="track">
      <a class="hover-vote" href="#">
        <div @click="voteUp">
          <VoteArrow />
        </div>
        <div class="vote-counter">{{ track.vote }}</div>
        <div @click="voteDown">
          <VoteArrow />
        </div>
      </a>
    </div>
  </div>
</template>

<script>
import { millisToMinutesAndSeconds } from "@/lib/LibUtils";
import VoteArrow from "@/assets/svg/vote-arrow.svg";
import ArtworkDefault from "@/assets/svg/artwork-default.svg";

export default {
  name: "QueueTrack",
  components: {
    VoteArrow,
    ArtworkDefault
  },
  props: {
    track: {
      type: Object
    }
  },
  methods: {
    voteUp() {
      this.$store.dispatch("vote", { track: this.track, increment: 1 });
    },
    voteDown() {
      this.$store.dispatch("vote", { track: this.track, increment: -1 });
    },
    convertTime(millis) {
      return millisToMinutesAndSeconds(millis);
    }
  }
};
</script>
