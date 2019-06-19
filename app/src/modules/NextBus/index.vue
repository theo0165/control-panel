<template>
  <div id="nextbus">
    <div class="data_container">
      <h3>Buss tidtabell</h3>
      <ul class="departure_list" v-if="dataReady">
        <li class="departure" v-for="(item, index) in departures" :key="item.journeyId">
          <div class="departure_container" v-if="item.length > 0">
            <Icon class="bus_icon" icon="bus"/>
            <div class="line" :style="{'background': item[0].fgColor}">{{ item[0].sname }}</div>
            <div class="dep_info">
              <div class="direction">{{ index }}</div>
              <div class="departures">
                <div v-for="(dep, index) in item" :key="index">{{ dep.time }}</div>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "NextBus",
  data() {
    return {
      accessKeyTicker: null,
      updateTicker: null,
      access_key: null,
      stop_id: process.env.VUE_APP_VASTTRAFIK_STOP_ID,
      departures: null,
      dataReady: false
    };
  },
  methods: {
    minutesLeft: (date) => {
      var dateNow = new Date();
      var dateFuture = new Date(date);

      var seconds = Math.floor((dateFuture - (dateNow))/1000);
      var minutes = Math.floor(seconds/60);

      return minutes
    },
    group: (object, key) => {
      let result = {};

      for (let i = 0; i < object.length; i++) {
        let name = object[i][key];

        let dirs = result[name];
        if (typeof dirs === "undefined") {
          dirs = [];
        }

        dirs.push(object[i]);

        result[name] = dirs;
      }
      return result;
    },
    fixZero: num => {
      if (num < 10) {
        return "0" + num;
      }

      return num;
    },
    getAccessKey: function() {
      const authKey = new Buffer.from(
        process.env.VUE_APP_VASTTRAFIK_KEY +
          ":" +
          process.env.VUE_APP_VASTTRAFIK_SECRET
      ).toString("base64");

      return axios({
        method: "POST",
        url: "https://api.vasttrafik.se/token",
        data: "grant_type=client_credentials&scope=nextbus",
        headers: {
          Authorization: "Basic " + authKey,
          "Content-Type": "application/x-www-form-urlencoded"
        },
        json: true
      });
    },
    getDepartures: function() {
      const self = this;
      const date = new Date();

      const dateFormat =
        date.getFullYear() +
        "-" +
        self.fixZero(date.getMonth() + 1) +
        "-" +
        self.fixZero(date.getDate());
      const timeFormat =
        self.fixZero(date.getHours()) + ":" + self.fixZero(date.getMinutes());

      console.log(timeFormat)

      axios({
        method: "GET",
        url: "https://api.vasttrafik.se/bin/rest.exe/v2/departureBoard",
        params: {
          id: self.stop_id,
          date: dateFormat,
          time: timeFormat,
          direction: process.env.VUE_APP_DIRECTION_1_ID,
          format: "json"
        },
        headers: {
          Authorization: "Bearer " + self.access_key
        }
      }).then(function(response) {
        let results = [];
        for (var i = 0;i < 6;i++) {
          results.push(response.data.DepartureBoard.Departure[i]);
        }
        console.log(results)

        var grouped = self.group(results, "direction");
        self.setDepartures(grouped);
        self.dataReady = true;
      });
    },
    setDepartures(dep) {
      this.departures = dep;
    }
  },
  created() {
    var self = this;
    if (
      typeof this.access_key === "undefined" ||
      this.access_key === null ||
      this.expires_in < 60
    ) {
      this.getAccessKey()
        .then(function(response) {
          self.access_key = response.data.access_token;
          self.accessKeyTicker = setTimeout(
            self.getAccessKey,
            response.data.expires_in * 1000
          );
          self.getDepartures();
        })
        .then(function(error) {
          if (typeof error === "undefined" || error != null) {
            self.access_key = null;
          }
        });
    } else {
      this.getDepartures();
    }
  }
};
</script>

<style lang="scss" scoped>
#nextbus {
  .data_container > h3{
    font-weight: 400;
    border-bottom: 2px solid $darkWhiteColor;
    color: $darkWhiteColor;
    padding-bottom: 5px;
  }

  .departure_list {
    display: inline-block;

    div{
      display: inline-block;
    }
    .departure {
      list-style-type: none;
      padding: 10px 0;

      .departure_container{
        display: flex;
        align-items: center;

        .departures{
          div{
            &::before{
              content: ", ";
            }

            &:first-of-type{
              &::before{
                content: "";
              }
            }
          }
        }

        .bus_icon{
          font-size: 1.6em;
          padding-right: 10px;
        }

        .line{
          padding: 5px 8px;
          font-weight: 700;
        }

        .dep_info{
          justify-content: flex-end;
          display: flex;
          flex-direction: column;
          padding-left: 10px;

          .direction{
            font-weight: 700;
          }
        }
      }
    }
  }
}
</style>
