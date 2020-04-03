<template>
  <div>
    <h2>SEARCH</h2>
    <input
      type="text"
      value=""
      placeholder="Your search here ..."
      v-model="search"
    />
    <div></div>
  </div>
</template>

<script>
export default {
  name: "Search",
  data() {
    return {
      search: ""
    };
  },
  watch: {
    search() {}
  }
};
</script>
