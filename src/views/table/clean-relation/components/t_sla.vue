<template>
  <div>
    <!-- 搜索框 -->
    <div class="filter-container">
      <!-- 标题搜索 -->
      <span class="demonstration">产品线（清洗后）</span>
      <el-input v-model="select.productLine" placeholder="产品线（清洗后）" style="width: 150px; margin-left: 5px;" class="demonstration" prefix-icon="el-icon-search" />
      <span class="demonstration" style="margin-left: 10px;">优先级别</span>
      <el-input v-model="select.priorityLevel" placeholder="优先级别" style="width: 150px; margin-left: 5px;" class="demonstration" prefix-icon="el-icon-search" />
      <span class="demonstration" style="margin-left: 10px;">响应标准时长</span>
      <el-input v-model="select.masterSla" placeholder="响应标准时长" style="width: 150px; margin-left: 5px;" class="demonstration" prefix-icon="el-icon-search" />
      <span class="demonstration" style="margin-left: 10px;">处理标准时长</span>
      <el-input v-model="select.sonSla" placeholder="处理标准时长" style="width: 150px; margin-left: 5px;" class="demonstration" prefix-icon="el-icon-search" />
      <!-- 搜索按钮 -->
      <el-button class="demonstration" type="primary" icon="el-icon-search" style="margin-left: 10px;" @click="search">
        {{ $t('table.search') }}
      </el-button>
      <!-- 添加按钮 -->
      <el-button class="demonstration" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        {{ $t('table.add') }}
      </el-button>
      <!-- 导出 -->
      <el-button :loading="downloadLoading" class="demonstration" type="primary" icon="el-icon-download" @click="handleDownload">
        {{ $t('table.export') }}
      </el-button>
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
        prop="id"
        label="ID"
        width="70"
      />
      <el-table-column
        prop="productLine"
        label="产品线（清洗后）"
        width="300"
      />
      <el-table-column
        prop="priorityLevel"
        label="优先级别"
        width="300"
      />
      <el-table-column
        prop="masterSla"
        label="响应标准时长"
        width="300"
      />
      <el-table-column
        prop="sonSla"
        label="处理标准时长"
        width="300"
      />
      <el-table-column :label="$t('table.actions')" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <!-- 编辑按钮 -->
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            {{ $t('table.edit') }}
          </el-button>
          <!-- 删除按钮 -->
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row)">
            {{ $t('table.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页-->
    <div class="filter-container">
      <el-pagination
        :current-page="page"
        :page-sizes="[10, 20, 50, 100]"
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
        <el-form-item label="产品线（清洗后）" :label-width="formLabelWidth" prop="productLine">
          <el-input v-model="temp.productLine" autocomplete="off" style="width: 400px; margin-left: 5px;" />
        </el-form-item>
        <el-form-item label="优先级别" :label-width="formLabelWidth" prop="priorityLevel">
          <el-input v-model="temp.priorityLevel" autocomplete="off" style="width: 400px; margin-left: 5px;" />
        </el-form-item>
        <el-form-item label="响应标准时长" :label-width="formLabelWidth" prop="masterSla">
          <el-input v-model="temp.masterSla" autocomplete="off" style="width: 400px; margin-left: 5px;" />
        </el-form-item>
        <el-form-item label="处理标准时长" :label-width="formLabelWidth" prop="sonSla">
          <el-input v-model="temp.sonSla" autocomplete="off" style="width: 400px; margin-left: 5px;" />
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
      limit: 20,
      total: null,
      page: 1,
      searchData: '',
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      showReviewer: false,
      select: {
        productLine: '',
        priorityLevel: '',
        masterSla: '',
        sonSla: ''
      },
      temp: {
        id: '',
        productLine: '',
        priorityLevel: '',
        masterSla: '',
        sonSla: ''
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
        productLine: [{ required: true, message: '这是必填字段，请填写', trigger: 'blur' }],
        priorityLevel: [{ required: true, message: '这是必填字段，请填写', trigger: 'blur' }],
        masterSla: [{ required: true, message: '这是必填字段，请填写', trigger: 'blur' }],
        sonSla: [{ required: true, message: '这是必填字段，请填写', trigger: 'blur' }]
      },
      downloadLoading: false
      // tableDataSystemProduct: []
    }
  },
  created() {
    this.getSlaAllData()
  },
  methods: {
    indexMethod(index) {
      return index + 1
    },
    getSlaAllData() {
      // 发请求拿到数据并暂存全部数据,方便之后操作
      const _this = this
      // 开启loading界面
      this.listLoading = true
      // 置空表单，避免增删改后，表单不刷新或新旧数据冗余
      this.list = []
      this.data = []
      fetch.get({ url: '/cleanRelation/getSlaAllData' }, res => {
        console.log(res)
        res.data.forEach(function(val) {
          _this.data.push(val)
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
        item.productLine.includes(this.select.productLine) &&
          item.priorityLevel.includes(this.select.priorityLevel) &&
          item.masterSla.includes(this.select.masterSla) &&
          item.sonSla.includes(this.select.sonSla)
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
    // 新建数据
    handleCreate() {
      // 置空弹框字段，避免之前填写内容或编辑带出内容影响
      this.temp.productLine = ''
      this.temp.priorityLevel = ''
      this.temp.masterSla = ''
      this.temp.sonSla = ''
      // 打开弹窗
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        fetch.get({ url: '/cleanRelation/setSlaNewData?productLine=' + this.temp.productLine +
              '&priorityLevel=' + this.temp.priorityLevel +
              '&masterSla=' + this.temp.masterSla +
              '&sonSla=' + this.temp.sonSla }, res => {
          console.log(res)
          this.dialogFormVisible = false
          // 新增后刷新表单
          this.getSlaAllData()
          // 成功消息提醒
          this.$notify({
            title: '成功',
            message: '创建成功',
            type: 'success',
            duration: 2000
          })
        })
      })
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
        // this.listLoading = true
        fetch.get({ url: '/cleanRelation/updateSlaData?productLine=' + this.temp.productLine +
              '&priorityLevel=' + this.temp.priorityLevel +
              '&masterSla=' + this.temp.masterSla +
              '&sonSla=' + this.temp.sonSla +
              '&id=' + this.temp.id }, res => {
          console.log(res)
          this.dialogFormVisible = false
          // 更新后刷新表单
          this.getSlaAllData()
          // 成功消息提醒
          this.$notify({
            title: '成功',
            message: '更新成功',
            type: 'success',
            duration: 2000
          })
        })
      })
    },
    // 删除数据
    handleDelete(row) {
      this.temp = Object.assign({}, row)
      // 弹窗提示
      this.$confirm('将删除此数据！确认是否删除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        fetch.get({ url: '/cleanRelation/deleteSlaData?id=' + this.temp.id }, res => {
          // 删除后刷新表单
          this.getSlaAllData()
          // 成功消息提醒
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
        })
      }).catch(() => {
        // 取消并提示
        this.$message({
          type: 'info',
          message: '取消删除'
        })
      })
    },
    handleDownload() {
      // 弹窗提示
      this.$confirm('敬请期待！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {

      }).catch(() => {
        // 取消并提示
        this.$message({
          type: 'info',
          message: '取消删除'
        })
      })
    }

  }
}
</script>
