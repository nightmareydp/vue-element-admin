<template>
  <div class="components-container" style="margin-top: 30px">
    <el-row>
      <!-- 全量洗数 -->
      <el-button type="warning" icon="el-icon-s-open" @click="cleanAllData" :loading='loadingStatusAllData'>{{loadingButtonAllData}}</el-button>
      <!-- 手动洗数 -->
      <el-button type="primary" icon="el-icon-brush" @click="cleanToLastTimeData" :loading='loadingStatusToLastTimeData'>{{loadingButtonToLastTimeData}}</el-button>
      <!-- 自定义时间洗数 -->
      <el-button type="primary" icon="el-icon-date" @click="centerDialogVisible = true" :loading='loadingStatusSetupTimeData'>{{loadingButtonSetupTimeData}}</el-button>
  <!--    <el-button type="warning">警告按钮</el-button>-->
  <!--    <el-button type="danger">危险按钮</el-button>-->
    </el-row>

    <!--时间选择弹框-->
    <el-dialog
      title="选择洗数起止时间"
      :visible.sync="centerDialogVisible"
      width="30%"
      center>
      <div class="block" align="center">
      <span class="demonstration" ></span>
        <el-date-picker
            v-model="value2"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd HH:mm:ss"
            align="center"
            clearable
            @change="changeTime">
        </el-date-picker>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="cleanSetupTimeData">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'
import {fetch} from "../../../fetch"; // secondary package based on el-pagination


export default {
  name: "cleanData",
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      loadingStatusAllData: false,
      loadingButtonAllData: '全量洗数',
      loadingStatusToLastTimeData: false,
      loadingButtonToLastTimeData: '手动增量洗数',
      loadingStatusSetupTimeData: false,
      loadingButtonSetupTimeData: '自定义洗数',
      centerDialogVisible: false,
      start : null,
      end : null,
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      value2: []
    }
  },
  methods: {
    cleanAllData() {
      const _this = this;
      // 弹窗提示
      this.$confirm('将清洗全部数据，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 确定
        this.$message({
          type: 'success',
          message: '开始洗数!'
        });
        // 按钮切换为loading
        this.loadingStatusAllData = true;
        this.loadingButtonAllData = '洗数中...';
        // 调后台接口
        fetch.get({ url: '/clean/cleanAllData' }, res => {
          // 成功后提示
          this.$notify({
            title: '成功',
            message: '洗数成功',
            type: 'success',
            duration: 2000
          })
          // 恢复初始按钮状态
          this.loadingStatusAllData = false;
          this.loadingButtonAllData = '全量洗数';
        })
      }).catch(() => {
        // 取消并提示
        this.$message({
          type: 'info',
          message: '已取消洗数'
        });
      });
    },
    cleanToLastTimeData() {
      const _this = this;
      // 弹窗提示
      this.$confirm('将清洗当前时间至上一次洗数时间内的数据，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        // 确定
        this.$message({
          type: 'success',
          message: '开始增量洗数!'
        });
        // 按钮切换为loading
        this.loadingStatusToLastTimeData = true;
        this.loadingButtonToLastTimeData = '洗数中...';
        // 调后台接口
        fetch.get({ url: '/clean/cleanToLastTimeData' }, res => {
          this.$notify({
            title: '成功',
            message: '洗数成功',
            type: 'success',
            duration: 2000
          })
          // 恢复初始按钮状态
          this.loadingStatusToLastTimeData = false;
          this.loadingButtonToLastTimeData = '手动增量洗数';
        })
      }).catch(() => {
        // 取消并提示
        this.$message({
          type: 'info',
          message: '已取消洗数'
        });
      });
    },
    cleanSetupTimeData() {
      const _this = this;
      // 弹窗提示
      this.$confirm('将清洗'+this.value2[0]+'至'+this.value2[1]+'内的数据，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        // 确定
        this.$message({
          type: 'success',
          message: '开始洗数!'
        });
        this.centerDialogVisible = false;
        // 按钮切换为loading
        this.loadingStatusSetupTimeData = true;
        this.loadingButtonSetupTimeData = '洗数中...';
        // 调后台接口
        fetch.get({ url: '/clean/cleanSetupTimeData?start='+this.value2[0]+'&end='+this.value2[1] }, res => {
          this.$notify({
            title: '成功',
            message: '洗数成功',
            type: 'success',
            duration: 2000
          })
          // 恢复初始按钮状态
          this.loadingStatusSetupTimeData = false;
          this.loadingButtonSetupTimeData = '自定义洗数';
        })
      }).catch(() => {
        // 取消并提示
        this.$message({
          type: 'info',
          message: '已取消洗数'
        });
      });
    },
    changeTime(time) {
      console.log(time)
      console.log(this.value2)
    }

  },
  created() {
    const row = this.$route.params.row
    this.value2 = row ? [row.startDate, row.endDate] : ['', '']
  }
}

</script>

