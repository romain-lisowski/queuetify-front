<template>
  <div class="queue">
    <div class="queue_header">
      <h3>Queue</h3>
      <div class="queue-counter">
        <span class="count">{{ queue.length }}</span>
        Songs
      </div>
    </div>

    <div class="queue_list">
      <transition-group name="list-complete" tag="queue_list">>
        <QueueTrack v-for="track of queue" :key="track.id" :track="track" />
        <QueueTrack
          v-for="({}, index) of queueEmptySlots"
          :key="index"
          :track="null"
        />
      </transition-group>
    </div>
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
    }
  }
};
</script>
