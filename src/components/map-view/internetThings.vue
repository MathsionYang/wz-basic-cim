<template>
  <div id="map"></div>
</template>

<script>

export default {
  data() {
    return {
      overlay: null,
      scaleControl: {},
    };
  },
  created() {},
  mounted() {
    this.init();
  },
  methods: {
    init() {
      var data, option;
      var URL =
        //"http://172.20.83.223:8091/iserver/services/map-agscachev2-YJDSJCGCS2000/rest/maps/YJ_DSJ_CGCS2000";
       " http://172.20.83.223:8091/iserver/services/map-agscachev2-DSJZG/rest/maps/DSJ_ZG";
 //"http://10.36.234.83:8090/iserver/services/map-XZQH/rest/maps/XZQHXZJD";

      var map = new mapboxgl.Map({
        container: "map", // container id
        style: {
          version: 8,
          sources: {
            "raster-tiles": {
              type: "raster",
              tileSize: 256,
              tiles: [URL],
              rasterSource: "iserver",
            },
          },

          layers: [
            {
              id: "simple-tiles",
              type: "raster",
              source: "raster-tiles",
              minzoom: 5,
              maxzoom: 24,
            },
          ],
        },
        crs: "EPSG:4490",
        center: [120.662287, 27.9],
        minZoom: 5,
        maxZoom: 24,
      });
      console.log("大数据底图",map);
      map.addControl(new mapboxgl.NavigationControl(), "top-left");
      var uploadedDataURL = "../../static/yjjson/Bus.json";

      $.get(uploadedDataURL, function (data) {
        var lines = [].concat.apply(
          [],
          data.map(function (busLine) {
            busLine.lineStyle.normal.color = "#FFA500";
            busLine.effect = {
              constantSpeed: 60,
              show: true,
              trailLength: 10,
              symbolSize: 50,
              symbol: (function () {
                 return "image://../../static/image/客车1.png";
                // if (Math.round(Math.random() * 2) % 2) {
                // /*   return "../../static/image/blueCar.png"; */
                // return "../../static/image/redCar.png";
                // } else {
                //   return "../../static/image/redCar.png";
                // }
              })(),
            };
            return busLine;
          })
        );

        option = {
          animation: false,
          GLMap: {
            roam: true,
          },
          coordinateSystem: "GLMap",
          geo: {
            map: "GLMap",
          },

          series: [
            {
              type: "lines",
              polyline: true,
              data: lines,
              silent: true,
              lineStyle: {
                normal: {
                  opacity: 0.2,
                  width: 5,
                },
              },
              progressiveThreshold: 500,
              progressive: 100,
            },
            {
              type: "lines",
              coordinateSystem: "GLMap",
              polyline: true,
              data: lines,
              lineStyle: {
                normal: {
                  width: 3,
                },
              },
              effect: {
                constantSpeed: 40,
                show: true,
                trailLength: 0,
                symbolSize: 50,
              },
            },
          ],
        };
        var echartslayer = new EchartsLayer(map);
        echartslayer.chart.setOption(option);
      });
    },
  },
};
</script>
   

<style>
#map {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
}
</style>