<template>
  <div class="container">
    <h2>
      Welcome to the collaborative listening room using Spotify
    </h2>
    <input type="button" @click="connexion" value="Connect with Spotify" />
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
