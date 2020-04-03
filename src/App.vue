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
  mounted() {
    (function() {
      const hoverThis = document.querySelectorAll(".hover-this");
      const hoverThisSmall = document.querySelectorAll(".hover-this-small");
      const hoverVote = document.querySelectorAll(".hover-vote");
      const cursor = document.querySelector(".cursor");

      const animateHoverVote = function(e) {
        cursor.style.transform = "scale(4)";
        cursor.classList.add("hover");
        console.log("aaaa");
        if (e.type === "mouseleave") {
          cursor.style.transform = "scale(1)";
          cursor.classList.remove("hover");
        }
      };

      const animateHoverThis = function(e) {
        const span = this.querySelector("span");
        const { offsetX: x, offsetY: y } = e,
          { offsetWidth: width, offsetHeight: height } = this,
          move = 15,
          xMove = (x / width) * (move * 2) - move,
          yMove = (y / height) * (move * 2) - move;

        span.style.transform = `translate(${xMove}px, ${yMove}px)`;
        cursor.style.transform = `scale(4)`;
        cursor.classList.add("hover");
        if (e.type === "mouseleave") {
          span.style.transform = "";
          cursor.style.transform = `scale(1)`;
          cursor.classList.remove("hover");
        }
      };

      const animateHoverThisSmall = function(e) {
        cursor.style.transform = "scale(3)";
        if (e.type === "mouseleave") cursor.style.transform = "scale(1)";
      };

      hoverThis.forEach(b => b.addEventListener("mousemove", animateHoverThis));
      hoverThis.forEach(b =>
        b.addEventListener("mouseleave", animateHoverThis)
      );
      hoverThisSmall.forEach(b =>
        b.addEventListener("mousemove", animateHoverThisSmall)
      );
      hoverThisSmall.forEach(b =>
        b.addEventListener("mouseleave", animateHoverThisSmall)
      );
      hoverVote.forEach(b => b.addEventListener("mousemove", animateHoverVote));
      hoverVote.forEach(b =>
        b.addEventListener("mouseleave", animateHoverVote)
      );
    })();
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
