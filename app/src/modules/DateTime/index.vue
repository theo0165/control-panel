<template>
    <div id="datetime">
        <Date />
        <Clock />
    </div>
</template>

<script>
import Clock from './Clock'
import Date from './Date'

export default {
  name: 'DateTime',
  components: {
    Clock,
    Date
  }
}
</script>

<style lang="scss" scoped>
    #datetime{
        display: inline-block;
    }
</style>
