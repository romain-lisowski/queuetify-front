<template>
  <div class="container">
    <h1>Room 1 :</h1>
    <ul>
      <li v-for="(track, index) of room.tracks" :key="index">
        {{ track }}
      </li>
    </ul>
  </div>
</template>

<script>
import { db } from "@/firebase";

export default {
  name: "Room",
  data() {
    return {
      room: []
    };
  },
  firestore() {
    return {
      room: db.collection("rooms").doc("room1")
    };
  },
  mounted() {
    this.$store.dispatch("initPlayer");
  }
};
</script>
