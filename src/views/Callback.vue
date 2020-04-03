<template>
  <div></div>
</template>

<script>
export default {
  name: "Callback",
  created() {
    const code = this.$route.query.code;
    this.$store.dispatch("getSpotifyAuth", code);
    this.$router.push({ name: "Home" });
  }
};
</script>
