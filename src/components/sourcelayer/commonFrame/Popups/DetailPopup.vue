<!--
 * @Author: eds
 * @Date: 2020-08-12 14:32:09
 * @LastEditTime: 2021-03-22 11:14:24
 * @LastEditors: Please set LastEditors
 * @Description:
 * @FilePath: \wz-city-culture-tour\src\components\sourcelayer\commonFrame\DetailPopup\DetailPopup.vue
-->
<template>
  <div id="forcePopUp">
    <div
      id="forcePopUpContent"
      class="leaflet-popup"
      v-show="forcePosition.x && forcePosition.y"
      :style="{
        transform: `translate3d(${forcePosition.x}px,${forcePosition.y}px, 0)`,
      }"
    >
      <a class="leaflet-popup-close-button" href="#" @click="closePopup">×</a>
      <div class="leaflet-popup-content-wrapper">
        <div class="toubu">
          {{ forceEntity.name }}
        </div>
        <div class="zhongbu">
          <div
            v-for="(item, key, index) in forceEntity.fix_data"
            class="liebiao"
            :key="index"
            v-show="item && !~filterKey.indexOf(key) && index < 6"
          >
            <div style="display: inline-block; color: #ffffff">{{ key }}:</div>
            <div style="display: inline-block">{{ item }}</div>
          </div>
          <!-- <ul class="content-body">
            <li
              v-for="(item, key, index) in forceEntity.fix_data"
              :key="index"
              v-show="item && !~filterKey.indexOf(key) && index < 6"
            >
              <span>{{ key }}</span>
              <span>{{ item }}</span>
            </li>
          </ul> -->
        </div>

        <div
          class="extra-tab extra-tab_SP"
          :class="{ active: extraTabActive == 'sp' }"
          @click="doVideoRtmp"
        ></div>
        <div
          class="extra-tab extra-tab_FX"
          :class="{ active: extraTabActive == 'fx' }"
          @click="doAroundSourceAnalyse"
        ></div>
        <div
          class="extra-tab extra-tab_RKDT"
          :class="{ active: extraTabActive == 'rkdt' }"
          @click="doCircleBuffer"
        ></div>
        <div
          class="extra-tab extra-tab_VR"
          :class="{ active: extraTabActive == 'VR' }"
          v-if="forceEntity.fix_data && forceEntity.fix_data['全景地址']"
          @click="doVR"
        ></div>
        <div
          class="extra-tab extra-tab_GC"
          :class="{ active: extraTabActive == 'GC' }"
          v-if="forceEntity.fix_data && forceEntity.fix_data['项目代码']"
          @click="doGC"
        ></div>
        <div
          class="extra-tab extra-tab_TZ"
          :class="{ active: extraTabActive == 'TZ' }"
          v-if="forceEntity.fix_data && forceEntity.fix_data['项目代码']"
          @click="doTZ"
        ></div>
        <div class="around-people" v-if="buffer && buffer.success">
          <!-- <img src="/static/images/common/frameline@2x.png" /> -->
          <div>
            <header>周边实时人口</header>
            <div>
              <p>范围：500米</p>
              <strong>{{ `人数：${buffer.data || "-"}人` }}</strong>
              <p>{{ buffer.task_time }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="side-info"
      v-if="!showSide && !fixedForceBimData.length && showface"
    >
      <div class="info-header">
        <div class="title">信息详情</div>
        <div class="decorate"></div>
        <div class="close" @click="closePopup"></div>
      </div>
      <ul class="info-content">
        <li
          class="info-item"
          v-for="(item, key, index) in facedata"
          :key="index"
          v-show="item != ''"
        >
          <span class="key" :title="key">{{ key }}</span>
          <span class="value" :title="item">{{ item }}</span>
        </li>
      </ul>
    </div>
    <div
      class="side-info"
      v-if="showSide && !fixedForceBimData.length && !showface"
    >
      <div class="info-header">
        <div class="title">信息详情</div>
        <div class="decorate"></div>
        <div class="close" @click="closePopup"></div>
      </div>
      <ul class="info-content">
        <li
          class="info-item"
          v-for="(item, key, index) in forceEntity.fix_data"
          :key="index"
          v-show="item && !~filterKey.indexOf(key)"
        >
          <span class="key" :title="key">{{ key }}</span>
          <span class="value" :title="item">{{ item }}</span>
        </li>
      </ul>
    </div>
    <div
      class="side-info"
      v-if="fixedForceBimData.length && !showSide && !showface"
    >
      <div class="info-header">
        <div class="title">信息详情</div>
        <div class="decorate"></div>
        <div
          class="parts"
          :class="{ active: partsclick == true }"
          @click="ispartsclick()"
        ></div>
        <!-- <div @click="toggleLight()">灯开关</div> -->
        <div class="close" @click="closeBimFrame()"></div>
      </div>
      <ul class="info-content">
        <li
          class="info-item"
          v-for="(item, index) in fixedForceBimData"
          :key="index"
          v-show="item"
        >
          <span class="key" :title="item.k">{{ item.k }}</span>
          <span class="value" :title="item.v">{{ item.v }}</span>
        </li>
      </ul>
      <div class="info-header" v-if="!partsclick">
        <div class="title">项目材料</div>
        <div class="decorate"></div>
        <div class="close" @click="closePopup"></div>
      </div>
      <ul class="info-content" v-if="JZLX == '市民中心' && !partsclick">
        <li
          class="info-item"
          v-for="(item, key, index) in CivicCenter"
          :key="index"
          v-show="item"
        >
          <span class="keys" :title="item.name" @click="dozl(item.url)">{{
            item.name
          }}</span>
        </li>
      </ul>
      <ul class="info-content" v-if="JZLX == '超高层' && !partsclick">
        <li
          class="info-item"
          v-for="(item, key, index) in Superhighrise"
          :key="index"
          v-show="item"
        >
          <span class="keys" :title="item.name" @click="dozl(item.url)">{{
            item.name
          }}</span>
        </li>
      </ul>
    </div>
    <div class="extra-frame" v-if="isFrame">
      <span @click="(isFrame = false), (extraTabActive = '')">X</span
      ><iframe :src="isFrame" />
    </div>
    <div class="container" v-if="isld && !showSide && !showrk">
      <div class="fhj" @click="fh"></div>
      <div class="closes" @click="closePopup"></div>
      <div class="ljxqlabel">
        <div id="mains">
          <div class="titles">小区楼栋基本信息</div>
          <div class="decorates"></div>
          <div class="snf-pages">
            <div class="titless">建筑基本信息</div>
            <div class="decoratess"></div>
            <table class="hovertable">
              <tr>
                <td class="table1">楼幢名称</td>
                <td class="table2" colspan="3">蒲鞋市新村59号楼</td>
              </tr>

              <tr>
                <td class="table1">性质</td>
                <td class="table3">{{ forceEntity.fix_data["性质"] }}</td>
                <td class="table1">面积</td>
                <td class="table3">1000平方米</td>
              </tr>
              <tr>
                <td class="table1">住宅</td>
                <td class="table3">{{ forceEntity.fix_data["住宅"] }}</td>
                <td class="table1">商业</td>
                <td class="table3">{{ forceEntity.fix_data["商业"] }}</td>
              </tr>
              <tr>
                <td class="table1">建成时间</td>
                <td class="table3">{{ forceEntity.fix_data["建成时间"] }}</td>
                <td class="table1">层数</td>
                <td class="table3">{{ forceEntity.fix_data["层数"] }}</td>
              </tr>
              <tr>
                <td class="table1">结构形式</td>
                <td class="table3">{{ forceEntity.fix_data["结构形式"] }}</td>
                <td class="table1">产权归属</td>
                <td class="table3">{{ forceEntity.fix_data["产权归属"] }}</td>
              </tr>
              <tr>
                <td class="table1">需要拆改</td>
                <td class="table3">否</td>
                <td class="table1">拆改形式</td>
                <td class="table3">无</td>
              </tr>

              <tr>
                <td class="table1">是否有加装电梯</td>
                <td class="table3">
                  {{ forceEntity.fix_data["否有加装电梯"] }}
                </td>
                <td class="table1">是否有平改坡</td>
                <td class="table3">
                  {{ forceEntity.fix_data["是否有平改坡"] }}
                </td>
              </tr>
              <tr>
                <td class="table1">违章情况</td>
                <td class="table3">{{ forceEntity.fix_data["违章情况"] }}</td>
                <td class="table1">有否单元门</td>
                <td class="table3">有</td>
              </tr>
              <tr>
                <td class="table1">雨棚</td>
                <td class="table3">5</td>
                <td class="table1">窗罩</td>
                <td class="table3">7</td>
              </tr>
              <tr>
                <td class="table1">空调机位置</td>
                <td class="table3">窗台下</td>
                <td class="table1">可再生能源使用</td>
                <td class="table3">
                  {{ forceEntity.fix_data["可再生能源使用"] }}
                </td>
              </tr>
            </table>

            <div class="titles">排查信息</div>
            <div class="decoratess"></div>
            <table class="hovertable">
              <tr>
                <td class="table1">变形情况</td>
                <td class="table3">无变形</td>
                <td class="table1">拆改加层情况</td>
                <td class="table3">无</td>
              </tr>

              <tr>
                <td class="table1">幕墙</td>
                <td class="table3">无</td>
                <td class="table1">排查发现的主要问题</td>
                <td class="table3">暂未发现威胁房屋结构的情况</td>
              </tr>
              <tr>
                <td class="table1">排查登记</td>
                <td class="table3">一级</td>
                <td class="table1">是否经过鉴定</td>
                <td class="table3">是</td>
              </tr>
              <tr>
                <td class="table1">危房级别</td>
                <td class="table3">A级</td>
                <td class="table1"></td>
                <td class="table3"></td>
              </tr>
            </table>
          </div>
          <div class="snf-pages">
            <div class="titless">小区楼层信息</div>
            <div class="decoratess"></div>
            <!-- <table class="hovertable">
              <tr>
                <td class="table4">1F</td>
                <td class="table4" @click="lcclick('2')">2F</td>
                <td class="table4" @click="lcclick('3')">3F</td>
                <td class="table4" @click="lcclick('4')">4F</td>
              </tr>
            </table> -->
            <div class="btn-group">
              <el-button class="btn-item" size="mini">1F</el-button>
              <el-button class="btn-item" size="mini" @click="lcclick('2')"
                >2F</el-button
              >
              <el-button class="btn-item" size="mini" @click="lcclick('3')"
                >3F</el-button
              >
              <el-button class="btn-item" size="mini" @click="lcclick('4')"
                >4F</el-button
              >
            </div>
          </div>
          <div class="snf-pages" v-if="lsdata != ''">
            <div class="titless">小区楼室信息</div>
            <div class="decoratess"></div>
            <table class="hovertable">
              <tr>
                <td class="table4" @click="lsclick(lsdata + '01')">
                  {{ lsdata + "01" }}
                </td>
                <td class="table4" @click="lsclick(lsdata + '02')">
                  {{ lsdata + "02" }}
                </td>
                <td class="table4" @click="lsclick(lsdata + '03')">
                  {{ lsdata + "03" }}
                </td>
                <td class="table4" @click="lsclick(lsdata + '04')">
                  {{ lsdata + "04" }}
                </td>
              </tr>
              <tr>
                <td class="table4" @click="lsclick(lsdata + '05')">
                  {{ lsdata + "05" }}
                </td>
                <td class="table4" @click="lsclick(lsdata + '06')">
                  {{ lsdata + "06" }}
                </td>
                <td class="table4"></td>
                <td class="table4"></td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>
    <div class="container" v-if="isLJ && !showSide && !showrk">
      <div id="nav">
        <div class="snf-nav active"><span class="lqwz">小区基本信息</span></div>
        <div class="snf-nav"><span class="lqwz">小区楼栋信息</span></div>
        <div class="snf-nav"><span class="lqwz">市政基本信息</span></div>
        <div class="snf-nav"><span class="lqwz">景观绿化基本信息</span></div>
      </div>
      <div class="closes" @click="closePopup"></div>
      <div class="ljxqlabel">
        <div id="main">
          <div class="snf-page">
            <div class="titles">小区基本信息</div>
            <div class="decorates"></div>
            <div class="titless">小区建设现状</div>
            <div class="decoratess"></div>
            <table class="hovertable">
              <tr>
                <td class="table1">名称</td>
                <td class="table2" colspan="3">
                  {{ forceEntity.fix_data["名称"] }}
                </td>
              </tr>
              <tr>
                <td class="table1">区(市、县)</td>
                <td class="table3">{{ forceEntity.fix_data["区市县"] }}</td>
                <td class="table1">街道</td>
                <td class="table3">{{ forceEntity.fix_data["街道"] }}</td>
              </tr>

              <tr>
                <td class="table1">社区</td>
                <td class="table3">{{ forceEntity.fix_data["社区"] }}</td>
                <td class="table1">性质</td>
                <td class="table3">{{ forceEntity.fix_data["性质"] }}</td>
              </tr>

              <tr>
                <td class="table1">建筑总面积</td>
                <td class="table3">{{ forceEntity.fix_data["建筑总面积"] }}</td>
                <td class="table1">容积率</td>
                <td class="table3">{{ forceEntity.fix_data["容积率"] }}</td>
              </tr>

              <tr>
                <td class="table1">绿化率</td>
                <td class="table3">{{ forceEntity.fix_data["绿化率"] }}</td>
                <td class="table1">幢数</td>
                <td class="table3">{{ forceEntity.fix_data["幢数"] }}</td>
              </tr>
              <tr>
                <td class="table1">住宅</td>
                <td class="table3">{{ forceEntity.fix_data["住宅"] }}</td>
                <td class="table1">商业</td>
                <td class="table3">{{ forceEntity.fix_data["商业"] }}</td>
              </tr>
              <tr>
                <td class="table1">建成时间</td>
                <td class="table3">{{ forceEntity.fix_data["建成时间"] }}</td>
                <td class="table1">层数</td>
                <td class="table3">{{ forceEntity.fix_data["层数"] }}</td>
              </tr>
              <tr>
                <td class="table1">结构形式</td>
                <td class="table3">{{ forceEntity.fix_data["结构形式"] }}</td>
                <td class="table1">产权归属</td>
                <td class="table3">{{ forceEntity.fix_data["产权归属"] }}</td>
              </tr>
            </table>

            <div class="titless">改造调查情况</div>
            <div class="decoratess"></div>
            <table class="hovertable">
              <tr>
                <td class="table1">小区是否存在存量房</td>
                <td class="table3">
                  {{ forceEntity.fix_data["小区是否存在存量房"] }}
                </td>
                <td class="table1">是否有闲置车棚车库</td>
                <td class="table3">
                  {{ forceEntity.fix_data["是否有闲置车棚车库"] }}
                </td>
              </tr>

              <tr>
                <td class="table1">其他配套</td>
                <td class="table3">{{ forceEntity.fix_data["其他配套"] }}</td>
                <td class="table1">是否有物业</td>
                <td class="table3">{{ forceEntity.fix_data["是否有物业"] }}</td>
              </tr>
              <tr>
                <td class="table1">是否经过鉴定</td>
                <td class="table3">
                  {{ forceEntity.fix_data["是否经过鉴定"] }}
                </td>
                <td class="table1">是否有危房</td>
                <td class="table3">{{ forceEntity.fix_data["是否有危房"] }}</td>
              </tr>
              <tr>
                <td class="table1">是否需要拆除</td>
                <td class="table3">
                  {{ forceEntity.fix_data["是否需要拆除"] }}
                </td>
                <td class="table1">是否有加装电梯</td>
                <td class="table3">
                  {{ forceEntity.fix_data["是否有加装电梯"] }}
                </td>
              </tr>
              <tr>
                <td class="table1">是否有平改坡</td>
                <td class="table3">
                  {{ forceEntity.fix_data["是否有平改坡"] }}
                </td>
                <td class="table1">违章情况</td>
                <td class="table3">{{ forceEntity.fix_data["违章情况"] }}</td>
              </tr>
              <tr>
                <td class="table1">是否有过综合整治</td>
                <td class="table3">
                  {{ forceEntity.fix_data["近是否有过综合整治"] }}
                </td>
                <td class="table1">住户数</td>
                <td class="table3">{{ forceEntity.fix_data["住户数"] }}</td>
              </tr>
              <tr>
                <td class="table1">年龄组成</td>
                <td class="table3">{{ forceEntity.fix_data["年龄组成"] }}</td>
                <td class="table1">居民改造意愿</td>
                <td class="table3">
                  {{ forceEntity.fix_data["居民改造意愿"] }}
                </td>
              </tr>
              <tr>
                <td class="table1">历史文化资源</td>
                <td class="table3">
                  {{ forceEntity.fix_data["历史文化资源"] }}
                </td>
                <td class="table1">小区特色</td>
                <td class="table3">{{ forceEntity.fix_data["小区特色"] }}</td>
              </tr>
              <tr>
                <td class="table1">机动车数量</td>
                <td class="table3">{{ forceEntity.fix_data["机动车数量"] }}</td>
                <td class="table1">非机动车数量</td>
                <td class="table3">
                  {{ forceEntity.fix_data["非机动车数量"] }}
                </td>
              </tr>
              <tr>
                <td class="table1">可再生能源使用</td>
                <td class="table3">
                  {{ forceEntity.fix_data["可再生能源使用"] }}
                </td>
                <td class="table1"></td>
                <td class="table3">{{ forceEntity.fix_data[""] }}</td>
              </tr>
            </table>
          </div>
          <div class="snf-page">
            <div class="titless">小区楼栋信息</div>
            <div class="decoratess"></div>
            <!-- <table class="hovertable">
              <tr>
                <td class="table4" @click="ldclick('51')">51</td>
                <td class="table4" @click="ldclick('52')">52</td>
                <td class="table4" @click="ldclick('53')">53</td>
                <td class="table4" @click="ldclick('54')">54</td>
                <td class="table4" @click="ldclick('55')">55</td>
              </tr>
              <tr>
                <td class="table4" @click="ldclick('56')">56</td>
                <td class="table4" @click="ldclick('57')">57</td>
                <td class="table4" @click="ldclick('58')">58</td>
                <td class="table4" @click="ldclick('59')">59</td>
                <td class="table4" @click="ldclick('60')">60</td>
              </tr>
            </table> -->
            <div class="btn-group">
              <el-button class="btn-item" @click="ldclick('51')" size="mini"
                >51</el-button
              >
              <el-button class="btn-item" @click="ldclick('52')" size="mini"
                >52</el-button
              >
              <el-button class="btn-item" @click="ldclick('53')" size="mini"
                >53</el-button
              >
              <el-button class="btn-item" @click="ldclick('54')" size="mini"
                >54</el-button
              >
              <el-button class="btn-item" @click="ldclick('55')" size="mini"
                >55</el-button
              >
              <el-button class="btn-item" @click="ldclick('56')" size="mini"
                >56</el-button
              >
              <el-button class="btn-item" @click="ldclick('57')" size="mini"
                >57</el-button
              >
              <el-button class="btn-item" @click="ldclick('58')" size="mini"
                >58</el-button
              >
              <el-button class="btn-item" @click="ldclick('59')" size="mini"
                >59</el-button
              >
              <el-button class="btn-item" @click="ldclick('60')" size="mini"
                >60</el-button
              >
            </div>
          </div>
          <div class="snf-page">
            <div class="titles">市政基本信息</div>
            <div class="decorates"></div>
            <table class="hovertable">
              <tr>
                <td class="table1">是否人车分流</td>
                <td class="table3">
                  {{ forceEntity.fix_data["是否人车分流"] }}
                </td>
                <td class="table1">道路交通标识和标线</td>
                <td class="table3">
                  {{ forceEntity.fix_data["道路交通标识和标线"] }}
                </td>
              </tr>

              <tr>
                <td class="table1">消防车、救护车可否通行</td>
                <td class="table3">
                  {{ forceEntity.fix_data["消防车、救护车可否通行"] }}
                </td>
                <td class="table1">路面材料</td>
                <td class="table3">{{ forceEntity.fix_data["路面材料"] }}</td>
              </tr>

              <tr>
                <td class="table1">破损情况</td>
                <td class="table3">{{ forceEntity.fix_data["破损情况"] }}</td>
                <td class="table1">地面停车位</td>
                <td class="table3">{{ forceEntity.fix_data["地面停车位"] }}</td>
              </tr>

              <tr>
                <td class="table1">地下停车位</td>
                <td class="table3">{{ forceEntity.fix_data["地下停车位"] }}</td>
                <td class="table1">电动车充电设施</td>
                <td class="table3">
                  {{ forceEntity.fix_data["电动车充电设施"] }}
                </td>
              </tr>
              <tr>
                <td class="table1">雨污水排放</td>
                <td class="table3">{{ forceEntity.fix_data["雨污水排放"] }}</td>
                <td class="table1">井盖</td>
                <td class="table3">{{ forceEntity.fix_data["井盖"] }}</td>
              </tr>
              <tr>
                <td class="table1">垃圾分类</td>
                <td class="table3">{{ forceEntity.fix_data["垃圾分类"] }}</td>
                <td class="table1">垃圾屋</td>
                <td class="table3">{{ forceEntity.fix_data["垃圾屋"] }}</td>
              </tr>
              <tr>
                <td class="table1">室外照明</td>
                <td class="table3">{{ forceEntity.fix_data["室外照明"] }}</td>
                <td class="table1">管线落地情况</td>
                <td class="table3">
                  {{ forceEntity.fix_data[" 管线落地情况"] }}
                </td>
              </tr>
            </table>
          </div>
          <div class="snf-page" style="height: 67vh">
            <div class="titles">景观绿化基本信息</div>
            <div class="decorates"></div>
            <table class="hovertable">
              <tr>
                <td class="table1">绿地面积</td>
                <td class="table3">{{ forceEntity.fix_data["绿地面积"] }}</td>
                <td class="table1">绿地率</td>
                <td class="table3">{{ forceEntity.fix_data["绿地率"] }}</td>
              </tr>

              <tr>
                <td class="table1">有无保护古树</td>
                <td class="table3">
                  {{ forceEntity.fix_data["有无保护古树"] }}
                </td>
                <td class="table1">大乔木</td>
                <td class="table3">{{ forceEntity.fix_data["大乔木"] }}</td>
              </tr>

              <tr>
                <td class="table1">灌木面积</td>
                <td class="table3">{{ forceEntity.fix_data[" 灌木面积"] }}</td>
                <td class="table1">草皮面积</td>
                <td class="table3">{{ forceEntity.fix_data["草皮面积"] }}</td>
              </tr>

              <tr>
                <td class="table1">植草砖</td>
                <td class="table3">{{ forceEntity.fix_data["植草砖"] }}</td>
                <td class="table1">居民利用绿地</td>
                <td class="table3">
                  {{ forceEntity.fix_data["居民利用绿地"] }}
                </td>
              </tr>
              <tr>
                <td class="table1">树池材质</td>
                <td class="table3">{{ forceEntity.fix_data["树池材质"] }}</td>
                <td class="table1">景观小品</td>
                <td class="table3">{{ forceEntity.fix_data["景观小品"] }}</td>
              </tr>
              <tr>
                <td class="table1">休息座椅</td>
                <td class="table3">25座</td>
                <td class="table1">围墙</td>
                <td class="table3">{{ forceEntity.fix_data["围墙"] }}</td>
              </tr>
              <tr>
                <td class="table1">活动场地</td>
                <td class="table3">{{ forceEntity.fix_data["活动场地"] }}</td>
                <td class="table1">海绵设施</td>
                <td class="table3">{{ forceEntity.fix_data["海绵设施"] }}</td>
              </tr>
              <tr>
                <td class="table1">屋顶绿化</td>
                <td class="table3">{{ forceEntity.fix_data["屋顶绿化"] }}</td>
                <td class="table1">垂直绿化</td>
                <td class="table3">{{ forceEntity.fix_data["垂直绿化"] }}</td>
              </tr>
              <tr>
                <td class="table1">景观水体</td>
                <td class="table3">{{ forceEntity.fix_data["景观水体"] }}</td>
                <td class="table1"></td>
                <td class="table3"></td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { simpleNavFollow } from "./simpleNavFollowing";
import { getIserverFields } from "api/iServerAPI";
import { maplabel } from "components/sourcelayer/cesium_map_init";
import { mapGetters, mapActions } from "vuex";
import { FILTER_KEYS, HASH_KEYS } from "./filterKeys";
export default {
  data() {
    return {
      forceEntity: {},
      forcePosition: {},
      buffer: null,
      showrk: false,
      filterKey: ["永久固定码", "唯一码", "分类代码", "全景地址"],
      showSide: false,
      showface: false,
      facedata: "",
      extraTabActive: "",
      isFrame: false,
      isSelected: "",
      isLJ: false,
      isld: false,
      lsdata: "",
      LCdata: [],
      Lb: [],
      JZLX: "",
      activeTab: "bim",
      partsclick: false,
      Buildinglogo: [],
      CivicCenter: [
        {
          name: "规划条件通知书（12-04地块）",
          url:
            "http://172.20.83.195:9901/file/市民中心/10.规划条件通知书（12-04地块）.pdf",
        },
        {
          name: "T01-06B地块规划设计条件",
          url:
            "http://172.20.83.195:9901/file/市民中心/T01-06B地块规划设计条件.pdf",
        },
        {
          name: "市民中心方案汇报20170717",
          url:
            "http://172.20.83.195:9901/file/市民中心/附件1：市民中心方案汇报20170717.pdf",
        },
        {
          name: "市民中心投资备案项目登记表",
          url:
            "http://172.20.83.195:9901/file/市民中心/市民中心投资备案项目登记表.pdf",
        },
        {
          name: "温州市市民中心效果图",
          url:
            "http://172.20.83.195:9901/file/市民中心/温州市市民中心效果图.pdf",
        },
      ],
      Superhighrise: [
        {
          name: "12-05 12-07备案项目底单",
          url:
            "http://172.20.83.195:9901/file/CBD片区12-05地块/12-05 12-07备案项目底单.pdf",
        },
        {
          name: "12-05 12-07方案批复",
          url:
            "http://172.20.83.195:9901/file/CBD片区12-05地块/12-05 12-07方案批复.pdf",
        },
        {
          name: "12-05建设用地规划许可证",
          url:
            "http://172.20.83.195:9901/file/CBD片区12-05地块/12-05建设用地规划许可证.pdf",
        },
        {
          name: "12-05土地使用权证",
          url:
            "http://172.20.83.195:9901/file/CBD片区12-05地块/12-05土地使用权证.pdf",
        },
        {
          name: "第二册 设计方案",
          url:
            "http://172.20.83.195:9901/file/CBD片区12-05地块/第二册 设计方案.pdf",
        },
        {
          name: "第一册 设计方案（要件）",
          url:
            "http://172.20.83.195:9901/file/CBD片区12-05地块/第一册 设计方案（要件）.pdf",
        },
        {
          name: "第一册 设计方案（要件）_页面_59",
          url:
            "http://172.20.83.195:9901/file/CBD片区12-05地块/第一册 设计方案（要件）_页面_59.jpg",
        },
        {
          name: "第一册 设计方案（要件）_页面_60",
          url:
            "http://172.20.83.195:9901/file/CBD片区12-05地块/第一册 设计方案（要件）_页面_60.jpg",
        },
        {
          name: "第一册 设计方案（要件）_页面_61",
          url:
            "http://172.20.83.195:9901/file/CBD片区12-05地块/第一册 设计方案（要件）_页面_61.jpg",
        },
        {
          name: "第一册 设计方案（要件）_页面_62",
          url:
            "http://172.20.83.195:9901/file/CBD片区12-05地块/第一册 设计方案（要件）_页面_62.jpg",
        },
        {
          name: "第一册 设计方案（要件）_页面_63",
          url:
            "http://172.20.83.195:9901/file/CBD片区12-05地块/第一册 设计方案（要件）_页面_63.jpg",
        },
        {
          name: "第一册 设计方案（要件）_页面_64",
          url:
            "http://172.20.83.195:9901/file/CBD片区12-05地块/第一册 设计方案（要件）_页面_64.jpg",
        },
        {
          name: "第一册 设计方案（要件）_页面_65",
          url:
            "http://172.20.83.195:9901/file/CBD片区12-05地块/第一册 设计方案（要件）_页面_65.jpg",
        },
        {
          name: "第一册 设计方案（要件）_页面_66",
          url:
            "http://172.20.83.195:9901/file/CBD片区12-05地块/第一册 设计方案（要件）_页面_66.jpg",
        },
      ],
    };
  },
  computed: {
    ...mapGetters("map", ["forceBimData", "forceRoomData", "forceBimIDS"]),
    fixedForceBimData() {
      this.showSide = false;
      return [
        ...this.forceBimData
          .filter(({ k, v }) => !~FILTER_KEYS.indexOf(k) && v)
          .map(({ k, v }) => {
            if (v.indexOf("超高层") != -1) {
              this.JZLX = "超高层";
            }
            if (v.indexOf("市民中心") != -1) {
              this.JZLX = "市民中心";
            }
            return { k: HASH_KEYS[k] || k, v };
          }),
      ];
    },
    fixedForceRoomData() {
      return this.forceRoomData
        .filter(({ k, v }) => !~FILTER_KEYS.indexOf(k))
        .map(({ k, v }) => {
          return { k: HASH_KEYS[k] || k, v };
        });
    },
  },
  async mounted() {
    this.eventRegsiter();
  },
  methods: {
    ...mapActions("map", [
      "SetForceBimData",
      "SetForceRoomData",
      "SetForceBimIDS",
    ]),
    ispartsclick() {
      if (window.lastHouseEntity) {
        window.earth.entities.remove(window.lastHouseEntity);
        window.lastHouseEntity = null;
      }
      window.ispartsclick = !window.ispartsclick;
      if (window.ispartsclick) {
        for (let i = 0; i < window.earth.scene.layers.layerQueue.length; i++) {
          if (
            window.earth.scene.layers.layerQueue[i].name.indexOf(
              "ivilization_center"
            ) > -1 ||
            window.earth.scene.layers.layerQueue[i].name.indexOf("chao") > -1
          ) {
            window.earth.scene.layers.layerQueue[
              i
            ].orderIndependentTranslucency = true;
          }
        }
      }
      this.partsclick = window.ispartsclick;
    },
    closeBimFrame() {
      window.ispartsclick = false;
      this.partsclick = false;
      this.showSide = false;
      this.fixedForceBimData.length = 0;
      this.SetForceBimData([]);
      this.SetForceRoomData([]);
      this.SetForceBimIDS([]);
    },
    bindHandler() {
      var snf = simpleNavFollow({
        parentElement: "#main", //内容类的父元素
        nav: ".snf-nav", //导航类
        page: ".snf-page", //内容类
        leaveTop: 0, //离父类距离
        initTo: 0, //初始跳转
        animation: 400, //动画时间
        followCallBack: function (index) {
          $("#enterIndex").text(index + 1);
        },
        navCallBack: function (index) {
          $("#clickIndex").text(index + 1);
        },
      });
      $("#destroy").click(function () {
        snf.destroyed();
      });
      $("#clickToggle").click(function () {
        if (snf.getStopState.nav()) {
          snf.stopCallBack.nav(false);
        } else {
          snf.stopCallBack.nav(true);
        }
      });
      $("#enterToggle").click(function () {
        if (snf.getStopState.follow()) {
          snf.stopCallBack.follow(false);
        } else {
          snf.stopCallBack.follow();
        }
      });
      $("#init").click(function () {
        if (snf.destroyed) {
          snf.destroyed();
        }
        snf = simpleNavFollow({
          parentElement: "#main", //内容类的父元素
          nav: ".snf-nav", //导航类
          page: ".snf-page", //内容类
          leaveTop: 0, //离父元素距离
          initTo: 0, //初始跳转
          animation: 400, //动画时间
          followCallBack: function (index) {
            $("#enterIndex").text(index + 1);
          },
          navCallBack: function (index) {
            $("#clickIndex").text(index + 1);
          },
        });
      });
    },
    dozl(data) {
      this.isFrame = data;
    },
    doVR() {
      this.extraTabActive = "VR";
      this.isFrame = this.forceEntity.fix_data["全景地址"];
    },
    doGC() {
      this.extraTabActive = "GC";
      this.isFrame =
        "https://wzdjdm.wzcitybrain.com:8888/html/oneMap/projectInfo.html?project_code=" +
        this.forceEntity.fix_data["项目代码"] +
        "&id=" +
        this.forceEntity.fix_data["项目编号"];
    },
    doTZ() {
      this.extraTabActive = "TZ";
      this.isFrame =
        "http://117.149.224.15:37780/WebViewBluePrint/WebViewPDF.aspx?FuMa=" +
        this.forceEntity.fix_data["项目代码"] +
        "&FilterParams=1";
    },
    eventRegsiter() {
      this.$bus.$on("cesium-3d-around-people", ({ id, result }) => {
        this.buffer = result;
      });
      this.$bus.$on("cesium-3d-detail-pop-clear", () => {
        this.closePopup();
      });
      this.$bus.$off("cesium-3d-around-close");
      this.$bus.$on("cesium-3d-around-close", () => {
        this.showrk = false;
        this.extraTabActive = "";
      });
    },
    //选择楼栋
    ldclick(data) {
      //相机视角移动
      this.cameraMove();
      //判断59楼新精模是否加载过
      const V_ld = window.earth.scene.layers.find("蒲鞋市新村59号楼");
      if (V_ld) {
        V_ld.visible = true;
        //现将所有部件显示
        const Lj = window.earth.scene.layers.find("蒲鞋市新村59号楼");
        for (let i = 0; i < this.LCdata.length; i++) {
          Lj.setOnlyObjsVisible(this.LCdata[i], true);
        }
        Lj.setOnlyObjsVisible(this.Lb, true); //显示外立面部件
      } else {
        window.earth.scene.addS3MTilesLayerByScp(
          "http://172.20.83.223:8098/iserver/services/3D-mongodb16/rest/realspace/datas/%E8%92%B2%E9%9E%8B%E5%B8%82%E6%96%B0%E6%9D%9159%E5%8F%B7%E6%A5%BC/config",
          {
            name: "蒲鞋市新村59号楼",
          }
        );
      }
      //覆盖面高亮
      var sqls = "NAME= '蒲鞋市新村" + data + "号楼'";
      var node = {
        newdataset: "erweidata:蒲鞋市59栋",
        url:
          "http://172.20.83.223:8090/iserver/services/data-CIMERWEI/rest/data",
      };

      this.getPOIPickedFeature(node);
      this.sqlQuery(sqls);
    },
    //选择层数
    lcclick(data) {
      //相机视角移动
      window.earth.camera.flyTo({
        destination: {
          x: -2872523.3970611463,
          y: 4843511.355584916,
          z: 2995221.392416414,
        },
        orientation: {
          heading: 0.023851433491184793,
          pitch: -1.551835556648097,
          roll: 0,
        },
      });
      this.lsdata = data;
      //移除覆盖面高亮
      if (window.lastHouseEntity) {
        window.earth.entities.remove(window.lastHouseEntity);
        window.lastHouseEntity = null;
      }
      //现将所有部件显示
      const Lj = window.earth.scene.layers.find("蒲鞋市新村59号楼");
      console.log("图层时候", this.LCdata);
      for (let i = 0; i < this.LCdata.length; i++) {
        Lj.setOnlyObjsVisible(this.LCdata[i], false);
      }
      var yblc = this.LCdata[parseInt(data) - 1];
      Lj.setOnlyObjsVisible(this.Lb, false); //显示外立面部件
      Lj.brightness = 0.5; //图层亮度调节
      Lj.setOnlyObjsVisible(yblc, true); //隐藏非选中层部件
    },
    //选择户室
    lsclick(data) {
      var LC = "ROOM = '" + data + "'";
      var getFeatureParam, getFeatureBySQLService, getFeatureBySQLParams;
      getFeatureParam = new SuperMap.REST.FilterParameter({
        attributeFilter: LC,
      });
      getFeatureBySQLParams = new SuperMap.REST.GetFeaturesBySQLParameters({
        queryParameter: getFeatureParam,
        toIndex: -1,
        datasetNames: ["erweidata:蒲鞋市59栋户型"],
      });
      var url =
        "http://172.20.83.223:8090/iserver/services/data-CIMERWEI/rest/data";
      getFeatureBySQLService = new SuperMap.REST.GetFeaturesBySQLService(url, {
        eventListeners: {
          processCompleted: async (res) => {
            if (window.lastHouseEntity) {
              window.earth.entities.remove(window.lastHouseEntity);
              window.lastHouseEntity = null;
            }

            var selectedFeatures = res.originResult.features;
            addFeature(selectedFeatures[0]);
            function addFeature(feature) {
              var center = feature.geometry.center;
              var lonLatArr = getLonLatArray(feature.geometry.points);
              var bottom =
                feature.fieldValues[
                  feature.fieldNames.indexOf("BOTTOMALTITUDE")
                ];
              var HEIGHT =
                feature.fieldValues[feature.fieldNames.indexOf("HEIGHT")];
              var headheight = parseFloat(bottom) + parseFloat(HEIGHT);
              window.lastHouseEntity = window.earth.entities.add({
                id: data,
                name: "单体化标识面",
                polygon: {
                  hierarchy: Cesium.Cartesian3.fromDegreesArray(lonLatArr),
                  material: new Cesium.Color(1.0, 0.0, 0.0, 0.5),
                  height: bottom,
                  extrudedHeight: headheight,
                },
                position: Cesium.Cartesian3.fromDegrees(
                  center.x,
                  center.y,
                  headheight + 1
                ),
                label: {
                  text: data,
                  font: "32px sans-serif",
                  style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                  outlineColor: Cesium.Color.BLACK,
                  outlineWidth: 2.0,
                },
              });
            }
            function getLonLatArray(points) {
              var point3D = [];
              points.forEach(function (point) {
                point3D.push(point.x);
                point3D.push(point.y);
              });
              return point3D;
            }
          },
          processFailed: (msg) => console.log("查询失败", msg),
        },
      });
      getFeatureBySQLService.processAsync(getFeatureBySQLParams);
    },
    //选择楼栋覆盖二维面
    sqlQuery(SQL) {
      var getFeatureParam, getFeatureBySQLService, getFeatureBySQLParams;
      getFeatureParam = new SuperMap.REST.FilterParameter({
        attributeFilter: SQL,
      });
      getFeatureBySQLParams = new SuperMap.REST.GetFeaturesBySQLParameters({
        queryParameter: getFeatureParam,
        toIndex: -1,
        datasetNames: ["CIM_2D:" + "JZ_2D_buffer"], // 本例中“户型面”为数据源名称，“专题户型面2D”为楼层面相应的数据集名称
      });
      var url =
        "http://172.20.83.223:8098/iserver/services/data-CIM_2D/rest/data"; // 数据服务地址
      getFeatureBySQLService = new SuperMap.REST.GetFeaturesBySQLService(url, {
        eventListeners: {
          processCompleted: async (queryEventArgs) => {
            if (window.lastHouseEntity) {
              window.earth.entities.remove(window.lastHouseEntity);
              window.lastHouseEntity = null;
            }
            if (queryEventArgs.originResult.features.length != 0) {
              var selectedFeature = queryEventArgs.originResult.features[0]; //选中楼层的楼层面信息对象
              if (!selectedFeature.geometry.points) {
                return;
              }
              //裁剪59号楼
              var points2D = []; // [经度, 纬度, 经度, 纬度, ...]的形式，存放楼层面上的点坐标
              var TOPALTITUDE = Number(
                selectedFeature.fieldValues[
                  selectedFeature.fieldNames.indexOf("TOPALTITUDE")
                ]
              );
              for (var pt of selectedFeature.geometry.points) {
                points2D.push(pt.x, pt.y, 4.0);
              }
              const V_LAYERS = window.earth.scene.layers.find("LJxqXQ");
              V_LAYERS.addFlattenRegion({
                position: points2D,
                name: "FlattenRegion",
              });
              var bottomHeight = Number(
                selectedFeature.fieldValues[
                  selectedFeature.fieldNames.indexOf("BOTTOMALTITUDE")
                ]
              ); // 底部高程
              var extrudeHeight = Number(
                selectedFeature.fieldValues[
                  selectedFeature.fieldNames.indexOf("HEIGHT")
                ]
              ); // 层高（拉伸高度）
              Cesium.GroundPrimitive.bottomAltitude = bottomHeight; // 矢量面贴对象的底部高程
              Cesium.GroundPrimitive.extrudeHeight = extrudeHeight; // 矢量面贴对象的拉伸高度
              var points3D = []; // [经度, 纬度, 经度, 纬度, ...]的形式，存放楼层面上的点坐标
              for (var pt of selectedFeature.geometry.points) {
                points3D.push(pt.x, pt.y);
              }
              if (
                window.ispartsclick &&
                queryEventArgs.result.features[0].data.NAME.indexOf(
                  "市民中心"
                ) > -1
              ) {
              } else {
                if (
                  queryEventArgs.result.features[0].data.NAME.indexOf(
                    "市民中心"
                  ) > -1
                ) {
                  for (
                    let i = 0;
                    i < window.earth.scene.layers.layerQueue.length;
                    i++
                  ) {
                    if (
                      window.earth.scene.layers.layerQueue[i].name.indexOf(
                        "ivilization_center"
                      ) > -1 ||
                      window.earth.scene.layers.layerQueue[i].name.indexOf(
                        "chao"
                      ) > -1
                    ) {
                      window.earth.scene.layers.layerQueue[
                        i
                      ].orderIndependentTranslucency = false;
                    }
                  }
                } else {
                  for (
                    let i = 0;
                    i < window.earth.scene.layers.layerQueue.length;
                    i++
                  ) {
                    if (
                      window.earth.scene.layers.layerQueue[i].name.indexOf(
                        "ivilization_center"
                      ) > -1 ||
                      window.earth.scene.layers.layerQueue[i].name.indexOf(
                        "chao"
                      ) > -1
                    ) {
                      window.earth.scene.layers.layerQueue[
                        i
                      ].orderIndependentTranslucency = true;
                    }
                  }
                }

                window.lastHouseEntity = window.earth.entities.add({
                  polygon: {
                    hierarchy: Cesium.Cartesian3.fromDegreesArray(points3D),
                    material: getColorRamp([0.0, 0.8], true),
                  },
                  classificationType: Cesium.ClassificationType.S3M_TILE, // 贴在S3M模型表面
                });
                var a = window.earth.entities.getById(
                  selectedFeature.fieldValues["22"]
                );
                window.earth.entities.remove(a);
                window.earth.entities.add({
                  position: Cesium.Cartesian3.fromDegrees(
                    parseFloat(selectedFeature.fieldValues["32"]),
                    parseFloat(selectedFeature.fieldValues["33"]),
                    parseFloat(selectedFeature.fieldValues["30"]) + 3
                  ),
                  billboard: {
                    image: "/static/images/common/选中楼标.png",
                    width: 90,
                    height: 60,
                  },
                  label: {
                    text: selectedFeature.fieldValues["28"],
                    font: "40px PingFang SC bold;",
                    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                    outlineColor: Cesium.Color.White,
                    outlineWidth: 3,
                    pixelOffset: new Cesium.Cartesian2(0, -5),
                  },
                  id: selectedFeature.fieldValues["22"],
                  name: selectedFeature.fieldValues["22"],
                });
                this.isld = true;
                this.isLJ = false;
              }

              function getColorRamp(elevationRamp) {
                var ramp = document.createElement("canvas");
                ramp.width = 1;
                ramp.height = 100;
                var ctx = ramp.getContext("2d");
                var values = elevationRamp;
                var grd = ctx.createLinearGradient(0, 0, 100, 50);
                grd.addColorStop(values[0], "#E84929");
                grd.addColorStop(values[1], "#FFFF08");
                ctx.fillStyle = grd;
                ctx.fillRect(0, 0, 1, 100);
                return ramp;
              }
              let url =
                "http://172.20.83.223:8098/iserver/services/data-CIM_2D/rest/data";
              let newdataset = "CIM_2D:JZ_2D_buffer";
              const fields = await getIserverFields(url, newdataset);
              const fieldHash = {};
              fields.map(({ name, caption }) => {
                const reg = new RegExp("[\\u4E00-\\u9FFF]+", "g");
                reg.test(caption)
                  ? (fieldHash[name.toLowerCase()] = caption)
                  : undefined;
              });
              let tempObj = queryEventArgs.result.features[0].attributes;
              const fixAttributes = {};
              for (let v in tempObj) {
                const V = v.toLowerCase();
                fieldHash[V]
                  ? (fixAttributes[fieldHash[V]] = tempObj[v])
                  : undefined;
              }
              let detailData = Object.keys(fixAttributes).map((k) => {
                return { k, v: fixAttributes[k] };
              });
              console.log("deatdata", detailData);
              //this.SetForceBimData(detailData);
            }
          }, // 查询成功时的回调函数
          processFailed: (msg) => console.log("查询失败分层分户", msg), // 查询失败时的回调函数
        },
      });
      getFeatureBySQLService.processAsync(getFeatureBySQLParams);
    },
    //查询老旧小区选中楼参数
    getPOIPickedFeature(node, fn) {
      const { newdataset, url } = node;
      var getFeatureParam, getFeatureBySQLService, getFeatureBySQLParams;
      getFeatureParam = new SuperMap.REST.FilterParameter({
        attributeFilter: `SMID >= 0`,
      });
      getFeatureBySQLParams = new SuperMap.REST.GetFeaturesBySQLParameters({
        queryParameter: getFeatureParam,
        toIndex: -1,
        datasetNames: [newdataset],
      });
      getFeatureBySQLService = new SuperMap.REST.GetFeaturesBySQLService(url, {
        eventListeners: {
          processCompleted: async (res) => {
            for (let i = 1; i < 5; i++) {
              var floors = i + "F";
              var LCdatas = [];
              this.Lb = [];
              for (let j = 0; j < res.result.features.length; j++) {
                console.log("获取图层", res.result.features[j].data.FLOOR);
                if (res.result.features[j].data.FLOOR == floors) {
                  LCdatas.push(parseInt(res.result.features[j].data.SMID));
                }
                if (res.result.features[j].data.LAYERNAME == "房顶") {
                  this.Lb.push(parseInt(res.result.features[j].data.SMID));
                }
                if (j + 1 == res.result.features.length) {
                  this.LCdata.push(LCdatas);
                }
              }
            }
          },
          processFailed: (msg) => console.log(msg),
        },
      });
      getFeatureBySQLService.processAsync(getFeatureBySQLParams);
    },
    //压平精模
    addFlattenRegions() {
      var SQL = "SMID>0";
      var getFeatureParam, getFeatureBySQLService, getFeatureBySQLParams;
      getFeatureParam = new SuperMap.REST.FilterParameter({
        attributeFilter: SQL,
      });
      getFeatureBySQLParams = new SuperMap.REST.GetFeaturesBySQLParameters({
        queryParameter: getFeatureParam,
        toIndex: -1,
        datasetNames: ["erweidata:蒲鞋市倾斜范围面"],
      });
      var url =
        "http://172.20.83.223:8090/iserver/services/data-CIMERWEI/rest/data"; // 数据服务地址
      getFeatureBySQLService = new SuperMap.REST.GetFeaturesBySQLService(url, {
        eventListeners: {
          processCompleted: async (queryEventArgs) => {
            if (window.lastHouseEntity) {
              window.earth.entities.remove(window.lastHouseEntity);
              window.lastHouseEntity = null;
            }
            if (queryEventArgs.originResult.features.length != 0) {
              var selectedFeature = queryEventArgs.originResult.features[0]; //选中楼层的楼层面信息对象
              if (!selectedFeature.geometry.points) {
                return;
              }
              //压平
              var points2D = []; // [经度, 纬度, 经度, 纬度, ...]的形式，存放楼层面上的点坐标
              var TOPALTITUDE = Number(
                selectedFeature.fieldValues[
                  selectedFeature.fieldNames.indexOf("TOPALTITUDE")
                ]
              );
              for (var pt of selectedFeature.geometry.points) {
                points2D.push(pt.x, pt.y, 4.0);
              }
              const V_LAYERS = window.earth.scene.layers.find("Ljxq");
              V_LAYERS.addFlattenRegion({
                position: points2D,
                name: "LjxqJMYP",
              });
            }
          }, // 查询成功时的回调函数
          processFailed: (msg) => console.log("查询失败", msg), // 查询失败时的回调函数
        },
      });
      getFeatureBySQLService.processAsync(getFeatureBySQLParams);
    },
    //返回键
    fh() {
      this.isld = false; //关闭楼栋信息
      this.isLJ = true; //开启小区信息
      const LJxqXQ = window.earth.scene.layers.find("LJxqXQ");
      if (LJxqXQ) {
        LJxqXQ.removeAllFlattenRegion();
      }
      //关闭覆盖面
      if (window.lastHouseEntity) {
        window.earth.entities.remove(window.lastHouseEntity);
        window.lastHouseEntity = null;
      }
      var a = window.earth.entities.getById("蒲鞋市新村59号楼");
      window.earth.entities.remove(a);
      window.earth.entities.add({
        position: Cesium.Cartesian3.fromDegrees(
          parseFloat(120.67072463337485),
          parseFloat(28.008283756760193),
          parseFloat(16.414042574353516) + 3
        ),
        billboard: {
          image: "/static/images/common/楼标.png",
          width: 90,
          height: 60,
        },
        label: {
          text: "59号楼",
          font: "40px PingFang SC bold;",
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          outlineColor: Cesium.Color.White,
          outlineWidth: 3,
          pixelOffset: new Cesium.Cartesian2(0, -5),
        },
        id: "蒲鞋市新村59号楼",
        name: "蒲鞋市新村59号楼",
      });
      //关闭59号楼精模
      const V_ld = window.earth.scene.layers.find("蒲鞋市新村59号楼");
      V_ld.visible = false;
      //打开原59号楼精模
      // const V_LAYER = window.earth.scene.layers.find("Ljxq");
      //V_LAYER.setOnlyObjsVisible([348], true);
    },
    //相机移动
    cameraMove() {
      window.earth.camera.flyTo({
        destination: {
          x: -2872556.8010957814,
          y: 4843598.135541798,
          z: 2995082.209321462,
        },
        orientation: {
          heading: 0.08452214613176423,
          pitch: -0.6963175946906643,
          roll: 0,
        },
      });
    },
    getForceFace(data) {
      this.showface = true;
      this.facedata = data;
    },
    /**
     *  详情点赋值
     *  @param {object} forceEntity 详情点信息
     */
    getForceEntity(forceEntity) {
      console.log("forceEntity", forceEntity);
      this.forceEntity = forceEntity;
      if (
        !forceEntity._NODEID_.includes("事件") &&
        !forceEntity._NODEID_.includes("老旧小区")
      ) {
        console.log("点1");
        this.showSide = true;
        this.showface = false;
        this.fixedForceBimData.length = 0;
        this.buffer = null;
        this.$bus.$emit("cesium-3d-population-circle", { doDraw: false });
        this.$bus.$emit("cesium-3d-rtmpFetch-cb");
      } else if (forceEntity._NODEID_.includes("老旧小区")) {
        this.isLJ = true;
        this.showSide = false;
        this.showface = false;
        var points = null;
        this.addFlattenRegions();
        if (window.Buildinglogo.length > 0) {
          for (var i = 0; i < window.Buildinglogo.length; i++) {
            var a = window.earth.entities.getById(
              window.Buildinglogo[i].fieldValues["22"]
            );
            window.earth.entities.remove(a);
          }
        } else {
          maplabel(
            this.forceEntity.name,
            "http://172.20.83.223:8098/iserver/services/data-CIM_2D/rest/data/featureResults.rjson?returnContent=true",
            "CIM_2D:JZ_2D_buffer",
            "老旧小区"
          );
        }
        /*         for (let i = 0; i < window.fwm.length; i++) {
          if (window.fwm[i].name == this.forceEntity.name) {
            points = window.fwm[i].points;
          }
        }
        var queryObj = {
          getFeatureMode: "SPATIAL",
          spatialQueryMode: "CONTAIN",
          datasetNames: ["CIM_2D:JZ_2D_buffer"],
          geometry: {
            points: points,
            type: "REGION"
          }
        };
        var queryData = JSON.stringify(queryObj); // 转化为JSON字符串作为查询参数
        $.ajax({
          type: "post",
          url:
            "http://172.20.83.223:8098/iserver/services/data-CIM_2D/rest/data/featureResults.rjson?returnContent=true",
          data: queryData,
          success: function(result) {
            var resultObj = JSON.parse(result);

            if (resultObj.featureCount > 0) {
              window.Buildinglogo = resultObj.features;
              processCompleted(resultObj.features);
            }
          },
          error: function(msg) {
            console.log(msg);
          }
        });
        function processCompleted(features) {
          var selectedFeatures = features;
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
        } */
      } else {
        this.showSide = false;
        this.showface = false;
      }
    },

    /**
     *  框体移动
     *  @param {object} position
     */
    renderForceEntity() {
      const forceEntity = this.forceEntity;
      if (forceEntity.fix_data) {
        const pointToWindow = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
          window.earth.scene,
          forceEntity.position
        );
        if (
          this.forcePosition.x !== pointToWindow.x ||
          this.forcePosition.y !== pointToWindow.y
        ) {
          this.forcePosition = {
            x:
              pointToWindow.x -
              (($(".leaflet-popup-content-wrapper").width() || 0) * 1.2) / 2,
            y:
              pointToWindow.y -
              ($(".leaflet-popup-content-wrapper").height() || 0) -
              90,
          };
        }
      }
    },
    /**
     * 人口缓冲区（直接pop组件里画）
     * 开专门的缓冲区collection
     */
    doCircleBuffer() {
      this.extraTabActive = "rkdt";

      this.buffer = this.buffer ? null : {};
      const { name, geometry } = this.forceEntity;
      this.$bus.$emit("cesium-3d-population-circle", {
        doDraw: this.buffer,
        id: name,
        geometry: {
          lng: geometry.x,
          lat: geometry.y,
        },
      });
    },
    /**
     * 仅传参数给RtmpVideo组件,不参与后续功能
     * @param {object} param0 该医疗点的对象信息
     */
    doVideoRtmp() {
      this.extraTabActive = "sp";
      const { geometry, name } = this.forceEntity;
      const { x, y } = geometry;
      this.$bus.$emit("cesium-3d-rtmpFetch", {
        shortname: name,
        geometry: { lng: x, lat: y },
      });
    },
    /**
     * 周边分析跳转
     */
    doAroundSourceAnalyse() {
      this.extraTabActive = "fx";
      this.showrk = true;
      // this.showSide = false
      const { geometry } = this.forceEntity;
      let type = this.forceEntity._NODEID_.includes("事件")
        ? "event"
        : "source";
      this.$bus.$emit("cesium-3d-around-analyse-pick", { geometry, type });
    },
    closePopup() {
      var fwm = window.earth.entities.values;
      for (let i = 0; i < fwm.length; i++) {
        if (fwm[i].id == "高亮") {
          window.earth.entities.remove(fwm[i]);
        }
      }
      this.extraTabActive = "";
      this.showSide = false;
      this.showrk = false;
      this.showface = false;
      this.fixedForceBimData.length = 0;
      const LJxqXQ = window.earth.scene.layers.find("LJxqXQ");
      if (LJxqXQ) {
        LJxqXQ.removeAllFlattenRegion();
      }

      if (window.Buildinglogo.length > 0) {
        for (var i = 0; i < window.Buildinglogo.length; i++) {
          var a = window.earth.entities.getById(
            window.Buildinglogo[i].fieldValues["22"]
          );
          window.earth.entities.remove(a);
        }
      }
      if (window.lastHouseEntity) {
        window.earth.entities.remove(window.lastHouseEntity);
        window.lastHouseEntity = null;
      }
      this.showSide = false;
      this.isLJ = false;
      this.isld = false;
      this.forcePosition = {};
      this.forceEntity = {};
      this.buffer = null;
      this.$bus.$emit("cesium-3d-population-circle", { doDraw: false });
      this.$bus.$emit("cesium-3d-rtmpFetch-cb");
      //判断59楼新精模是否加载过
      const V_ld = window.earth.scene.layers.find("蒲鞋市新村59号楼");
      if (V_ld) {
        V_ld.visible = false;
        //现将所有部件显示
        const Lj = window.earth.scene.layers.find("蒲鞋市新村59号楼");
        for (let i = 0; i < this.LCdata.length; i++) {
          Lj.setOnlyObjsVisible(this.LCdata[i], false);
        }
      }

      // this.$parent.$refs.aroundSourceAnalyse.closeAroundSourceAnalyse()
    },
    toggleLight() {
      this.$bus.$emit("cesium-3d-toggleLight", {
        on: true,
        data: this.forceBimData,
      });
    },
  },
  watch: {
    isLJ(val) {
      if (val) {
        setTimeout(() => {
          this.bindHandler();
        }, 200);
      }
    },
    forceBimData(n, o) {
      n && (this.activeTab = "bim");
    },
  },
};
</script>

