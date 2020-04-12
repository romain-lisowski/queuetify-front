import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VueFirestore from "vue-firestore";
import VueSocketIO from "vue-socket.io";
import io from "socket.io-client";

Vue.config.productionTip = false;

Vue.use(VueFirestore);

const options = {
  tansport: ["websocket", "polling"],
  secure: true,
  reconnect: true,
  rejectUnauthorized: false
};

Vue.use(
  new VueSocketIO({
    debug: true,
    connection: io(process.env.VUE_APP_SERVER_URL, options),
    vuex: {
      store,
      actionPrefix: "SOCKET_",
      mutationPrefix: "SOCKET_"
    }
  })
);

const app = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");

store.$app = app;
