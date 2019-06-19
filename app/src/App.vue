<template>
  <div id="app">
    <DateTime />
    <NextBus />
  </div>
</template>

<script>
import DateTime from './modules/DateTime'
import NextBus from './modules/NextBus'

export default {
  name: 'app',
  components: {
    DateTime,
    NextBus
  }
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Montserrat;700&display=swap');

*{
  margin: 0;
  padding: 0;
}

body{
  font-family: 'Montserrat', sans-serif;
  color: white;
  background: black;
}
</style>
