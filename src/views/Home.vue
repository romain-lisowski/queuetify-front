<template>
  <div class="container">
    <h2>
      Welcome to the collaborative listening room using Spotify
    </h2>
    <button @click="connexion">Connect with Spotify</button>
    <footer>
      <div>
        Code by <strong>Romain Lisowski</strong>, Design by
        <strong>Bastien Lemeunier</strong>. Get it on
        <a href="https://github.com/romain-lisowski">Github</a>
      </div>
    </footer>
  </div>
</template>

<script>
import SpotifyAuthLib from "@/lib/SpotifyAuth";

export default {
  name: "Home",
  methods: {
    connexion() {
      SpotifyAuthLib.getAuthorization();
    }
  }
};
</script>
