import { getIserverFields } from "api/iServerAPI";
const _COLLECTION_KEY_ = "eventAround";
// const _ENTITY_ID_ = "aroundSourceAnalyseCircle";

/**
 * 地图画点
 * @param {*} param0 
 */
export const aroundSourceAnalyseDraw = ({ key, list, title, dataset }) => {
    const KEY = `${_COLLECTION_KEY_}_${key}`;
    list.length &&
        list.map((v) => {
            const position = Cesium.Cartesian3.fromDegrees(+v.lng, +v.lat, 4);
            const smid = v.originalData.fieldValues[0]
            initFeatureMap(dataset, KEY, v, smid);
            window.labelMap[KEY].add({
                id: `label@${smid}@${KEY}@location`,
                text: v.resourceName,
                fillColor: Cesium.Color.WHITE,
                outlineColor: Cesium.Color.BLACK,
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                font: "8px",
                scale: 1,
                outlineWidth: 4,
                showBackground: true,
                backgroundColor: Cesium.Color(0.165, 0.165, 0.165, 0.1),
                distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 2000),
                pixelOffset: new Cesium.Cartesian2(0, -20),
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
                position,
            });
            window.billboardMap[KEY].add({
                id: `billboard@${smid}@${KEY}@location`,
                image: `/static/images/map-ico/${title}.png`,
                width: 26,
                height: 26,
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
                position,
            });
        });
}

/**
 * 画圆
 * @param {*} lng 
 * @param {*} lat 
 * @param {*} distance 
 */
export const aroundSourceAnalyseCircle = (lng, lat, distance) => {
    const datasource = window.earth.dataSources.getByName("around")[0];
    const circleEntity = new Cesium.Entity({
        position: Cesium.Cartesian3.fromDegrees(lng, lat, 0),
        ellipse: {
            semiMinorAxis: distance,
            semiMajorAxis: distance,
            height: 12,
            material: Cesium.Color.WHITE.withAlpha(0.1),
            outline: true,
            outlineWidth: 3,
            outlineColor: Cesium.Color.WHITE,
        },
        // name: _ENTITY_ID_,
        // id: _ENTITY_ID_,
    });
    // window.earth.entities.add(circleEntity);
    datasource.entities.add(circleEntity);

    window.labelMap["pathRoute_analyse_labels"].add({
        // id: "pathRoute_analyse_center",
        text: distance.toFixed(2) + ' 米',
        fillColor: Cesium.Color.WHITE,
        outlineColor: Cesium.Color.BLACK,
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        font: "10px",
        scale: 1,
        outlineWidth: 4,
        showBackground: true,
        backgroundColor: Cesium.Color(0.165, 0.165, 0.165, 0.1),
        pixelOffset: new Cesium.Cartesian2(0, -30),
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
        position: Cesium.Cartesian3.fromDegrees(lng+(distance/100000), lat, 20),
    });
}

export const removeAroundSourceAnalyseCircle = () => {
    const datasource = window.earth.dataSources.getByName("around")[0];
    datasource.entities.removeAll();
    window.labelMap["pathRoute_analyse_labels"].removeAll();
}

/**
 * 清除之前点位
 * @param {string} KEY 标识
*/
export const initPrimitivesCollection = (key) => {
    //  去圆 重复去
    // window.earth.entities.removeById(_ENTITY_ID_);
    const KEY = `${_COLLECTION_KEY_}_${key}`;
    //  若选择的图层存在，清点，清图层
    if (window.billboardMap[KEY]) {
        window.billboardMap[KEY].removeAll();
        window.labelMap[KEY].removeAll();
    }
    window.billboardMap[KEY] = window.earth.scene.primitives.add(
        new Cesium.BillboardCollection()
    );
    window.labelMap[KEY] = window.earth.scene.primitives.add(
        new Cesium.LabelCollection()
    );
    window.featureMap[KEY] = {};
}

//  隐藏资源周边分析
export const hideVisible = (node) => {
    // window.earth.entities.removeById(_ENTITY_ID_);
    if (node.icon && window.billboardMap[node.id]) {
        window.billboardMap[node.id]._billboards.map((v) => (v.show = false));
        window.labelMap[node.id].setAllLabelsVisible(false);
    }
}

/**
 * 全局数据赋值
 * @param {string} KEY
 * @param {object} data
 */
const initFeatureMap = async ({ url, newdataset }, KEY, data, smid) => {
    const fields = await getIserverFields(url, newdataset);
    const fieldHash = fixFieldsByArr(fields);
    const attributes = doObjFromArr(data.originalData);
    const name = data.resourceName;
    window.featureMap[KEY][smid] = {
        name,
        smid,
        geometry: {
            x: +data.lng,
            y: +data.lat,
        },
        attributes,
        fix_data: fixAttributesByOrigin(attributes, fieldHash),
        // fix_data: attributes,
        dataSet: "",
    };
}

/**
 * 数组转对象
 * @param {*} param0 
 */
const doObjFromArr = ({ fieldNames, fieldValues }) => {
    const obj = {};
    fieldNames.map((key, i) => {
        obj[key] = fieldValues[i]
    })
    return obj;
}

/**
 * 别名数组转对象
 * @param {*} fields
 */
const fixFieldsByArr = fields => {
    const fieldHash = {};
    fields.map(({ name, caption }) => {
        const reg = new RegExp("[\\u4E00-\\u9FFF]+", "g");
        reg.test(caption) ? (fieldHash[name.toLowerCase()] = caption) : undefined;
    });
    return fieldHash;
};

/**
 * 属性名替换中文别名
 * @param {*} attributes
 * @param {*} fields
 */
const fixAttributesByOrigin = (attributes, fields) => {
    const fixAttributes = {};
    for (let v in attributes) {
        const V = v.toLowerCase();
        fields[V] ? (fixAttributes[fields[V]] = attributes[v]) : undefined;
    }
    return fixAttributes;
};