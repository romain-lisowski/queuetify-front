<template>
  <div>
    <h2>SEARCH</h2>
    <input
      type="text"
      value=""
      placeholder="Your search here ..."
      v-model="search"
    />
    <button @click="doSearch">Search</button>
    <h3>Results</h3>
    <div v-if="trackResults && trackResults.length > 0">
      <div v-for="track of trackResults" :key="track.id">
        <Result :track="track" />
      </div>
    </div>
    <div v-else>No results</div>
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
          this.$store.state.spotifyAuth.access_token
        ).then(results => {
          this.trackResults = results.tracks.items;
        });
      }
    }
  }
};
</script>
