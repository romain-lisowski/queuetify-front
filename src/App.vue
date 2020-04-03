<template>
  <div
    id="app"
    @mousemove="mouseMove"
    @mouseup="mouseUp"
    @mousedown="mouseDown"
  >
    <router-view />
    <div ref="cursor" class="cursor"></div>
  </div>
</template>

<script>
export default {
  methods: {
    mouseMove(e) {
      const { clientX: x, clientY: y } = e;
      this.$refs.cursor.style.left = x + "px";
      this.$refs.cursor.style.top = y + "px";
    },
    mouseUp() {
      this.$refs.cursor.style.padding = `0.6rem`;
    },
    mouseDown() {
      this.$refs.cursor.style.padding = `0.3rem`;
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/scss/01_base/_reset.scss";
</style>
