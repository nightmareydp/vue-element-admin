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
      <el-tab-pane label="测试">
        <test />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import t_system_product from './components/t_system_product'
import t_event_type from './components/t_event_type'
import t_dspatch_level from './components/t_dspatch_level'
import test from './components/test'

export default {
  name: 'CleanRelation',
  components: {
    t_system_product,
    t_event_type,
    t_dspatch_level,
    test
  }
}
</script>

<style scoped>
  .tab-container {
    margin: 30px;
  }
</style>
