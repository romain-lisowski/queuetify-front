import Vue from "vue";
import VueRouter from "vue-router";
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
    path: "/room",
    name: "Room",
    component: Room
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
