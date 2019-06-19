<template>
  <div id="app">
    <div class="grid_container">
      <div class="grid grid-left">
        <DateTime />
      </div>
      <div class="grid grid-right">
        <Weather />
        <NextBus />
      </div>
    </div>
  </div>
</template>

<script>
import DateTime from './modules/DateTime'
import NextBus from './modules/NextBus'
import Weather from './modules/Weather'

export default {
  name: 'app',
  components: {
    DateTime,
    NextBus,
    Weather
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

.grid_container{
  display: grid;
  grid-template-columns: 50% 50%;
  padding: 20px;
}

.grid-right{
  display: flex;
  justify-content: flex-end;
  flex-direction: column;

  & > div{
    display: flex;
    justify-content: flex-end;
    flex-direction: column;
    align-items: flex-end;
  }
}
</style>