<style lang="less" scoped>
@import url("./aroundPeople.less");

.table1 {
  width: 23%;
  text-align: center;
  vertical-align: middle;
  line-height: 0.2rem;
  background-image: url(/static/images/mode-ico/tb.png);
  background-size: 100% 100%;
  font-size: 1.6vh;
  font-family: PingFang SC;
  font-weight: bold;
  line-height: 20px;
  color: #ffffff;
  opacity: 1;
}
.table2 {
  width: 42%;
  text-align: center;
  vertical-align: middle;
  line-height: 0.2rem;
  font-size: 1.6vh;
  font-family: PingFang SC;
  font-weight: 400;
  background-color: #05583f4a;
  color: #ffffff;
  opacity: 1;
}
.table3 {
  width: 21%;
  text-align: center;
  vertical-align: middle;
  line-height: 0.2rem;
  font-size: 1.6vh;
  font-family: PingFang SC;
  font-weight: 400;
  color: #ffffff;
  background-color: #05583f4a;
  opacity: 1;
}
.table4 {
  // width: 16vw;
  text-align: center;
  vertical-align: middle;
  line-height: 0.2rem;
  font-size: 14px;
  font-family: PingFang SC;
  font-weight: 400;
  color: #ffffff;
  background-color: #05583f4a;
  opacity: 1;
}
table.hovertable {
  font-family: verdana, arial, sans-serif;
  font-size: 11px;
  color: #333333;
  background-size: 100% 100%;
  background-image: url(/static/images/mode-ico/bg@2x.png);
  width: 100%;
}
table.hovertable th {
  // border-width: 1px;
  // padding: 8px;
  // border-style: solid;
  // border-color: #a9c6c9;
}
table.hovertable tr {
  border-width: 1px;
  padding: 8px;
  border-style: solid;
  border-color: #1bffe4;
  height: 4vh;
}
table.hovertable td {
  border-width: 1px;
  padding: 8px;
  border-style: solid;
  border-color: #1bffe4;
}

