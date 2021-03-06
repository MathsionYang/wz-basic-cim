import szf_road_light from "mock/lamp/szf_road_light.json";
import szf_road_lamp from "mock/lamp/szf_road_lamp.js";
import szf_direction_light from "mock/lamp/szf_direction_light.json";
import window_array from "config/local/windowPositions";
/**
 * 地图参数调节
 */
export const mapConfigInit = () => {
    // window.earth.scene.globe.depthTestAgainstTerrain = false;
    // window.earth.scene.debugShowFramesPerSecond = true;
    window.earth.clock.currentTime.secondsOfDay = 51830.97475229357
    // window.earth.scene.fxaa = true;
    //window.earth.scene.sun.show = true;
    window.earth.scene.bloomEffect.bloomIntensity = 1.05;
    window.earth.scene.bloomEffect.show = false;//泛光
    window.earth.imageryLayers.get(0).show = false;
    window.earth.scene.skyAtmosphere.show = true;
    window.earth.scene.globe.baseColor = new Cesium.Color.fromCssColorString(
        "rgba(13,24,45, 1)"
    );
    // window.earth.scene.globe.enableLighting = true;
    window.earth.scene.shadowMap.darkness = 0.35;
    // window.earth.scene.lightSource.ambientLightColor = new Cesium.Color(0.65, 0.65, 0.65, 1);
}

/**
 * 大数据底图叠加
 * @param {*} url 
 */
export const mapImageLayerInit = (url) => {
    return window.earth.imageryLayers.addImageryProvider(
        new Cesium.SuperMapImageryProvider({ url })
    );
}

/**
 * Mvt服务叠加
 * @param {*} name 
 * @param {*} url 
 */
export const mapMvtLayerInit = (name, url) => {
    window.earth.scene.addVectorTilesMap({ url, name, viewer: window.earth });
}
//范围面叠加
export const mapBJSWQLayerInit = (name, url, datanames) => {
    var getFeatureParam, getFeatureBySQLService, getFeatureBySQLParams;
    getFeatureParam = new SuperMap.REST.FilterParameter({
        attributeFilter: "SMID>0",
    });
    getFeatureBySQLParams = new SuperMap.REST.GetFeaturesBySQLParameters(
        {
            queryParameter: getFeatureParam,
            toIndex: -1,
            datasetNames: [datanames],
        }
    );
    getFeatureBySQLService = new SuperMap.REST.GetFeaturesBySQLService(
        url,
        {
            eventListeners: {
                processCompleted: onQueryComplete,
                processFailed: processFailed,
            },
        }
    );
    getFeatureBySQLService.processAsync(getFeatureBySQLParams);
    function onQueryComplete(queryEventArgs) {
        var selectedFeatures = queryEventArgs.originResult.features;
        for (var i = 0; i < selectedFeatures.length; i++) {
            addFeature(selectedFeatures[i]);
        }
    }
    function processFailed(queryEventArgs) {
    }
    function getLonLatArray(points) {
        var point3D = [];
        points.forEach(function (point) {
            point3D.push(point.x);
            point3D.push(point.y);
        });
        return point3D;
    }
    function addFeature(feature) {
        var lonLatArr = getLonLatArray(feature.geometry.points);
        for (let i = 0; i < feature.fieldNames.length; i++) {
            if (feature.fieldNames[i] == "NAME") {
                name = feature.fieldValues[i];
                window.fwm.push({ name: feature.fieldValues[i], points: feature.geometry.points });
            }

        }
        window.earth.entities.add({
            id: name,
            name: name,
            polyline: {
                positions: Cesium.Cartesian3.fromDegreesArray(lonLatArr),
                width: 5,
                material: new Cesium.Color(0 / 255, 255 / 255, 0, 1),
                clampToGround: true,//矢量线贴对象
                //classificationType: Cesium.ClassificationType.S3M_TILE, //矢量线贴对象
            },
        });
    }
}
//地图模型标签
export const maplabel = (name, url, datanames, type) => {
    var points = null;
    for (let i = 0; i < window.fwm.length; i++) {
        if (window.fwm[i].name == name) {
            points = window.fwm[i].points;
        }
    }
    var queryObj = {
        getFeatureMode: "SPATIAL",
        spatialQueryMode: "CONTAIN",
        datasetNames: [datanames],
        geometry: {
            points: points,
            type: "REGION"
        }
    };
    var queryData = JSON.stringify(queryObj); // 转化为JSON字符串作为查询参数
    $.ajax({
        type: "post",
        url: url,
        data: queryData,
        success: function (result) {
            var resultObj = JSON.parse(result);
            if (resultObj.featureCount > 0) {
                window.Buildinglogo = resultObj.features;
                processCompleted(resultObj.features);
            }
        },
        error: function (msg) {
            console.log(msg);
        }
    });
    function processCompleted(features) {
        var selectedFeatures = features;
        if (type == "老旧小区") {
            for (var i = 0; i < selectedFeatures.length; i++) {
                window.earth.entities.add({
                    position: Cesium.Cartesian3.fromDegrees(
                        parseFloat(selectedFeatures[i].fieldValues["32"]),
                        parseFloat(selectedFeatures[i].fieldValues["33"]),
                        parseFloat(selectedFeatures[i].fieldValues["30"]) + 3
                    ),
                    billboard: {
                        image: "/static/images/common/楼标.png",
                        width: 90,
                        height: 60
                    },
                    label: {
                        text: selectedFeatures[i].fieldValues["28"],
                        font: "40px PingFang SC bold;",
                        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                        outlineColor: Cesium.Color.White,
                        outlineWidth: 3,
                        pixelOffset: new Cesium.Cartesian2(0, -5)
                    },
                    id: selectedFeatures[i].fieldValues["22"],
                    name: selectedFeatures[i].fieldValues["22"]
                });
            }
        }

    }
}
//压平模型

