<template>
  <div class="queue-track">
    <div class="queue-track__info">
      <div class="queue-track__info_artwork">
        <img :src="track.album.images[2].url" />
      </div>
      <div class="queue-track__info_content">
        <div class="track-name">
          {{ track.name }}
        </div>
        <div class="track-artist">
          {{ track.artists[0].name }}
        </div>
      </div>
    </div>

    <div class="queue-track__user">
      bastien
    </div>
    <div class="queue-track__vote">
      <a class="hover-vote" href="#">
        <VoteArrow />
        <div class="vote-counter">2</div>
      </a>
    </div>
  </div>
</template>

<script>
import { millisToMinutesAndSeconds } from "@/lib/Utils";

import VoteArrow from "@/assets/svg/vote-arrow.svg";

export default {
  name: "QueueTrack",
  components: {
    VoteArrow
  },
  props: {
    track: {
      type: Object,
      required: true
    }
  },
  methods: {
    convertTime(millis) {
      return millisToMinutesAndSeconds(millis);
    }
  }
};
</script>