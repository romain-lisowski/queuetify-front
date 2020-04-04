<template>
  <div class="queue-track">
    <div class="queue-track__info">
      <div class="queue-track__info_artwork">
        <img v-if="track" :src="track.album.images[2].url" />
        <div class="artwork-default" v-else>
          <ArtworkDefault />
        </div>
      </div>
      <div class="queue-track__info_content">
        <div class="track-name">
          <span v-if="track">{{ track.name }}</span>
        </div>
        <div class="track-artist">
          <span v-if="track">{{ track.artists[0].name }}</span>
        </div>
      </div>
    </div>

    <div class="queue-track__user" v-if="track">
      bastien
    </div>
    <div class="queue-track__vote" v-if="track">
      <a class="hover-vote" href="#">
        <VoteArrow />
        <div class="vote-counter">2</div>
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
    convertTime(millis) {
      return millisToMinutesAndSeconds(millis);
    }
  }
};
</script>
