<template>
  <div id="app">
    <h1>JustWork Timers</h1>
    <TimersList />
  </div>
</template>

<script>
import TimersList from './components/TimersList.vue';

export default {
  name: 'App',
  components: {
    TimersList,
  },
};
</script>

<style lang="scss">
#app {
  font-family: Roboto, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
h1 {
  font-size: 60px;
  font-weight: 700;
}
button {
  cursor: pointer;
  transition: .2s all ease-in;
}
</style>
