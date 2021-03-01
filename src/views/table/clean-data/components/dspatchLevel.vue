<template>
  <div>
    <div>
      <h4 style="text-align: center">《处理级别》</h4>
    </div>
    <!-- 表格主体-->
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      style="width: 100%"
    >
      <el-table-column
        type="index"
        label="序号"
        width="70"
        :index="indexMethod"
      />

      <el-table-column
        prop="assignedLevel3Department"
        label="受派三级部门"
        width="400"
      />
      <el-table-column
        prop="assignedPerson"
        label="受派人"
        width="400"
      />
      <el-table-column
        prop="level"
        label="分派级别"
        width="400"
      />
      <el-table-column :label="$t('table.actions')" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <!-- 编辑按钮 -->
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            {{ $t('table.add') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页-->
    <div class="filter-container">
      <el-pagination
        :current-page="page"
        :page-sizes="[5, 10, 20, 50]"
        :page-size="limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <!-- 添加、编辑弹出框-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="受派三级部门" :label-width="formLabelWidth" prop="assignedLevel3Department">
          <el-input v-model="temp.assignedLevel3Department" autocomplete="off" style="width: 400px; margin-left: 5px;" />
        </el-form-item>
        <el-form-item label="受派人" :label-width="formLabelWidth" prop="assignedPerson">
          <el-input v-model="temp.assignedPerson" autocomplete="off" style="width: 400px; margin-left: 5px;" />
        </el-form-item>
        <el-form-item label="分派级别" :label-width="formLabelWidth" prop="level">
          <el-input v-model="temp.level" autocomplete="off" style="width: 400px; margin-left: 5px;" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          {{ $t('table.cancel') }}
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          {{ $t('table.confirm') }}
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { fetch } from '../../../../../fetch'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      tableKey: 0,
      listLoading: false,
      // 列表、分页
      list: [],
      data: [],
      limit: 5,
      total: null,
      page: 1,
      searchData: '',
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      showReviewer: false,
      select: {
        assignedLevel3Department: '',
        assignedPerson: '',
        level: ''
      },
      temp: {
        id: '',
        assignedLevel3Department: '',
        assignedPerson: '',
        level: ''
      },
      dialogFormVisible: false,
      formLabelWidth: '120px',
      dialogStatus: '',
      // 弹出框标题
      textMap: {
        update: '编辑数据',
        create: '新增数据'
      },
      // 必填提示
      rules: {
        assignedLevel3Department: [{ required: true, message: '这是必填字段，请填写', trigger: 'blur' }],
        level: [{ required: true, message: '这是必填字段，请填写', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getDspatchLevelAllData()
  },
  methods: {
    indexMethod(index) {
      return index + 1
    },
    getDspatchLevelAllData() {
      // 发请求拿到数据并暂存全部数据,方便之后操作
      const _this = this

      // 开启loading界面
      this.listLoading = true
      // 置空表单，避免增删改后，表单不刷新或新旧数据冗余
      this.list = []
      this.data = []
      fetch.get({ url: '/no/getDspatchLevelAllData' }, res => {
        console.log(res)
        res.data.forEach(function(val) {
          const item = []
          item.id = val.id
          item.assignedLevel3Department = val.assignedLevel3Department
          // 如果数据库受派人为空，处理为null字符串展示
          item.assignedPerson = val.assignedPerson == null ? 'null' : val.assignedPerson
          _this.data.push(item)
          _this.getList()
        })
        // loading
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    getList() {
      // 过滤得到满足搜索条件的展示数据list
      const list = this.data.filter((item, index) =>
        item.assignedLevel3Department.includes(this.select.assignedLevel3Department) &&
          item.assignedPerson.includes(this.select.assignedPerson)
      )
      this.list = list.filter((item, index) =>
        index < this.page * this.limit && index >= this.limit * (this.page - 1)
      )
      this.total = list.length
    },
    // 当每页数量改变
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.limit = val
      this.getList()
    },
    // 当前页改变
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.page = val
      this.getList()
    },
    // 搜索过滤数据
    search() {
      this.page = 1
      this.getList()
    },
    // 更新数据
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        const tempData = Object.assign({}, this.temp)
        tempData.timestamp = +new Date(tempData.timestamp)
        this.listLoading = true
        fetch.get({ url: '/no/setDspatchLevelNewData?assignedLevel3Department=' + this.temp.assignedLevel3Department +
              '&assignedPerson=' + this.temp.assignedPerson +
              '&level=' + this.temp.level }, res => {
          console.log(res)
          this.dialogFormVisible = false
          // 更新后刷新表单
          this.getDspatchLevelAllData()
          // 成功消息提醒
          this.$notify({
            title: '成功',
            message: '更新成功',
            type: 'success',
            duration: 2000
          })
        })
      })
    }

  }
}
</script>
