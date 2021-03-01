<template>
  <div>
    <div>
      <clean_data />
    </div>
    <div class="components-container">
      <el-button type="primary" icon="skill" @click="changeLength">查看无对应关系项</el-button>
      <el-button type="info" icon="skill" @click="offChangeLength">关闭列表</el-button>
      <el-divider v-if="this.Length !== 0" />
      <div v-if="this.Length !== 0" id="systemProduct" class="filter-container">
        <systemProduct />
      </div>
      <el-divider v-if="this.Length !== 0" />
      <div v-if="this.Length !== 0" id="dspatchLevel" class="filter-container">
        <dspatchLevel />
      </div>
      <el-divider v-if="this.Length !== 0" />
      <div v-if="this.Length !== 0" id="eventType" class="filter-container">
        <eventType />
      </div>
      <el-divider v-if="this.Length !== 0" />
      <div v-if="this.Length !== 0" id="reportSource" class="filter-container">
        <reportSource />
      </div>
      <el-divider v-if="this.Length !== 0" />
      <div v-if="this.Length !== 0" id="sla" class="filter-container">
        <sla />
      </div>
    </div>
    <!-- 置顶按钮-->
    <el-tooltip placement="top" content="tooltip">
      <back-to-top :custom-style="myBackToTopStyle" :visibility-height="300" :back-position="50" transition-name="fade" />
    </el-tooltip>
  </div>
</template>

<script>
import clean_data from './components/clean_data'
import systemProduct from './components/systemProduct'
import BackToTop from '@/components/BackToTop/index'
import dspatchLevel from './components/dspatchLevel'
import eventType from './components/eventType'
import reportSource from './components/reportSource'
import sla from './components/sla'

export default {

  name: 'CleanData',
  components: {
    clean_data,
    systemProduct,
    dspatchLevel,
    eventType,
    reportSource,
    sla,
    BackToTop
  },
  data() {
    return {
      Length: 0,
      myBackToTopStyle: {
        right: '60px',
        bottom: '60px',
        width: '45px',
        height: '45px',
        'border-radius': '4px',
        'line-height': '50px', // 请保持与高度一致以垂直居中 Please keep consistent with height to center vertically
        background: '#d2d0d0'// 按钮的背景颜色 The background color of the button
      }

    }
  },
  methods: {
    changeLength() {
      this.Length = 1
    },
    offChangeLength() {
      this.Length = 0
    }
  }
}
</script>

<style scoped>
  .filter-container {
    margin-top: 20px;
  }
</style>
