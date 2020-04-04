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
        v-if="!spotifyAccessToken"
        class="btn btn-main hover-this"
        @click="authentification"
        @mousemove="animateHoverThis"
        @mouseleave="animateHoverThisLeave"
      >
        <span ref="cursorSpan">
          Connect with Spotify
          <ButtonArrow />
        </span>
      </button>

      <div v-else>
        <div v-if="spotifyUser">
          <img
            v-if="spotifyUser.images.length > 0"
            :src="spotifyUser.images[0].url"
          />
          <div>Logged as : {{ spotifyUser.display_name }}</div>
          <button class="btn btn-main hover-this" @click="logout">
            Logout
          </button>
        </div>

        <router-link
          :to="{ name: 'Room' }"
          tag="button"
          class="btn btn-main hover-this"
          @mousemove="animateHoverThis"
          @mouseleave="animateHoverThisLeave"
        >
          <span ref="cursorSpan">
            Enter the room
            <ButtonArrow />
          </span>
        </router-link>
      </div>
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
  computed: {
    spotifyAccessToken() {
      return this.$store.state.spotifyAccessToken;
    },
    spotifyUser() {
      return this.$store.state.spotifyUser;
    }
  },
  methods: {
    authentification() {
      LibSpotifyAccount.getAuthorization();
    },
    logout() {
      this.$store.dispatch("logout");
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