.btn-group {
  display: flex;
  flex-wrap: wrap;
  .btn-item {
    width: 15%;
    margin: 5px 10px;
  }
}

.ljxqlabel {
  background-image: url(/static/images/mode-ico/大框@2x.png);
  background-size: 100% 100%;
  height: 67vh;
  position: fixed;
  z-index: 1;
  right: 10px;
  top: 10vh;
  width: 54vh;
}
.ljxqlabels {
  height: 67vh;
  position: fixed;
  z-index: 1;
  right: 10px;
  top: 10vh;
  // width: 25vw;
  width: 50vh;
}
.closes {
  width: 4vh;
  height: 4vh;
  background: url(/static/images/mode-ico/叉2.png) no-repeat center;
  background-size: 100% 100%;
  z-index: 99;
  top: 10.5vh;
  // right: 2vw;
  right: 4vh;
  z-index: 100;
  position: fixed;
}
.fhj {
  // width: 2vw;
  width: 4vh;
  height: 4vh;
  background: url(/static/images/mode-ico/返回键.png) no-repeat center;
  background-size: 100% 100%;
  z-index: 99;
  top: 10.5vh;
  // right: 4vw;
  right: 8vh;
  z-index: 100;
  position: fixed;
}
ul li {
  list-style: none;
}

