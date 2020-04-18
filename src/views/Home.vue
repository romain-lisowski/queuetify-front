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
        v-if="!spotifyAccessToken || !spotifyUser"
        class="btn btn-main"
        @click="authentification"
      >
        Connect with Spotify
        <ButtonArrow />
      </button>

      <div v-else>
        <div v-if="spotifyUser">
          <img v-if="spotifyUser.image" :src="spotifyUser.image" />
          <div>Logged as : {{ spotifyUser.name }}</div>
          <button class="btn btn-main" @click="logout">
            Logout
          </button>
        </div>

        <router-link :to="{ name: 'Room' }" tag="button" class="btn btn-main">
          Enter the room
          <ButtonArrow />
        </router-link>
      </div>
    </div>

    <footer class="home__footer">
      <div class="copyrights">
        Code by
        <a
          class="btn btn-inline"
          target="_blank"
          href="https://open.spotify.com/user/11175592942"
          >Romain Lisowski<ButtonArrow />
        </a>
        , Design by
        <a
          class="btn btn-inline"
          target="_blank"
          href="https://open.spotify.com/user/bqd"
          >Bastien Lemeunier<ButtonArrow />
        </a>
        . Get it on
        <a
          class="btn btn-inline"
          target="_blank"
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
    }
  }
};
</script>
