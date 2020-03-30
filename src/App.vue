<template>
  <div id="app">
    <img alt="Vue logo" src="@/assets/logo.png" />
    <router-view />
  </div>
</template>

<style lang="scss">
html {
  background-color: #050506;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #ffffff;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
