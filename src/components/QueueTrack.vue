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

    <div class="queue-track__vote" v-if="track">
      <div
        v-if="!hasVoted"
        class="vote vote-up"
        @mousemove="voteHoverUp"
        @mouseenter="voteInUp"
        @mouseleave="voteOutUp"
        @click="voteUp"
      >
        <div ref="cursorWrapperUp" class="cursor-wrapper">
          <div ref="cursorUp" class="queue-track_cursor up">👍</div>
        </div>
        <VoteArrowUp />
      </div>

      <div :class="{ active: hasVoted }" class="vote-counter">
        {{ track.vote }}
      </div>

      <div
        v-if="!hasVoted"
        class="vote vote-down"
        @mousemove="voteHoverDown"
        @mouseenter="voteInDown"
        @mouseleave="voteOutDown"
        @click="voteDown"
      >
        <div ref="cursorWrapperDown" class="cursor-wrapper">
          <div ref="cursorDown" class="queue-track_cursor down">👎</div>
        </div>
        <VoteArrowDown />
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
  </div>
</template>

<script>
import { millisToMinutesAndSeconds } from "@/lib/LibUtils";
import VoteArrowUp from "@/assets/svg/vote-arrow-up.svg";
import VoteArrowDown from "@/assets/svg/vote-arrow-down.svg";

export default {
  name: "QueueTrack",
  components: {
    VoteArrowUp,
    VoteArrowDown
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
    voteHoverUp(e) {
      const cursorWrapper = this.$refs.cursorWrapperUp;
      const { clientX: x, clientY: y } = e;
      cursorWrapper.style.left = x + "px";
      cursorWrapper.style.top = y + "px";
    },
    voteInUp() {
      const cursor = this.$refs.cursorUp;
      cursor.classList.add("active");
    },
    voteOutUp() {
      const cursor = this.$refs.cursorUp;
      cursor.classList.remove("active");
    },
    voteHoverDown(e) {
      const cursorWrapperDown = this.$refs.cursorWrapperDown;
      const { clientX: x, clientY: y } = e;
      cursorWrapperDown.style.left = x + "px";
      cursorWrapperDown.style.top = y + "px";
    },
    voteInDown() {
      const cursorDown = this.$refs.cursorDown;
      cursorDown.classList.add("active");
    },
    voteOutDown() {
      const cursorDown = this.$refs.cursorDown;
      cursorDown.classList.remove("active");
    },
    convertTime(millis) {
      return millisToMinutesAndSeconds(millis);
    }
  }
};
</script>
