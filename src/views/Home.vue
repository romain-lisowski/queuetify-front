<template>
  <div class="home">
    <div class="home__logo">
      <Logo />
    </div>

    <div class="home__content">
      <h1 class="headline">
        The collaborative listening<br />room using Spotify<span>®</span>
      </h1>
      <button class="btn btn-main" @click="connexion">
        Connect with Spotify
      </button>
    </div>

    <footer class="home__footer">
      <div class="info">We do not store any personal data.</div>
      <div class="copyrights">
        Code by <a href="#">Romain Lisowski</a>, Design by
        <a href="#">Bastien Lemeunier</a>. Get it on
        <a href="https://github.com/romain-lisowski">Github</a>
      </div>
    </footer>
  </div>
</template>

<script>
import Logo from "@/assets/svg/logo.svg";

import SpotifyAuthLib from "@/lib/SpotifyAuth";

export default {
  name: "Home",
  components: {
    Logo
  },
  methods: {
    connexion() {
      SpotifyAuthLib.getAuthorization();
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/scss/03_page/_home.scss";
</style>
