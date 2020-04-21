<template>
  <div @click="closeSearch" class="queue">
    <div class="queue_header">
      <h3>Queue</h3>
      <div class="queue-counter">
        <span class="count">{{ queue.length }}</span> out of
        <span class="count">{{ queueMaxLenght }}</span>
        songs
      </div>
    </div>

    <transition-group class="queue_list" name="list-complete" tag="div">
      <QueueTrack v-for="track of queue" :key="track.id" :track="track" />
      <QueueTrack
        v-for="({}, index) of queueEmptySlots"
        :key="index"
        :track="null"
      />
    </transition-group>
  </div>
</template>

<script>
import QueueTrack from "@/components/QueueTrack";

export default {
  name: "Queue",
  components: {
    QueueTrack
  },
  props: {
    queue: {
      type: Array,
      required: true
    }
  },
  computed: {
    queueEmptySlots() {
      let emptySlots = 6 - this.queue.length;
      return emptySlots > 0 ? new Array(emptySlots) : [];
    },
    queueMaxLenght() {
      return process.env.VUE_APP_QUEUE_MAX_QUEUE_LENGTH;
    }
  },
  methods: {
    closeSearch() {
      this.$parent.$refs.search.$refs.searchWrapper.classList.remove("active");
      this.$parent.$refs.addTrack.classList.remove("active");
    }
  }
};
</script>
