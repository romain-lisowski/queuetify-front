import Vue from "vue";
import VueRouter from "vue-router";
import store from "@/store";
import Home from "@/views/Home.vue";
import Callback from "@/views/Callback.vue";
import Room from "@/views/Room.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/callback",
    name: "Callback",
    component: Callback
  },
  {
    path: "/room/:roomId",
    name: "Room",
    component: Room,
    props: true,
    meta: {
      requiresAuth: true
    }
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to home page.
    if (!store.state.spotifyAccessToken) {
      next({ name: "Home" });
    } else {
      next();
    }
  } else {
    next(); // does not require auth
  }
});

export default router;
