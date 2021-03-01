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
      // array:[],
      name: [],
      value: []
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
          text: '各产品线超时情况',
          left: 'center'
        },
        xAxis: {
          type: 'category',
          data: this.name
        },
        yAxis: {
          type: 'value',
          min: 0,
          max: 100,
          axisLabel: {
            formatter: '{value} %'
          }
        },
        legend: {
          orient: 'vertical',
          right: 10,
          top: 'center',
          data: ['未超时']
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: ({c}%) '
        },
        toolbox: {
          show: true,
          feature: {
            dataView: { readOnly: false },
            restore: {},
            saveAsImage: {}
          }
        },
        series: [{
          name: '未超时',
          data: this.value,
          type: 'bar',
          showBackground: true,
          label: {
            show: true,
            position: 'inside',
            formatter: '{c}% '
          },
          barWidth: 40
        }]
      })
    },
    test() {
      const _this = this
      _this.name = []
      _this.value = []
      fetch.get({ url: '/get/getEveSla' }, res => {
        console.log(res)
        res.data.forEach(function(val) {
          const item = {}
          item.value = val.num / 10
          item.name = val.name
          // _this.array.push(item)
          _this.name.push(item.name)
          _this.value.push(item.value)
        })
        _this.initChart()
      })
    }
  }
}
</script>
