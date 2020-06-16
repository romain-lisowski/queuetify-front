<template>
  <div style="margin-left: 2.5%; width: 100%;">
    <div
      id="messages"
      style="
  background-color: black; 
  opacity: 0.5; 
  position: absolute;
  z-index: 10;
  width: 95%;
  bottom: 10px;
  overflow-y: scroll;
  max-height: 93%;
  "
    >
      <ul>
        <li v-for="(message, index) of messages" :key="index">
          <div v-html="message"></div>
        </li>
      </ul>

      <div style="width: 100%">
        <input
          ref="message"
          type="text"
          placeholder="Your message..."
          v-model="message"
          @keyup.enter="send"
          style="width: 80%; padding: 2px"
        />
        <button
          @click="send"
          style="background-color: white; text-align: center; width: 20%; padding: 2px;"
        >
          <b>Send</b>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Message",
  data() {
    return {
      message: ""
    };
  },
  updated() {
    const container = this.$el.querySelector("#messages");
    container.scrollTop = container.scrollHeight;
  },
  computed: {
    messages() {
      return this.$store.state.messages;
    }
  },
  methods: {
    send() {
      this.$socket.emit("MESSAGE", {
        roomId: this.$store.state.currentRoom.id,
        userName: this.$store.state.spotifyUser.name,
        message: this.message
      });
      this.message = "";
    }
  }
};
</script>
