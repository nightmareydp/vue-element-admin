<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'
import { fetch } from '../../../../../fetch'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    }
  },

  data() {
    return {
      res: [],
      nameList: [],
      askList: [],
      problemList: [],
      sosoList: []
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.test()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.chart.setOption({
        title: {
          text: '企业效率-TOP3事件类型',
          left: 'center'
        },
        legend: {
          orient: 'horizontal',
          right: 'center',
          top: 25,
          data: ['日常运维', '系统问题', '咨询、建议']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        yAxis: {
          type: 'value'
        },
        xAxis: {
          type: 'category',
          data: this.nameList
        },
        series: [
          {
            name: '日常运维',
            type: 'bar',
            stack: 'total',
            label: {
              show: true
            },
            emphasis: {
              focus: 'series'
            },
            data: this.sosoList
          },
          {
            name: '系统问题',
            type: 'bar',
            stack: 'total',
            label: {
              show: true
            },
            emphasis: {
              focus: 'series'
            },
            data: this.problemList
          },
          {
            name: '咨询、建议',
            type: 'bar',
            stack: 'total',
            label: {
              show: true
            },
            emphasis: {
              focus: 'series'
            },
            data: this.askList
          }
        ],
        barWidth: 40
      })
    },
    test() {
      const _this = this
      _this.nameList = []
      _this.askList = []
      _this.problemList = []
      _this.sosoList = []
      fetch.get({ url: '/get/getProductEventType?productLine=企业效率' }, res => {
        _this.nameList = res.data.nameList
        _this.askList = res.data.askList
        _this.problemList = res.data.problemList
        _this.sosoList = res.data.sosoList
        _this.initChart()
      })
    }
  }
}
</script>