/**
 * 水面叠加
 * @param {*} name 
 * @param {*} url 
 */
export const mapRiverLayerInit = (name, url) => {
    return new Promise((resolve, reject) => {
        const riverPromise = window.earth.scene.addS3MTilesLayerByScp(url, { name });
        Cesium.when(riverPromise, () => {
            const LAYER = window.earth.scene.layers.find(name)
            LAYER.style3D.bottomAltitude = 1;
            LAYER.refresh();
            LAYER.visibleDistanceMax = 2000;
            LAYER.visible = false;
            resolve(true)
        });
    })
}

/**
 * 路灯图层,玻璃3d模型叠加
 * @param {*} name 
 * @param {*} url 
 */
export const mapRoadLampLayerInit = (...params) => {
    //  路灯
    szf_road_lamp.Street_Lamp_light.map((item, i) => {
        const [x, y, z] = item;
        var position = new Cesium.Cartesian3.fromDegrees(x, y, z);
        const pointLight = new Cesium.PointLight(position, szf_road_lamp.options);
        window.earth.scene.addLightSource(pointLight);
    })
    //  聚光灯
    szf_road_light.position_array.map((item, i) => {
        const [x, y, z] = item;
        const [tx, ty, tz] = szf_road_light.tarposition_array[i];
        const position = new Cesium.Cartesian3(x, y, z);
        const targetPosition = new Cesium.Cartesian3(tx, ty, tz);
        var spotLight = new Cesium.SpotLight(position, targetPosition, szf_road_light.options);
        window.earth.scene.addLightSource(spotLight);
    })
    //  平行灯
    const dir_position = new Cesium.Cartesian3.fromDegrees(...szf_direction_light.position);
    const targetPosition = new Cesium.Cartesian3.fromDegrees(...szf_direction_light.tarposition);
    const dirLightOptions = {
        targetPosition,
        ...szf_direction_light.options
    };
    window.earth.scene.addLightSource(new Cesium.DirectionalLight(dir_position, dirLightOptions));
    //  窗户
    const WindowsEntityCollection = new Cesium.CustomDataSource('cesium-windows');
    window.earth.dataSources.add(WindowsEntityCollection).then(datasource => {
        window.windowEntityMap = datasource;
    });
    window_array.map(v => {
        WindowsEntityCollection.entities.add({
            name: v.name,
            position: new Cesium.Cartesian3.fromDegrees(...v.geometry),
            model: {
                uri: v.url
            }
        });
    })
}

/**
 * 开关路灯/窗户
 * @param {*} boolean 
 */
export const mapRoadLampLayerTurn = (boolean) => {
    window.earth.scene.lightSource.pointLight._array.map(v => v.intensity = boolean ? 4 : 0)
    window.earth.scene.lightSource.spotLight._array.map(v => v.intensity = boolean ? 2 : 0)
    window.earth.scene.lightSource.directionalLight._array.map(v => v.intensity = boolean ? 1 : 0)
    window.windowEntityMap.show = boolean ? true : false;
    window.earth.scene.sun.show = boolean ? false : true;
}

/**
 * 阴影查询
 */
export const mapShadowInit = () => {
    window.shadowQuery = new Cesium.ShadowQueryPoints(window.earth.scene);
    window.shadowQuery.build();
}

/**
 * 白模叠加初始化
 * @param {*} arrURL 
 */

export const mapBaimoLayerInit = (arrURL) => {
    return new Promise((resolve, reject) => {
        arrURL.map(({ KEY, URL, FLOW, d, s, withoutFix }, index) => {
            const baimoPromise = window.earth.scene.addS3MTilesLayerByScp(URL, {
                name: KEY,
            });
            Cesium.when(baimoPromise, async (_LAYER_) => {
                const LAYER = window.earth.scene.layers.find(KEY);
                LAYER.indexedDBSetting.isGeoTilesRootNodeSave = true;
                LAYER.residentRootTile = true;
                if (FLOW) {
                    LAYER.style3D.fillForeColor = new Cesium.Color.fromCssColorString(
                        "rgba(137,137,137, 1)"
                    );
                    const hyp = new Cesium.HypsometricSetting();
                    const colorTable = new Cesium.ColorTable();
                    hyp.MaxVisibleValue = 300;
                    hyp.MinVisibleValue = 0;
                    colorTable.insert(300, new Cesium.Color(1, 1, 1));
                    colorTable.insert(160, new Cesium.Color(0.95, 0.95, 0.95));
                    colorTable.insert(76, new Cesium.Color(0.7, 0.7, 0.7));
                    colorTable.insert(0, new Cesium.Color(13 / 255, 24 / 255, 45 / 255));
                    hyp.ColorTable = colorTable;
                    hyp.DisplayMode = Cesium.HypsometricSettingEnum.DisplayMode.FACE;
                    hyp.Opacity = 1;
                    //  贴图纹理
                    hyp.emissionTextureUrl = "/static/images/area/speedline.png";
                    hyp.emissionTexCoordUSpeed = 0.2;
                    LAYER.hypsometricSetting = {
                        hypsometricSetting: hyp,
                        analysisMode:
                            Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_ALL,
                    };
                } else {
                    if (withoutFix) {
                        LAYER.style3D.fillForeColor = new Cesium.Color(0.4, 0.4, 0.43)
                    } else {
                        LAYER.brightness = 0.5;
                        LAYER.gamma = 0.6;
                        LAYER.refresh();
                    }
                }
                //  最大可见
                d && (LAYER.visibleDistanceMax = d);
                s && (LAYER.shadowType = 2)
                index == arrURL.length - 1 && resolve(true)
            });
        });
    })
}