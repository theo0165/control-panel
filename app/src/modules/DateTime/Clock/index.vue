<template>
    <div id="clock">
        <span class="clock_hours">{{ hours }}</span>
        <span class="clock_seperator">:</span>
        <span class="clock_minutes">{{ minutes }}</span>
        <span class="clock_seconds">{{ seconds }}</span>
    </div>
</template>

<script>
const fixZero = (num) => {
  if (num < 10) {
    return '0' + num
  }

  return num
}

const getDate = () => new Date()
const getHours = () => fixZero(getDate().getHours())
const getMinutes = () => fixZero(getDate().getMinutes())
const getSeconds = () => fixZero(getDate().getSeconds())

export default {
  name: 'Clock',
  data () {
    return {
      ticker: null,
      hours: getHours(),
      minutes: getMinutes(),
      seconds: getSeconds()
    }
  },
  created () {
    this.ticker = setInterval(() => {
      this.hours = getHours()
      this.minutes = getMinutes()
      this.seconds = getSeconds()
    }, 1000)
  },
  destroyed () {
    clearInterval(this.ticker)
  }
}
</script>

<style lang="scss" scoped>
    #clock{
        display: flex;
        align-items: center;

        span{
            font-weight: 700;
            padding: 0 3px;

            &:first-of-type{
                padding-left: 0;
            }
        }

        .clock_seperator{
            font-weight: 3em;
        }

        .clock_hours, .clock_minutes{
            font-size: 2.5em;
        }

        .clock_hours{}

        .clock_minutes{}

        .clock_seconds{
            color: #595858;
            margin-bottom: 19px;
        }
    }
</style>
