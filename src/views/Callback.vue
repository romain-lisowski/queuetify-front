<template>
  <div></div>
</template>

<script>
export default {
  name: "Callback",
  created() {
    const code = this.$route.query.code;
    this.$store.dispatch("spotifyGetTokens", code);
    this.$router.push({ name: "Room" });
  }
};
</script>
