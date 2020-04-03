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
        @mouseleave="animateHoverThis"
      >
        <span>
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

import SpotifyAuthLib from "@/lib/SpotifyAuth";

export default {
  name: "Home",
  components: {
    Logo,
    ButtonArrow
  },
  computed: {
    cursor() {
      return this.$el.querySelector(".cursor");
    }
  },
  methods: {
    connexion() {
      SpotifyAuthLib.getAuthorization();
    },
    animateHoverThis(e) {
      const span = this.querySelector("span");
      const { offsetX: x, offsetY: y } = e,
        { offsetWidth: width, offsetHeight: height } = this,
        move = 15,
        xMove = (x / width) * (move * 2) - move,
        yMove = (y / height) * (move * 2) - move;

      span.style.transform = `translate(${xMove}px, ${yMove}px)`;
      this.cursor.style.transform = `scale(4)`;
      this.cursor.classList.add("hover");
      if (e.type === "mouseleave") {
        span.style.transform = "";
        this.cursor.style.transform = `scale(1)`;
        this.cursor.classList.remove("hover");
      }
    }
  }
};
</script>
