<template>
  <div class="search">
    <h2>SEARCH</h2>
    <input
      type="text"
      value=""
      placeholder="Your search here ..."
      v-model="search"
    />
    <button @click="doSearch" class="btn btn-main hover-this">
      Search
    </button>
    <div v-if="trackResults && trackResults.length > 0">
      <h3>Results</h3>
      <div v-for="track of trackResults" :key="track.id">
        <Result :track="track" />
      </div>
    </div>
    <h3 v-else>No results</h3>
  </div>
</template>

<script>
import LibSpotifyApi from "@/lib/LibSpotifyApi";
import Result from "@/components/Result";

export default {
  name: "Search",
  components: {
    Result
  },
  data() {
    return {
      search: "",
      trackResults: []
    };
  },
  methods: {
    doSearch() {
      if (this.search.length > 0) {
        LibSpotifyApi.searchTracks(
          this.search,
          this.$store.state.spotifyAccessToken
        ).then(results => {
          this.trackResults = results.tracks.items;
        });
      }
    }
  }
};
</script>
