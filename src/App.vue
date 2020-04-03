<template>
  <div
    id="app"
    @mousemove="mouseMove"
    @mouseup="mouseUp"
    @mousedown="mouseDown"
  >
    <router-view />
    <div class="cursor"></div>
  </div>
</template>

<script>
export default {
  computed: {
    cursor() {
      return this.$el.querySelector(".cursor");
    }
  },
  methods: {
    mouseMove(e) {
      const { clientX: x, clientY: y } = e;
      this.cursor.style.left = x + "px";
      this.cursor.style.top = y + "px";
    },
    mouseUp() {
      this.cursor.style.padding = `0.6rem`;
    },
    mouseDown() {
      this.cursor.style.padding = `0.3rem`;
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/scss/01_base/_reset.scss";
</style>