#main {
  height: 58vh;
  overflow: auto;
  margin-top: 3vh;
  // margin-left: 1vw;
  margin-left: 2vh;
  position: relative;
  // margin-right: 1vw;
  margin-right: 2vh;
}
#mains {
  height: 58vh;
  overflow: auto;
  margin-top: 4vh;
  // margin-left: 1vw;
  margin-left: 2vh;
  position: relative;
  // margin-right: 1vw;
  margin-right: 2vh;
}
.snf-page {
  height: auto;
  margin-bottom: 1vh;
  // margin-right: 0.5vw;
  margin-right: 1vh;
}
.snf-pages {
  height: auto;
  margin-bottom: 1vh;
  // margin-right: 0.5vw;
  margin-right: 1vh;
}
.snf-page:nth-child(2n) {
  //background: #e1e1e1;
}

#nav {
  top: 24vh;
  right: 55vh;
  margin-top: -140px;
  display: inline-block;
  vertical-align: middle;
  z-index: 1;
  position: fixed;
}
.snf-nav {
  height: 14vh;
  margin: 2vh 0;
  // width: 6vh;
  width: 4vh;
  text-align: center;
  vertical-align: middle;
  .bg-image("/static/images/mode-ico/选择框@2x");
}

#nav div.active {
  // height: 14vh;
  // margin: 2vh 0;
  // width: 6vh;
  text-align: center;
  vertical-align: middle;
  .bg-image("/static/images/mode-ico/已选择框@2x");
}
.lqwz {
  font-size: 1.7vh;
  font-family: YouSheBiaoTiHei;
  color: #ffffff;
  -webkit-writing-mode: vertical-r;
  writing-mode: vertical-rl;

  margin-top: 0.5vh;
}
ul li {
  list-style: none;
}
.titles {
  font-family: YouSheBiaoTiHei;
  color: #fff;
  font-size: 2vh;
}
.decorates {
  margin: 4px 0;
  width: 100%;
  height: 0.3vh;
  .bg-image("/static/images/mode-ico/装饰_1");
}
.titless {
  font-family: YouSheBiaoTiHei;
  color: #fff;
  font-size: 1.7vh;
  // margin-left: 0.5vw;
  margin-left: 1vh;
  margin-top: 1vh;
}
.decoratess {
  // margin: -0.7vh 0.3vw 0.5vh 0vw;
  margin: -0.7vh 0.6vh 0.5vh 0vh;
  width: 35%;
  height: 1vh;
  .bg-image("/static/images/mode-ico/路径");
}

