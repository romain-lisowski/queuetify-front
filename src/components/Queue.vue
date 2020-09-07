<template>
  <div
    @mousemove="closeSearchHover"
    @mouseenter="closeSearchIn"
    @mouseleave="closeSearchOut"
    @click="closeSearch"
    class="queue"
    ref="queue"
  >
    <div ref="cursorWrapper" class="cursor-search-wrapper">
      <div ref="cursor" class="search_cursor"><IconArrowRight /></div>
    </div>

    <div class="queue_header">
      <h3>Queue</h3>
      <div class="queue-counter">
        <span class="count">{{ queue.length }}</span> out of
        <span class="count">{{ queueMaxLength }}</span>
        songs
      </div>
    </div>

    <transition-group class="queue_list" name="list-complete" tag="div">
      <QueueTrack
        v-for="(track, index) of queue"
        :key="track.id"
        :index="index + 1"
        :track="track"
      />
      <QueueTrack
        v-for="({}, index) of queueEmptySlots"
        :key="index + 1"
        :index="index + 1 + queue.length"
        :track="null"
      />
    </transition-group>
  </div>
</template>

<script>
import QueueTrack from "@/components/QueueTrack";
import IconArrowRight from "@/assets/svg/icon-arrow-right.svg";

export default {
  name: "Queue",
  components: {
    QueueTrack,
    IconArrowRight
  },
  props: {
    queue: {
      type: Array,
      required: true
    }
  },
  computed: {
    queueEmptySlots() {
      let emptySlots =
        process.env.VUE_APP_RASPUTIFY_MAX_QUEUE_LENGTH - this.queue.length;
      return emptySlots > 0 ? new Array(emptySlots) : [];
    },
    queueMaxLength() {
      return process.env.VUE_APP_RASPUTIFY_MAX_QUEUE_LENGTH;
    }
  },
  methods: {
    closeSearch() {
      this.$parent.$refs.search.$refs.searchWrapper.classList.remove("active");
      this.$parent.$refs.addTrack.classList.remove("active");
      const cursor = this.$refs.cursor;
      cursor.classList.remove("active");
    },
    closeSearchHover(e) {
      const search = this.$parent.$refs.search.$refs.searchWrapper;
      const cursorWrapper = this.$refs.cursorWrapper;
      if (search.classList.contains("active")) {
        const { clientX: x, clientY: y } = e;
        this.$refs.queue.classList.add("hover");
        cursorWrapper.style.left = x + "px";
        cursorWrapper.style.top = y + "px";
      } else {
        this.$refs.queue.classList.remove("hover");
      }
    },
    closeSearchIn() {
      const search = this.$parent.$refs.search.$refs.searchWrapper;
      const cursor = this.$refs.cursor;
      if (search.classList.contains("active")) {
        cursor.classList.add("active");
      }
    },
    closeSearchOut() {
      const search = this.$parent.$refs.search.$refs.searchWrapper;
      const cursor = this.$refs.cursor;
      if (search.classList.contains("active")) {
        cursor.classList.remove("active");
      }
    }
  }
};
</script>
