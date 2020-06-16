<template>
  <div class="message">
    <div class="message__container" id="messages">
      <ul>
        <li v-for="(message, index) of messages" :key="index">
          <div v-html="message"></div>
        </li>
      </ul>

      <div class="message__inputs">
        <input
          class="message__inputs__input"
          type="text"
          placeholder="Your message..."
          v-model="message"
          @keyup.enter="send"
        />

        <button class="message__inputs__button" @click="send">
          <strong>Send</strong>
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
