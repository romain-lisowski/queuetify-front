<template>
  <div class="queue-track">
    <div class="queue-track__info">
      <div class="queue-track__info_artwork">
        <img v-if="track" :src="track.image_small" />
        <div class="artwork-default" v-else></div>
      </div>
      <div class="queue-track__info_content">
        <div class="track-name">
          <span v-if="track">{{ track.name }}</span>
          <span v-else class="track-name-default">Hidden track name</span>
        </div>
        <div class="track-artist">
          <span v-if="track">{{ track.artist }}</span>
          <span v-else class="track-artist-default">Hidden artist</span>
        </div>
      </div>
    </div>

    <div class="queue-track__user" v-if="track">
      <div class="queue-track__user_avatar">
        <img v-if="track.user.image" :src="track.user.image" />
        <div v-else class="avatar-placeholder">
          <span>{{ track.user.name.charAt(0) }}</span>
        </div>
      </div>
    </div>

    <div class="queue-track__vote" v-if="track">
      <div v-if="!hasVoted" class="vote vote-up" @click="voteUp">
        <VoteArrow />
      </div>
      <div v-else class="vote vote-up active">
        <VoteArrow />
      </div>
      <div :class="{ active: hasVoted }" class="vote-counter">{{ track.vote }}</div>
      <div v-if="!hasVoted" class="vote vote-down" @click="voteDown">
        <VoteArrow />
      </div>
      <div v-else class="vote vote-down active">
        <VoteArrow />
      </div>
    </div>
  </div>
</template>

<script>
import { millisToMinutesAndSeconds } from "@/lib/LibUtils";
import VoteArrow from "@/assets/svg/vote-arrow.svg";

export default {
  name: "QueueTrack",
  components: {
    VoteArrow
  },
  props: {
    track: {
      type: Object
    }
  },
  computed: {
    hasVoted() {
      return this.track.voters.find(
        user => user.spotify_id == this.$store.state.spotifyUser.spotify_id
      );
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
