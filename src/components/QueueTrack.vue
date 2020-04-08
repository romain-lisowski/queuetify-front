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
          <span v-else class="track-name-default">Hidden track name</span>
        </div>
        <div class="track-artist">
          <span v-if="track">{{ track.artist }}</span>
          <span v-else class="track-artist-default">Hidden artist</span>
        </div>
      </div>
    </div>

    <div class="queue-track__user" v-if="track">
      {{ track.user_name }}
    </div>

    <div class="users">
      <div v-if="track && track.voters.length > 0">
        <div v-for="voter of track.voters" :key="voter.spotify_id" class="user">
          <a :href="voter.spotify_url" target="_blank">
            <div class="user_avatar">
              <div class="avatar-placeholder">
                <span>{{ voter.name.charAt(0) }}</span>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>

    <div class="queue-track__vote" v-if="track">
      <div v-if="!hasVoted" class="vote vote-up" @click="voteUp">
        <VoteArrow />
      </div>
      <div class="vote-counter">{{ track.vote }}</div>
      <div v-if="!hasVoted" class="vote vote-down" @click="voteDown">
        <VoteArrow />
      </div>
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
