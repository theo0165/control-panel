<template>
  <div id="nextbus">
      <!--<ul class="departure_list" v-if="dataReady">
          <li class="departure" v-for="item in departures" v-bind:key="item.journeyid">
              <Icon icon="bus" />
              <div class="line" :style="{'background': item.fgColor}">{{ item.sname }}</div>
              <div class="direction">{{ item.direction }}</div>

          </li>
      </ul>-->

      <ul class="departure_list" v-if="dataReady">
          <li class="departure" v-for="item in departures" :key="item.journeyId">
              <Icon icon="bus" />
              <div class="line" :style="{'background': item.fgColor}">{{ item.sname }}</div>
          </li>
      </ul>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'NextBus',
  data () {
    return {
      accessKeyTicker: null,
      updateTicker: null,
      access_key: null,
      stop_id: process.env.VUE_APP_VASTTRAFIK_STOP_ID,
      departures: [],
      dataReady: false
    }
  },
  methods: {
      group: key => array =>
        array.reduce(
            (objectsByKeyValue, obj) => ({
            ...objectsByKeyValue,
            [obj[key]]: (objectsByKeyValue[obj[key]] || []).concat(obj)
            }),
            {}
        ),
      fixZero: (num) => {
          if(num < 10){
              return "0" + num
          }

          return num
      },
      getAccessKey: function() {
        const authKey = new Buffer.from(process.env.VUE_APP_VASTTRAFIK_KEY + ':' + process.env.VUE_APP_VASTTRAFIK_SECRET).toString('base64')
        const self = this

        return axios({
            method: "POST",
            url: "https://api.vasttrafik.se/token",
            data: "grant_type=client_credentials&scope=nextbus",
            headers: {
                'Authorization': "Basic " + authKey,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            json: true
        })
      },
      getDepartures: function() {
          console.log("Getting departures")
          const self = this
          const date = new Date();
          const dateFormat = date.getFullYear() + "-" + self.fixZero(date.getMonth()) + "-" + self.fixZero(date.getDate())
          const timeFormat = self.fixZero(date.getHours()) + ":" + self.fixZero(date.getMinutes())

          console.log(this.access_key)

          axios({
              method: "GET",
              url: 'https://api.vasttrafik.se/bin/rest.exe/v2/departureBoard',
              params: {
                  "id": self.stop_id,
                  "date": dateFormat,
                  "time": timeFormat,
                  "direction": process.env.VUE_APP_DIRECTION_1_ID,
                  "timeSpan": 120,
                  "maxDeparturesPerLine": 4,
                  "format": "json"
              },
              headers: {
                  'Authorization': "Bearer " + self.access_key
              }
          }).then(function(response) {
              for(var i=0; i < 8; i++){
                  self.departures.push(response.data.DepartureBoard.Departure[i])
              }

              const groupByTrack = self.group('track');
              const groupByDirection = self.group('direction')

              self.departures = groupByTrack(self.departures);
              self.departures = groupByDirection(self.departures["B"]);
              console.log(self.departures)
              self.dataReady = true;
          })
      }
  },
  created(){
      var self = this
      if(typeof this.access_key === 'undefined' || this.access_key === null || this.expires_in < 60){
        this.getAccessKey()
        .then(function(response) {
            self.access_key = response.data.access_token
            self.accessKeyTicker = setTimeout(self.getAccessKey, response.data.expires_in * 1000)
            self.getDepartures()
        }).then(function(error) {
            if(typeof error == 'undefined' || error != null){
                self.access_key = null
            }
        });
      }else{
          this.getDepartures()
      }
  }
}
</script>

<style lang="scss" scoped>
    #nextbus{
        .departure_list{
            .departure{
                list-style-type: none;
            }
        }
    }
</style>
