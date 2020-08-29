<template>
  <div class="tab-container">
    <el-tabs type="border-card">
      <el-tab-pane label="产品线关系t_system_product">
        <t_system_product />
      </el-tab-pane>
      <el-tab-pane label="测试">
        <test />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import t_system_product from './components/t_system_product'
import test from './components/test'

export default {
  name: 'CleanRelation',
  components: {
    t_system_product,
    test
  }
}
</script>

<style scoped>
  .tab-container {
    margin: 30px;
  }
</style>
