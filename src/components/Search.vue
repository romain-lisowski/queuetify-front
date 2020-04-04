<template>
  <div ref="searchWrapper" class="search-wrapper">
    <div class="search">
      <div class="search__input">
        <input
          ref="searchInput"
          type="text"
          value=""
          placeholder="Enter artist, track..."
          v-model="search"
          v-on:keyup.esc="closeSearch"
        />
      </div>
      <div
        class="search__results"
        v-if="trackResults && trackResults.length > 0"
      >
        <Result v-for="track of trackResults" :key="track.id" :track="track" />
      </div>
    </div>
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
    closeSearch() {
      this.$refs.searchWrapper.classList.remove("active");
    }
  },
  watch: {
    search() {
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
