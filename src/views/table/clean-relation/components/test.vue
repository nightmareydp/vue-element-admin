<template>
  <div>
    <!-- 搜索框 -->
    <div class="filter-container">
      <!-- 标题搜索 -->
      <span class="demonstration">系统分类二层</span>
      <el-input v-model="select.systemClassificationLevel2" placeholder="系统分类二层" style="width: 150px; margin-left: 5px;" class="demonstration" prefix-icon="el-icon-search" />
      <span class="demonstration" style="margin-left: 10px;">系统分类三层</span>
      <el-input v-model="select.systemClassificationLevel3" placeholder="系统分类三层" style="width: 150px; margin-left: 5px;" class="demonstration" prefix-icon="el-icon-search" />
      <span class="demonstration" style="margin-left: 10px;">产品线</span>
      <el-input v-model="select.productLine" placeholder="产品线" style="width: 150px; margin-left: 5px;" class="demonstration" prefix-icon="el-icon-search" />
      <span class="demonstration" style="margin-left: 10px;">产品标签</span>
      <el-input v-model="select.productTag" placeholder="产品标签" style="width: 150px; margin-left: 5px;" class="demonstration" prefix-icon="el-icon-search" />
      <!-- 搜索按钮 -->
      <el-button v-waves class="demonstration" type="primary" icon="el-icon-search" style="margin-left: 10px;" @click="search">
        {{ $t('table.search') }}
      </el-button>
      <!-- 添加按钮 -->
      <el-button class="demonstration" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        {{ $t('table.add') }}
      </el-button>
      <!-- 导出 -->
      <el-button v-waves :loading="downloadLoading" class="demonstration" type="primary" icon="el-icon-download" @click="handleDownload">
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
        prop="systemClassificationLevel2"
        label="系统分类二层"
        width="300"
      />
      <el-table-column
        prop="systemClassificationLevel3"
        label="系统分类三层"
        width="300"
      />
      <el-table-column
        prop="productLine"
        label="产品线"
        width="300"
      />
      <el-table-column
        prop="productTag"
        label="产品标签"
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
        <el-form-item label="系统分类二层" :label-width="formLabelWidth" prop="systemClassificationLevel2">
          <el-input v-model="temp.systemClassificationLevel2" autocomplete="off" style="width: 400px; margin-left: 5px;" />
        </el-form-item>
        <el-form-item label="系统分类三层" :label-width="formLabelWidth" prop="systemClassificationLevel3">
          <el-input v-model="temp.systemClassificationLevel3" autocomplete="off" style="width: 400px; margin-left: 5px;" />
        </el-form-item>
        <el-form-item label="产品线" :label-width="formLabelWidth" prop="productLine">
          <el-input v-model="temp.productLine" autocomplete="off" style="width: 400px; margin-left: 5px;" />
        </el-form-item>
        <el-form-item label="产品标签" :label-width="formLabelWidth" prop="productTag">
          <el-input v-model="temp.productTag" autocomplete="off" style="width: 400px; margin-left: 5px;" />
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
    /* typeFilter(type) {
            return calendarTypeKeyValue[type]
          }*/
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
        systemClassificationLevel2: '',
        systemClassificationLevel3: '',
        productLine: '',
        productTag: ''
      },
      temp: {
        id: '',
        systemClassificationLevel2: '',
        systemClassificationLevel3: '',
        productLine: '',
        productTag: ''
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
        systemClassificationLevel2: [{ required: true, message: '这是必填字段，请填写', trigger: 'blur' }],
        systemClassificationLevel3: [{ required: true, message: '这是必填字段，请填写', trigger: 'blur' }],
        productLine: [{ required: true, message: '这是必填字段，请填写', trigger: 'blur' }],
        productTag: [{ required: true, message: '这是必填字段，请填写', trigger: 'blur' }]
      },
      downloadLoading: false,
      tableDataSystemProduct: []
    }
  },
  created() {
    this.getSystemProductAllData()
  },
  methods: {
    indexMethod(index) {
      return index + 1
    },
    getSystemProductAllData() {
      // 发请求拿到数据并暂存全部数据,方便之后操作
      const _this = this
      // 开启loading界面
      this.listLoading = true
      // 置空表单，避免增删改后，表单不刷新或新旧数据冗余
      this.list = []
      this.data = []
      fetch.get({ url: '/cleanRelation/getSystemProductAllData' }, res => {
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
        item.systemClassificationLevel2.includes(this.select.systemClassificationLevel2) &&
        item.systemClassificationLevel3.includes(this.select.systemClassificationLevel3) &&
        item.productLine.includes(this.select.productLine) &&
        item.productTag.includes(this.select.productTag)
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
      this.temp.systemClassificationLevel2 = ''
      this.temp.systemClassificationLevel3 = ''
      this.temp.productLine = ''
      this.temp.productTag = ''
      // 打开弹窗
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        fetch.get({ url: '/cleanRelation/setSystemProductNewData?systemClassificationLevel2=' + this.temp.systemClassificationLevel2 +
              '&systemClassificationLevel3=' + this.temp.systemClassificationLevel3 +
              '&productLine=' + this.temp.productLine +
              '&productTag=' + this.temp.productTag }, res => {
          console.log(res)
          this.dialogFormVisible = false
          // 新增后刷新表单
          this.getSystemProductAllData()
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
        fetch.get({ url: '/cleanRelation/updateSystemProductData?systemClassificationLevel2=' + this.temp.systemClassificationLevel2 +
            '&systemClassificationLevel3=' + this.temp.systemClassificationLevel3 +
            '&productLine=' + this.temp.productLine +
            '&productTag=' + this.temp.productTag +
            '&id=' + this.temp.id }, res => {
          console.log(res)
          this.dialogFormVisible = false
          // 更新后刷新表单
          this.getSystemProductAllData()
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
        fetch.get({ url: '/cleanRelation/deleteSystemProductData?id=' + this.temp.id }, res => {
          // 删除后刷新表单
          this.getSystemProductAllData()
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
    }

  }
}
</script>