#forcePopUp {
  .leaflet-popup {
    top: -8vh;
    left: 0;
    position: absolute;
    background-image: url(/static/images/common/框.png);
    background-size: 100% 100%;
  }

  .leaflet-popup-close-button {
    position: absolute;
    top: 0.5vh;
    // right: 1vw;
    right: 2vh;
    text-align: center;
    // width: 1vw;
    width: 2vh;
    height: 2vh;
    font: 2.2vh/2vh Tahoma, Verdana, sans-serif;
    color: #fff;
    text-decoration: none;
    font-weight: bold;
    background: transparent;
    cursor: pointer;
  }

  .leaflet-popup-content-wrapper {
    //text-align: center;
    //height: 19vh;
    width: 30vh;
    //box-sizing: border-box;
    //padding: 3vh;
    padding-bottom: 4vh;
    // padding-left: 1vw;
    padding-left: 2vh;
    > .toubu {
      height: 4vh;
      line-height: 5vh;
      box-sizing: border-box;
      // padding-right: 1vw;
      padding-right: 2vh;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      // font-size: 22px;
      font-size: 1.8vh;
      font-family: YouSheBiaoTiHei;
      font-weight: 400;
      //line-height: 29px;
      color: #ffffff;
      opacity: 1;
    }
    > .zhongbu {
      //height: 70%;
      > .liebiao {
        // font-size: 14px;
        font-size: 1.6vh;
        font-family: PingFang SC;
        font-weight: bold;
        line-height: 20px;
        color: #67c9fb;
        display: inline-block;
        opacity: 1;
        // float: left;
        margin-right: 1vh;
      }
    }
  }
  .extra-tab {
    width: 50px;
    height: 50px;
    font-size: 1.6vh;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    // padding: 1vh 0.5vw;
    padding: 1vh 1vh;
    color: white;
    display: inline-block;
    cursor: pointer;
    float: left;
    margin: 1vh 0;
    background-size: 100% 100%;
  }
  .extra-tab_SP {
    background-size: 100% 100%;
    background-image: url("/static/images/mode-ico/现场直达.png");
    &.active {
      background-size: 100% 100%;
      background-image: url("/static/images/mode-ico/现场直达选中.png");
    }
  }
  .extra-tab_FX {
    background-image: url("/static/images/mode-ico/周边分析.png");
    &.active {
      background-size: 100% 100%;
      background-image: url("/static/images/mode-ico/周边分析选中.png");
    }
  }
  .extra-tab_RKDT {
    background-image: url("/static/images/mode-ico/人口动态.png");
    &.active {
      background-size: 100% 100%;
      background-image: url("/static/images/mode-ico/人口动态选中.png");
    }
  }
  .extra-tab_VR {
    background-image: url("/static/images/mode-ico/VR全景.png");
    &.active {
      background-size: 100% 100%;
      background-image: url("/static/images/mode-ico/VR全景选中.png");
    }
  }
  .extra-tab_GC {
    background-image: url("/static/images/mode-ico/工程全过程.png");
    &.active {
      background-size: 100% 100%;
      background-image: url("/static/images/mode-ico/工程全过程选中.png");
    }
  }
  .extra-tab_TZ {
    background-image: url("/static/images/mode-ico/图档资料.png");
    &.active {
      background-size: 100% 100%;
      background-image: url("/static/images/mode-ico/图档资料选中.png");
    }
  }
  .overview {
    position: absolute;
    right: 10px;
    bottom: 10px;
    color: #fff;
    font-size: 12px;
    cursor: pointer;
  }
  // .extra-tab {
  //   width: 6vh;
  //   font-size: 1.6vh;
  //   /* position: absolute; */
  //   /* right: -1.4vh; */
  //   /* line-height: 1.8vh; */
  //   -webkit-box-sizing: border-box;
  //   box-sizing: border-box;
  //   padding: 1vh 1vh;
  //   color: white;
  //   display: inline-block;
  //   cursor: pointer;
  //   float: left;
  // }

  .to-rtmp-video {
    //top: 4vh;
    background-image: linear-gradient(
      to right,
      #4c97e3 0%,
      rgba(23, 83, 145, 0.75) 50%,
      rgba(5, 45, 88, 0.29) 100%
    );
  }

  .to-around-people {
    background-image: linear-gradient(
      to right,
      #cc2626 0%,
      rgba(202, 43, 43, 0.75) 50%,
      rgba(5, 45, 88, 0.29) 100%
    );
    bottom: 5vh;
  }

  .leaflet-popup-content {
    color: #fff;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    height: 80%;

    > .content-body {
      flex: 1;
      overflow-y: auto;
      > li {
        font-size: 1.4vh;
        height: 2.4vh;
        line-height: 2.4vh;
        font-weight: 300;
        float: left;
        width: 100%;
        // border-bottom: 1px rgba(255,255,255,0.6) solid;
        > span {
          display: inline-block;
          vertical-align: top;
          height: 100%;
          float: left;
          flex: 1;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          width: 13vh;
        }
        > span:first-child {
          width: 9vh;
        }
      }
    }
  }

  .side-info {
    position: fixed;
    // right: 10px;
    right: 1vh;
    top: 10vh;
    width: 34vh;
    z-index: 99;
    color: #fff;
    .info-header {
      .title {
        font-family: YouSheBiaoTiHei;
        color: #fff;
        font-size: 2vh;
      }
      .decorate {
        margin: 4px 0;
        width: 100%;
        height: 0.4vh;
        .bg-image("/static/images/mode-ico/装饰_1");
      }
      .close {
        width: 4vh;
        height: 4vh;
        position: absolute;
        top: -1vh;
        right: 2vh;
        .bg-image("/static/images/mode-ico/叉2");
        cursor: pointer;
      }
      .parts {
        // width: 2.5vw;
        width: 5vh;
        height: 4.5vh;
        position: absolute;
        top: -1.5vh;
        // right: 10vw;
        right: 20vh;
        background: url(/static/images/mode-ico/选取按钮.png) no-repeat center;
        background-size: 100% 100%;
        cursor: pointer;
        &.active {
          // width: 2.5vw;
          // height: 4.5vh;
          // position: absolute;
          // top: -1.5vh;
          // right: 10vw;
          background: url(/static/images/mode-ico/选中按钮.png) no-repeat center;
          background-size: 100% 100%;
          // cursor: pointer;
        }
      }
      .tab-list {
        padding-right: 2vh;
        display: flex;
        align-items: center;
        justify-content: center;
        .tab-item {
          // flex: 1;
          width: 30%;
          margin-right: 1vh;
          padding: 5px 0 10px 0;
          .bg-image("/static/images/mode-ico/side-tab");
          font-family: YouSheBiaoTiHei;
          font-size: 2vh;
          text-align: center;
          &:last-child {
            margin: 0;
          }
          &.active {
            .bg-image("/static/images/mode-ico/side-tab-sel");
            color: #ffff08;
          }
        }
      }
    }
    .info-content {
      margin-top: 1vh;
      margin-bottom: 1vh;
      width: 100%;
      max-height: 30vh;
      overflow-y: auto;
      .bg-image("/static/images/mode-ico/side-bg");
      .info-item {
        display: flex;
        align-items: center;
        text-align: center;
        padding: 1vh 0;
        .key {
          flex: 2;
          padding: 0 5px;
          overflow: hidden;
          white-space: nowrap;
          font-size: 1.6vh;
          text-overflow: ellipsis;
          border-right: 2px solid #fff;
        }
        .keys {
          flex: 2;
          padding: 0 5px;
          overflow: hidden;
          white-space: nowrap;
          font-size: 1.6vh;
          text-overflow: ellipsis;
        }
        .value {
          flex: 4;
          padding: 0 5px;
          font-size: 1.4vh;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        &:nth-child(even) {
          background-color: rgba(42, 203, 264, 0.15);
        }
      }
    }
  }
  .extra-frame {
    z-index: 999999;
    width: 1100px;
    height: 800px;
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    iframe {
      height: 100%;
      width: 100%;
    }
    > span {
      display: block;
      height: 20px;
      width: 20px;
      cursor: pointer;
      background: black;
      color: #fff;
      font-weight: bold;
      position: absolute;
      top: 10px;
      right: 30px;
      line-height: 20px;
      border-radius: 10px;
      text-align: center;
    }
  }
}
</style>
