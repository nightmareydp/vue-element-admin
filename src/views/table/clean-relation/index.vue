<template>
  <div class="tab-container">
    <el-tabs type="border-card">
      <el-tab-pane label="产品线关系t_system_product">
        <t_system_product />
      </el-tab-pane>
      <el-tab-pane label="事件分类关系t_event_type">
        <t_event_type />
      </el-tab-pane>
      <el-tab-pane label="分派级别关系t_dspatch_level">
        <t_dspatch_level />
      </el-tab-pane>
      <el-tab-pane label="SLA关系t_sla">
        <t_sla />
      </el-tab-pane>
      <el-tab-pane label="报告来源关系t_report_source">
        <t_report_source />
      </el-tab-pane>
      <el-tab-pane label="日历t_day">
        <t_day />
      </el-tab-pane>
      <el-tab-pane label="测试">
        <test />
      </el-tab-pane>
    </el-tabs>
    <!-- 置顶按钮-->
    <el-tooltip placement="top" content="tooltip">
      <back-to-top :custom-style="myBackToTopStyle" :visibility-height="300" :back-position="50" transition-name="fade" />
    </el-tooltip>
  </div>
</template>

<script>
import t_system_product from './components/t_system_product'
import t_event_type from './components/t_event_type'
import t_dspatch_level from './components/t_dspatch_level'
import t_sla from './components/t_sla'
import t_report_source from './components/t_report_source'
import t_day from './components/t_day'
import test from './components/test'
import BackToTop from '@/components/BackToTop/index'

export default {
  name: 'CleanRelation',
  components: {
    t_system_product,
    t_event_type,
    t_dspatch_level,
    t_sla,
    t_report_source,
    t_day,
    test,
    BackToTop
  },
  data() {
    return {
      // customizable button style, show/hide critical point, return position
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
  }
}
</script>

<style scoped>
  .tab-container {
    margin: 30px;
  }
  .placeholder-container div {
    margin: 10px;
  }
</style>
