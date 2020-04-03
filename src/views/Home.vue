<template>
  <div class="home">
    <div class="home__logo">
      <Logo />
    </div>

    <div class="home__content">
      <h1 class="headline">
        The collaborative listening<br />room using Spotify<span>®</span>
      </h1>
      <button
        class="btn btn-main hover-this"
        @click="connexion"
        @mousemove="animateHoverThis"
        @mouseleave="animateHoverThisLeave"
      >
        <span ref="cursorSpan">
          Connect with Spotify
          <ButtonArrow />
        </span>
      </button>
    </div>

    <footer class="home__footer">
      <div class="copyrights">
        Code by
        <a class="btn btn-inline hover-this-small" href="#"
          >Romain Lisowski<ButtonArrow />
        </a>
        , Design by
        <a class="btn btn-inline hover-this-small" href="#"
          >Bastien Lemeunier<ButtonArrow />
        </a>
        . Get it on
        <a
          class="btn btn-inline hover-this-small"
          href="https://github.com/romain-lisowski"
          >Github<ButtonArrow
        /></a>
      </div>
    </footer>
  </div>
</template>

<script>
import Logo from "@/assets/svg/logo.svg";
import ButtonArrow from "@/assets/svg/button-arrow.svg";

import LibSpotifyAccount from "@/lib/LibSpotifyAccount";

export default {
  name: "Home",
  components: {
    Logo,
    ButtonArrow
  },

  methods: {
    connexion() {
      LibSpotifyAccount.getAuthorization();
    },
    animateHoverThis(e) {
      const { offsetX: x, offsetY: y } = e,
        { offsetWidth: width, offsetHeight: height } = this,
        move = 15,
        xMove = (x / width) * (move * 2) - move,
        yMove = (y / height) * (move * 2) - move;

      this.$refs.cursorSpan.style.transform = `translate(${xMove}px, ${yMove}px)`;
      this.$parent.$refs.cursor.style.transform = `scale(4)`;
      this.$parent.$refs.cursor.classList.add("hover");
    },
    animateHoverThisLeave(e) {
      this.animateHoverThis(e);
      this.$refs.cursorSpan.style.transform = "";
      this.$parent.$refs.cursor.style.transform = `scale(1)`;
      this.$parent.$refs.cursor.classList.remove("hover");
    }
  }
};
</script>
