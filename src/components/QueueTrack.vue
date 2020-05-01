<template>
  <div class="queue-track">
    <div class="queue-track__info">
      <div class="queue-track__info_index">{{ index }}</div>

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
      <div class="queue-track__duration" v-if="track">
        {{ convertTime(track.duration) }}
      </div>
    </div>

    <div class="queue-track__vote" v-if="track">
      <div
        v-if="!hasVoted"
        class="vote vote-up"
        @mousemove="voteHoverUp"
        @mouseenter="voteInUp"
        @mouseleave="voteOutUp"
        @click="vote(1)"
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
        @click="vote(-1)"
      >
        <div ref="cursorWrapperDown" class="cursor-wrapper">
          <div ref="cursorDown" class="queue-track_cursor down">👎</div>
        </div>
        <VoteArrowDown />
      </div>
    </div>

    <div
      class="queue-track__user"
      v-if="track && track.user.spotify_id !== user.spotify_id"
    >
      <div class="queue-track__user_avatar">
        <img v-if="track.user.image" :src="track.user.image" />
        <div v-else class="avatar-placeholder">
          <span>{{ track.user.name.charAt(0) }}</span>
        </div>
      </div>
    </div>

    <div v-else-if="track" class="queue-track__info_actions">
      <button @click="removeTrack"><IconRemove /></button>

      <div class="tooltip">Remove</div>
    </div>
  </div>
</template>

<script>
import LibServerApi from "@/lib/LibServerApi";
import { millisToMinutesAndSeconds } from "@/lib/LibUtils";
import VoteArrowUp from "@/assets/svg/vote-arrow-up.svg";
import VoteArrowDown from "@/assets/svg/vote-arrow-down.svg";
import IconRemove from "@/assets/svg/icon-remove.svg";

export default {
  name: "QueueTrack",
  components: {
    VoteArrowUp,
    VoteArrowDown,
    IconRemove
  },
  props: {
    track: {
      type: Object
    },
    index: Number
  },
  computed: {
    hasVoted() {
      return this.track.voters.find(
        user => user.spotify_id == this.$store.state.spotifyUser.spotify_id
      );
    },
    user() {
      return this.$store.state.spotifyUser;
    }
  },
  methods: {
    vote(increment) {
      this.$store.dispatch("vote", {
        track: this.track,
        increment: increment
      });
    },
    convertTime(millis) {
      return millisToMinutesAndSeconds(millis);
    },
    removeTrack() {
      LibServerApi.removeTrack(this.$store.state.currentRoom, this.track);
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
      this.$parent.$parent.$refs.cursor.classList.remove("active");
    },
    voteOutUp() {
      const cursor = this.$refs.cursorUp;
      cursor.classList.remove("active");
      const search = this.$parent.$parent.$parent.$refs.search.$refs
        .searchWrapper;
      if (search.classList.contains("active")) {
        this.$parent.$parent.$refs.cursor.classList.add("active");
      }
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
      this.$parent.$parent.$refs.cursor.classList.remove("active");
    },
    voteOutDown() {
      const cursorDown = this.$refs.cursorDown;
      const search = this.$parent.$parent.$parent.$refs.search.$refs
        .searchWrapper;
      cursorDown.classList.remove("active");

      if (search.classList.contains("active")) {
        this.$parent.$parent.$refs.cursor.classList.add("active");
      }
    }
  }
};
</script>
