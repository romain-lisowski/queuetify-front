<template>
  <div>
    <div>
      <img :src="track.album.images[2].url" />
    </div>
    <div>
      <div>
        {{ track.name }}
      </div>
      <div>
        {{ track.artists[0].name }}
      </div>
    </div>
    <button @click="addTrack">Add to queue</button>
  </div>
</template>

<script>
import LibFirebase from "@/lib/LibFirebase";

export default {
  name: "Result",
  props: {
    track: {
      type: Object,
      required: true
    }
  },
  methods: {
    addTrack() {
      LibFirebase.addTrack(this.track.id);
    }
  }
};
</script>
