/**
 * 根据高德地图API规划导航路径
 * @param {*} gcoord 
 * @param {*} originGCJ02 
 * @param {*} destinationGCJ02 
 */
export const dealPathWithXhr = (gcoord, originGCJ02, destinationGCJ02, fn) => {
  $.ajax({
    url: "https://restapi.amap.com/v3/direction/driving",
    dataType: "json",
    async: true,
    data: {
      origin: `${originGCJ02[0].toFixed(6)},${originGCJ02[1].toFixed(6)}`,
      destination: `${destinationGCJ02[0].toFixed(
        6
      )},${destinationGCJ02[1].toFixed(6)}`,
      key: "81b836fbf5c7523ea1d5ef934b87603f",
    },
    success: (data) => {
      console.log("data", data);
      if (data.status < 1) {
      } else {
        let result = data.route;
        let paths = result.paths[0].steps;
        let positions = [];
        for (let index = 0; index < paths.length; index++) {
          const path = paths[index];
          let polyline = path.polyline;
          let polylinePoints = polyline.split(/[,]|;/);
          positions = positions.concat(polylinePoints);
        }
        positions = positions.map(Number);
        let positionsWGS84 = [];
        for (let index = 0; index < positions.length - 1; index += 2) {
          const pos = positions[index];
          const pos2 = positions[index + 1];
          let coordWGS84 = gcoord.transform(
            [pos, pos2],
            gcoord.GCJ02,
            gcoord.WGS84
          );
          positionsWGS84 = positionsWGS84.concat(coordWGS84);
        }
        window.billboardMap["pathRoute_analyse_lines"] = window.earth.entities.add({
          name: "pathRoute_line",
          polyline: {
            positions: Cesium.Cartesian3.fromDegreesArray(positionsWGS84),
            width: 14,
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
            material: new Cesium.PolylineArrowMaterialProperty(Cesium.Color.RED),
            clampToGround: true,
          },
        });
        fn && fn();
      }
    },
    // error: function () {
    //   callback(null);
    // },
  });
}

/**
 * 清除导航路径
 */
export const clearPath = () => {
  window.earth.entities.remove(window.billboardMap["pathRoute_analyse_lines"]);
}

/**
 * 模型按路径移动
 */
export const carModelMove = (lineEntity) => {
  console.log('carModelMove', lineEntity)
  if (!lineEntity) return;
  let positions = lineEntity.polyline.positions.getValue();
  if (!positions) return;
  let allDis = 0;
  for (let index = 0; index < positions.length - 1; index++) {
    let dis = Cesium.Cartesian3.distance(
      positions[index],
      positions[index + 1]
    );
    allDis += dis;
  }
  let playTime = 10;
  let v = allDis / playTime;
  let startTime = window.earth.clock.currentTime;
  let endTime = Cesium.JulianDate.addSeconds(
    startTime,
    playTime,
    new Cesium.JulianDate()
  );
  let property = new Cesium.SampledPositionProperty();
  let t = 0;
  for (let i = 1; i < positions.length; i++) {
    if (i == 1) {
      property.addSample(startTime, positions[0]);
    }
    let dis = Cesium.Cartesian3.distance(positions[i], positions[i - 1]);
    let time = dis / v + t;
    let julianDate = Cesium.JulianDate.addSeconds(
      startTime,
      time,
      new Cesium.JulianDate()
    );
    property.addSample(julianDate, positions[i]);
    t += dis / v;
  }
  if (window.billboardMap["pathRoute_analyse_carModel"]) {
    window.earth.entities.remove(window.billboardMap["pathRoute_analyse_carModel"]);
  }
  window.billboardMap["pathRoute_analyse_carModel"] = window.earth.entities.add({
    name: "carModel",
    position: property,
    orientation: new Cesium.VelocityOrientationProperty(property),
    model: {
      uri: "/static/gltf/Firetruck_rotate_270.gltf",
      scale: 6,
    },
  });
  window.earth.clock.currentTime = startTime;
  window.earth.clock.multiplier = 1;
  window.earth.clock.shouldAnimate = true;
  window.earth.clock.stopTime = endTime;
}