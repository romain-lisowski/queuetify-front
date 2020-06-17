<template>
  <transition
    v-on:before-appear="customBeforeAppearHook"
    v-on:appear="customAppearHook"
    v-on:after-appear="customAfterAppearHook"
  >
    <div class="home">
      <div ref="loaderBefore" class="loader-before"></div>
      <div ref="loaderAfter" class="loader-after"></div>
      <div
        ref="homeContent"
        class="home__content"
        v-if="!spotifyAccessToken || !spotifyUser"
      >
        <div class="logo">
          Rasputify
        </div>
        <h1 class="headline">
          <div class="beta"></div>
          Collaborative <span class="stroke">listening<br />room</span> using
          Spotify<span class="small">®</span>
        </h1>
        <button class="btn btn-main" @click="authentification">
          Connect with Spotify
          <ButtonArrow />
        </button>
      </div>

      <div ref="homeUser" v-if="spotifyUser" class="home__user">
        <div class="user">
          <div class="user_avatar">
            <img v-if="spotifyUser.image" :src="spotifyUser.image" />
            <div v-else class="avatar-placeholder">
              <span>{{ spotifyUser.name.charAt(0) }}</span>
            </div>
          </div>
          <div class="user_name">
            <span class="stroke">Hello,</span> {{ spotifyUser.name }}
          </div>
          <router-link
            v-for="room of rooms"
            :key="room.name"
            :to="{ name: 'Room', params: { roomId: room.id } }"
            tag="button"
            class="btn btn-main in"
          >
            Enter {{ room.name }}
            <ButtonArrow />
          </router-link>

          <div class="home__or">
            <strong>OR</strong>
          </div>

          <div class="home__create">
            <button class="btn btn-main in" @click="create">
              Create
              <ButtonArrow />
            </button>
          </div>

          <div class="home__or">
            <strong>OR</strong>
          </div>

          <div class="home__join">
            <input
              type="text"
              v-model="joinRoomId"
              placeholder="Enter room id..."
            />
            <button class="btn btn-main in" @click="join">
              Join
              <ButtonArrow />
            </button>
          </div>

          <button class="btn btn-inline out" @click="logout">
            Logout
          </button>
        </div>
      </div>

      <footer ref="homeFooter" class="home__footer">
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
            href="https://github.com/romain-lisowski/rasputify-front"
            >Github<ButtonArrow
          /></a>
        </div>
      </footer>

      <div ref="homeBackground" class="home__bg"></div>
    </div>
  </transition>
</template>

<script>
import ButtonArrow from "@/assets/svg/button-arrow.svg";
import { gsap, TimelineLite, Back } from "gsap";
import LibSpotifyAccount from "@/lib/LibSpotifyAccount";
import LibServerApi from "@/lib/LibServerApi";

export default {
  name: "Home",
  data() {
    return {
      joinRoomId: ""
    };
  },
  components: {
    ButtonArrow
  },
  computed: {
    spotifyAccessToken() {
      return this.$store.state.spotifyAccessToken;
    },
    spotifyUser() {
      return this.$store.state.spotifyUser;
    },
    rooms() {
      return this.$store.state.rooms;
    }
  },
  created() {
    this.$store.dispatch("fetchRooms");

    // leave socket room
    const currentRoomId = this.$store.state.currentRoomId;
    if (currentRoomId) {
      this.$socket.emit("LEAVE", currentRoomId);
    }
  },
  methods: {
    authentification() {
      LibSpotifyAccount.getAuthorization();
    },
    async create() {
      const room = await LibServerApi.createRoom();
      this.$router.push({
        name: "Room",
        params: { roomId: room.id }
      });
    },
    join() {
      if (this.joinRoomId.length > 4) {
        this.$router.push({
          name: "Room",
          params: { roomId: this.joinRoomId }
        });
      }
    },
    logout() {
      this.$store.dispatch("logout");
    },
    customBeforeAppearHook() {
      const content = this.$refs.homeContent;
      gsap.to(content, { y: -100, opacity: 0 });
    },
    customAfterAppearHook() {
      const loaderBefore = this.$refs.loaderBefore;
      const loaderAfter = this.$refs.loaderAfter;
      const content = this.$refs.homeContent;
      const timeline = new TimelineLite();

      timeline.to(loaderBefore, 0.4, {
        x: "200vw",
        ease: Back.easeInOut // Specify an ease
      });
      timeline.to(loaderAfter, 0.4, {
        x: "200vw",
        delay: -0.4,
        ease: Back.easeInOut // Specify an ease
      });
      timeline.to(content, 1, {
        opacity: "1",
        y: "0",
        delay: 0.2,
        ease: Back.easeInOut // Specify an ease
      });
    },
    customAppearHook() {}
  }
};
</script>
